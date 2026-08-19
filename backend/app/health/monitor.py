"""Real-Time Source Health Monitor and Telemetry Event Journal."""

from datetime import datetime
import logging
from typing import Dict, List, Optional
import uuid

from ..models.health import (
    CircuitState,
    HealthState,
    SourceMetrics,
    SystemHealthResponse,
    TelemetryEvent,
)

logger = logging.getLogger(__name__)


class SourceHealthMonitor:
    """
    Tracks telemetry metrics across all registered ingestion sources.
    Calculates deterministic health scores and maintains a live event journal.
    """

    def __init__(self, max_events: int = 150):
        self._metrics: Dict[str, SourceMetrics] = {}
        self._events: List[TelemetryEvent] = []
        self._max_events = max_events
        self._total_pipeline_requests = 0
        self._fallback_events_count = 0

    def get_or_create_metrics(self, source_name: str) -> SourceMetrics:
        if source_name not in self._metrics:
            self._metrics[source_name] = SourceMetrics(source_name=source_name)
        return self._metrics[source_name]

    def log_event(
        self,
        source: str,
        action: str,
        message: str,
        level: str = "INFO",
        details: Optional[Dict] = None
    ) -> TelemetryEvent:
        event = TelemetryEvent(
            id=str(uuid.uuid4())[:8],
            timestamp=datetime.utcnow(),
            level=level,
            source=source,
            action=action,
            message=message,
            details=details
        )
        self._events.insert(0, event)
        if len(self._events) > self._max_events:
            self._events.pop()

        log_fn = getattr(logger, level.lower(), logger.info)
        log_fn(f"[{source}] {action}: {message}")
        return event

    def record_request_start(self, source_name: str) -> None:
        metrics = self.get_or_create_metrics(source_name)
        metrics.total_requests += 1
        self._total_pipeline_requests += 1

    def record_request_success(
        self,
        source_name: str,
        latency_ms: float,
        total_records: int,
        valid_records: int,
        rejected_records: int,
        circuit_state: CircuitState
    ) -> None:
        metrics = self.get_or_create_metrics(source_name)
        metrics.successful_requests += 1
        metrics.consecutive_failures = 0
        metrics.consecutive_successes += 1
        metrics.last_latency_ms = round(latency_ms, 1)
        
        # Exponential moving average for latency
        if metrics.avg_latency_ms == 0.0:
            metrics.avg_latency_ms = round(latency_ms, 1)
        else:
            metrics.avg_latency_ms = round((metrics.avg_latency_ms * 0.7) + (latency_ms * 0.3), 1)

        metrics.total_records_ingested += total_records
        metrics.total_records_valid += valid_records
        metrics.total_records_rejected += rejected_records
        metrics.last_success_timestamp = datetime.utcnow()
        metrics.circuit_state = circuit_state

        if total_records == 0:
            metrics.empty_responses += 1

        self._recompute_health(metrics)

    def record_request_failure(
        self,
        source_name: str,
        error_message: str,
        latency_ms: float,
        circuit_state: CircuitState,
        cooldown_remaining: float = 0.0
    ) -> None:
        metrics = self.get_or_create_metrics(source_name)
        metrics.failed_requests += 1
        metrics.consecutive_failures += 1
        metrics.consecutive_successes = 0
        metrics.last_latency_ms = round(latency_ms, 1)
        metrics.last_failure_timestamp = datetime.utcnow()
        metrics.last_error_message = error_message
        metrics.circuit_state = circuit_state
        metrics.cooldown_remaining_seconds = cooldown_remaining

        if circuit_state == CircuitState.OPEN:
            metrics.circuit_tripped_count += 1
            metrics.last_circuit_trip_timestamp = datetime.utcnow()

        self._recompute_health(metrics)

    def record_fallback_used(self, primary_source: str, fallback_source: str) -> None:
        self._fallback_events_count += 1
        self.log_event(
            source=primary_source,
            action="FALLBACK_ACTIVATED",
            message=f"Primary source '{primary_source}' unavailable; traffic diverted to fallback '{fallback_source}'.",
            level="WARN",
            details={"fallback_source": fallback_source}
        )

    def _recompute_health(self, metrics: SourceMetrics) -> None:
        """
        Explainable Health Score & State Formula:
        Score = 100 - (Failure % * 0.5) - (Consecutive Failures * 25) - (Rejection % * 0.3)
        """
        if metrics.circuit_state == CircuitState.OPEN:
            metrics.health_score = 0.0
            metrics.health_state = HealthState.UNHEALTHY
            return

        total_reqs = max(1, metrics.total_requests)
        failure_rate = (metrics.failed_requests / total_reqs) * 100.0

        total_records = max(1, metrics.total_records_ingested)
        rejection_rate = (metrics.total_records_rejected / total_records) * 100.0

        score = 100.0
        score -= failure_rate * 0.4
        score -= min(60.0, metrics.consecutive_failures * 25.0)
        score -= rejection_rate * 0.3

        if metrics.circuit_state == CircuitState.HALF_OPEN:
            score = min(score, 45.0)

        score = max(0.0, min(100.0, score))
        metrics.health_score = round(score, 1)

        if metrics.health_score >= 80.0 and metrics.consecutive_failures == 0:
            metrics.health_state = HealthState.HEALTHY
        elif metrics.health_score >= 40.0:
            metrics.health_state = HealthState.DEGRADED
        else:
            metrics.health_state = HealthState.UNHEALTHY

    def get_system_health(self, active_primary: str) -> SystemHealthResponse:
        # Calculate overall status
        unhealthy_count = sum(1 for m in self._metrics.values() if m.health_state == HealthState.UNHEALTHY)
        degraded_count = sum(1 for m in self._metrics.values() if m.health_state == HealthState.DEGRADED)

        if unhealthy_count > 0 and unhealthy_count == len(self._metrics):
            overall = HealthState.UNHEALTHY
        elif degraded_count > 0 or unhealthy_count > 0:
            overall = HealthState.DEGRADED
        else:
            overall = HealthState.HEALTHY

        fallback_rate = 0.0
        if self._total_pipeline_requests > 0:
            fallback_rate = round((self._fallback_events_count / self._total_pipeline_requests) * 100.0, 1)

        return SystemHealthResponse(
            overall_health=overall,
            active_primary_source=active_primary,
            sources=self._metrics,
            recent_events=self._events[:50],
            total_pipeline_requests=self._total_pipeline_requests,
            fallback_rate=fallback_rate
        )
