"""Resilient Ingestion Orchestrator.

Coordinates source selection, circuit breaker evaluation, paced fetching,
fault fallback routing, normalization, batch validation, schema drift detection,
and telemetry logging.
"""

from datetime import datetime
import logging
import time
from typing import Dict, List, Optional, Tuple

from ..health.monitor import SourceHealthMonitor
from ..models.drift import DriftReport
from ..models.job import (
    BatchValidationResult,
    IngestionResponse,
    Job,
    JobSearchParams,
)
from ..resilience.circuit_breaker import CircuitBreaker
from ..resilience.pacer import RequestPacer
from ..sources.base import JobSource
from ..sources.registry import SourceRegistry
from ..validation.drift_detector import SchemaDriftDetector
from ..validation.validator import BatchValidator

logger = logging.getLogger(__name__)


class IngestionOrchestrator:
    """
    Central orchestration pipeline implementing the resilience feedback loop.
    """

    def __init__(
        self,
        registry: Optional[SourceRegistry] = None,
        health_monitor: Optional[SourceHealthMonitor] = None,
        pacer: Optional[RequestPacer] = None,
    ):
        self.registry = registry or SourceRegistry()
        self.health_monitor = health_monitor or SourceHealthMonitor()
        self.pacer = pacer or RequestPacer()
        self.drift_detector = SchemaDriftDetector()
        
        # Instantiate circuit breakers for all registered sources
        self.circuit_breakers: Dict[str, CircuitBreaker] = {}
        for source_name in self.registry.get_all_sources().keys():
            cb = CircuitBreaker(source_name=source_name, failure_threshold=3, recovery_cooldown_seconds=15.0)
            cb.set_on_state_change_callback(self._on_circuit_state_change)
            self.circuit_breakers[source_name] = cb

        self._last_drift_reports: Dict[str, DriftReport] = {}

    def _on_circuit_state_change(self, source_name: str, old_state, new_state, reason: str):
        level = "WARN" if new_state.value == "HALF_OPEN" else ("ERROR" if new_state.value == "OPEN" else "SUCCESS")
        self.health_monitor.log_event(
            source=source_name,
            action=f"CIRCUIT_{new_state.value}",
            message=f"Circuit state changed {old_state.value} -> {new_state.value}. {reason}",
            level=level,
            details={"old_state": old_state.value, "new_state": new_state.value, "reason": reason}
        )

    def get_circuit_breaker(self, source_name: str) -> Optional[CircuitBreaker]:
        return self.circuit_breakers.get(source_name)

    def get_last_drift_report(self, source_name: str) -> Optional[DriftReport]:
        return self._last_drift_reports.get(source_name)

    async def ingest_jobs(self, params: JobSearchParams) -> IngestionResponse:
        """
        Execute full resilient ingestion lifecycle with deterministic fallback.
        """
        start_time = time.time()
        fallback_chain: List[str] = []
        
        # Determine candidate source list
        if params.preferred_source and params.preferred_source in self.registry.get_all_sources():
            candidate_sources = [params.preferred_source]
            # append other sources as fallbacks
            for s in self.registry.get_ordered_source_names():
                if s != params.preferred_source:
                    candidate_sources.append(s)
        else:
            candidate_sources = self.registry.get_ordered_source_names()

        primary_source_name = candidate_sources[0]
        selected_source: Optional[JobSource] = None
        raw_records = []
        fetch_error_msg = ""
        used_fallback = False

        for idx, source_name in enumerate(candidate_sources):
            source = self.registry.get_source(source_name)
            cb = self.circuit_breakers.get(source_name)
            if not source or not cb:
                continue

            # Check if circuit allows traffic
            if not cb.allow_request():
                self.health_monitor.log_event(
                    source=source_name,
                    action="REQUEST_BLOCKED_CIRCUIT_OPEN",
                    message=f"Circuit is {cb.state.value} (cooldown: {cb.cooldown_remaining}s). Skipping to fallback.",
                    level="WARN"
                )
                fallback_chain.append(source_name)
                continue

            # Attempt fetching from this source
            self.health_monitor.record_request_start(source_name)
            self.health_monitor.log_event(
                source=source_name,
                action="FETCH_START",
                message=f"Starting ingestion fetch (Type: {source.source_type}).",
                level="INFO"
            )

            req_start = time.time()
            try:
                raw_records = await self.pacer.execute_with_retry(
                    source_name=source_name,
                    operation=lambda s=source: s.fetch_raw(params),
                    on_retry_cb=lambda s, attempt, backoff, err: self.health_monitor.log_event(
                        source=s,
                        action="RETRY_ATTEMPT",
                        message=f"Retry #{attempt} after {backoff:.2f}s backoff. Error: {err}",
                        level="WARN"
                    )
                )
                
                req_latency = (time.time() - req_start) * 1000.0
                cb.record_success()
                selected_source = source
                if idx > 0:
                    used_fallback = True
                    self.health_monitor.record_fallback_used(primary_source_name, source_name)
                break  # Successful fetch!

            except Exception as e:
                req_latency = (time.time() - req_start) * 1000.0
                fetch_error_msg = str(e)
                cb.record_failure(fetch_error_msg)
                
                self.health_monitor.record_request_failure(
                    source_name=source_name,
                    error_message=fetch_error_msg,
                    latency_ms=req_latency,
                    circuit_state=cb.state,
                    cooldown_remaining=cb.cooldown_remaining
                )
                self.health_monitor.log_event(
                    source=source_name,
                    action="FETCH_FAILED",
                    message=f"Ingestion failed: {fetch_error_msg}",
                    level="ERROR",
                    details={"error": fetch_error_msg, "circuit_state": cb.state.value}
                )
                fallback_chain.append(source_name)

        # If all sources in fallback chain failed
        if selected_source is None:
            total_latency = (time.time() - start_time) * 1000.0
            return IngestionResponse(
                jobs=[],
                total_count=0,
                source_used="none",
                fallback_activated=True,
                fallback_chain=fallback_chain,
                latency_ms=round(total_latency, 1),
                validation_rate=0.0,
                health_state="UNHEALTHY",
                timestamp=datetime.utcnow()
            )

        # Normalization Step
        source_name = selected_source.name
        normalized_candidates: List[Optional[Job]] = []
        for raw_item in raw_records:
            norm_job = selected_source.normalize(raw_item)
            normalized_candidates.append(norm_job)

        # Typed Validation Step
        validation_result: BatchValidationResult = BatchValidator.validate_batch(
            candidates=normalized_candidates,
            raw_records=raw_records
        )

        self.health_monitor.log_event(
            source=source_name,
            action="BATCH_VALIDATED",
            message=f"Validated {validation_result.valid_count}/{validation_result.total_received} records ({validation_result.validation_rate}% valid).",
            level="INFO" if validation_result.validation_rate >= 80 else "WARN",
            details={
                "valid": validation_result.valid_count,
                "rejected": validation_result.rejected_count,
                "rejection_issues": [i.model_dump() for i in validation_result.rejected_issues[:5]]
            }
        )

        # Schema Drift Analysis Step
        drift_report = self.drift_detector.detect_drift(
            source_name=source_name,
            expected_keys=selected_source.get_expected_schema_keys(),
            raw_records=raw_records,
            validation_rejection_count=validation_result.rejected_count
        )
        self._last_drift_reports[source_name] = drift_report

        if drift_report.drift_detected:
            self.health_monitor.log_event(
                source=source_name,
                action="SCHEMA_DRIFT_DETECTED",
                message=drift_report.summary,
                level="WARN",
                details={"missing": drift_report.missing_required_fields, "new": drift_report.unexpected_new_fields}
            )

        # Record health metrics
        total_latency = (time.time() - start_time) * 1000.0
        cb = self.circuit_breakers[source_name]
        self.health_monitor.record_request_success(
            source_name=source_name,
            latency_ms=total_latency,
            total_records=validation_result.total_received,
            valid_records=validation_result.valid_count,
            rejected_records=validation_result.rejected_count,
            circuit_state=cb.state
        )

        # Apply client filters (query, location, company, tags)
        filtered_jobs = self._apply_client_filters(validation_result.valid_jobs, params)
        total_matched = len(filtered_jobs)
        paginated_jobs = filtered_jobs[params.offset : params.offset + params.limit]

        metrics = self.health_monitor.get_or_create_metrics(source_name)

        return IngestionResponse(
            jobs=paginated_jobs,
            total_count=total_matched,
            source_used=source_name,
            fallback_activated=used_fallback,
            fallback_chain=fallback_chain,
            latency_ms=round(total_latency, 1),
            validation_rate=validation_result.validation_rate,
            health_state=metrics.health_state.value,
            timestamp=datetime.utcnow()
        )

    def _apply_client_filters(self, jobs: List[Job], params: JobSearchParams) -> List[Job]:
        """In-memory filtering for responsive search criteria with multi-token keyword support."""
        results = jobs

        if params.query:
            raw_q = params.query.strip().lower()
            tokens = [t for t in raw_q.split() if len(t) > 1 or t in ("ai", "ml", "go", "c#", "ui", "ux")]
            
            def matches_query(j: Job) -> bool:
                title_lower = j.title.lower()
                desc_lower = j.description.lower()
                comp_lower = j.company.lower()
                tags_lower = [t.lower() for t in j.tags]
                
                # Check exact phrase first
                if raw_q in title_lower or raw_q in desc_lower or any(raw_q in t for t in tags_lower):
                    return True
                
                # Check if all tokens match across title, tags, company, or description
                if tokens:
                    return all(
                        tok in title_lower or tok in desc_lower or tok in comp_lower or any(tok in t for t in tags_lower)
                        for tok in tokens
                    )
                return False

            results = [j for j in results if matches_query(j)]

        if params.location and params.location.lower() != "any":
            loc_q = params.location.lower()
            results = [j for j in results if loc_q in j.location.lower()]

        if params.company and params.company.lower() != "any":
            comp_q = params.company.lower()
            results = [j for j in results if comp_q in j.company.lower()]

        if params.tags and len(params.tags) > 0:
            for tag in params.tags:
                t_lower = tag.lower()
                results = [j for j in results if any(t_lower in jt.lower() for jt in j.tags)]

        return results
