"""Sentinel FastAPI Application Entrypoint.

Exposes REST APIs for job discovery, developer system telemetry, real-time
fault simulation, and AI schema drift diagnosis.
"""

import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from .ai.drift_assistant import AIDriftAssistant
from .health.monitor import SourceHealthMonitor
from .ingestion.orchestrator import IngestionOrchestrator
from .models.drift import DriftDiagnosisResponse, DriftReport
from .models.health import SystemHealthResponse, TelemetryEvent
from .models.job import IngestionResponse, JobSearchParams
from .resilience.pacer import RequestPacer
from .sources.registry import SourceRegistry
from .sources.sandbox import SandboxJobSource

app = FastAPI(
    title="Sentinel — Adaptive Job Ingestion System API",
    description="Resilient Ingestion Engine with Circuit Breaker, Deterministic Fallbacks, and AI Drift Diagnosis",
    version="1.0.0"
)

# Enable CORS for local dev and preview deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Singletons
source_registry = SourceRegistry()
health_monitor = SourceHealthMonitor()
request_pacer = RequestPacer(min_interval_seconds=0.3, max_retries=2)
orchestrator = IngestionOrchestrator(
    registry=source_registry,
    health_monitor=health_monitor,
    pacer=request_pacer
)
ai_drift_assistant = AIDriftAssistant()


# Request / Response Schemas for API
class DemoSimulationRequest(BaseModel):
    action: str = Field(..., description="Action: 'simulate_500', 'simulate_429', 'simulate_drift', 'simulate_malformed', 'simulate_empty', 'trip_circuit', 'restore'")
    target_source: str = Field(default="sandbox_source", description="Source to inject fault into")


class SourceOrderRequest(BaseModel):
    priority_order: List[str]


# API Router - Allows serving routes with /api prefix as well as root-relative for serverless rewrites
api_router = APIRouter()


@api_router.get("/", tags=["General"])
async def root():
    return {
        "system": "Sentinel Job Ingestion System",
        "status": "OPERATIONAL",
        "docs": "/docs",
        "version": "1.0.0"
    }


@api_router.get("/jobs", response_model=IngestionResponse, tags=["Jobs"])
async def get_jobs(
    query: Optional[str] = Query(None, description="Keywords / title"),
    location: Optional[str] = Query(None, description="Location filter"),
    company: Optional[str] = Query(None, description="Company filter"),
    preferred_source: Optional[str] = Query(None, description="Force a specific source (e.g. 'remoteok', 'weworkremotely_rss', 'sandbox_source')"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """
    Search and retrieve normalized jobs. Pipeline executes resilient routing,
    circuit breaker verification, typed validation, drift checking, and fallback if needed.
    """
    params = JobSearchParams(
        query=query,
        location=location,
        company=company,
        preferred_source=preferred_source,
        limit=limit,
        offset=offset
    )
    return await orchestrator.ingest_jobs(params)


@api_router.get("/health", response_model=SystemHealthResponse, tags=["Observability"])
async def get_system_health():
    """Returns real-time health scores, circuit breaker states, and metrics for all sources."""
    primary_source = source_registry.get_ordered_source_names()[0]
    return health_monitor.get_system_health(active_primary=primary_source)


@api_router.get("/sources", tags=["Observability"])
async def list_sources():
    """Returns configured source registry and active priority fallback order."""
    sources_info = []
    for name, src in source_registry.get_all_sources().items():
        cb = orchestrator.get_circuit_breaker(name)
        metrics = health_monitor.get_or_create_metrics(name)
        sources_info.append({
            "name": name,
            "type": src.source_type,
            "base_url": src.base_url,
            "circuit_state": cb.state.value if cb else "UNKNOWN",
            "health_state": metrics.health_state.value,
            "health_score": metrics.health_score,
            "consecutive_failures": cb.consecutive_failures if cb else 0,
            "trip_count": cb.trip_count if cb else 0,
            "cooldown_remaining": cb.cooldown_remaining if cb else 0.0
        })
    return {
        "sources": sources_info,
        "priority_order": source_registry.get_ordered_source_names()
    }


@api_router.get("/telemetry", response_model=List[TelemetryEvent], tags=["Observability"])
async def get_telemetry():
    """Returns recent timestamped activity and resilience events."""
    return health_monitor._events[:50]


@api_router.post("/demo/simulate", tags=["Demo & Resilience Testing"])
async def simulate_fault(req: DemoSimulationRequest):
    """
    Fault injection control panel for live resilience demonstration.
    Allows testing circuit breakers, rate limits, and schema drift cleanly.
    """
    sandbox_src = source_registry.get_source("sandbox_source")
    cb = orchestrator.get_circuit_breaker(req.target_source)

    if req.action == "simulate_500":
        if isinstance(sandbox_src, SandboxJobSource):
            sandbox_src.set_fault_mode("http_500")
        if cb:
            cb.record_failure("Simulated 500 Internal Server Error")
        health_monitor.log_event(
            source=req.target_source,
            action="FAULT_INJECTED_500",
            message="Fault injection active: Source returning HTTP 500.",
            level="ERROR"
        )
        return {"status": "success", "message": f"Injected HTTP 500 into {req.target_source}"}

    elif req.action == "simulate_429":
        if isinstance(sandbox_src, SandboxJobSource):
            sandbox_src.set_fault_mode("rate_limit_429")
        if cb:
            cb.record_failure("Simulated 429 Rate Limit Exceeded")
        health_monitor.log_event(
            source=req.target_source,
            action="FAULT_INJECTED_429",
            message="Fault injection active: Source returning HTTP 429 Rate Limit.",
            level="WARN"
        )
        return {"status": "success", "message": f"Injected HTTP 429 Rate Limit into {req.target_source}"}

    elif req.action == "simulate_drift":
        if isinstance(sandbox_src, SandboxJobSource):
            sandbox_src.set_fault_mode("schema_drift")
        health_monitor.log_event(
            source=req.target_source,
            action="FAULT_INJECTED_SCHEMA_DRIFT",
            message="Fault injection active: Upstream field names mutated ('position' -> 'job_headline').",
            level="WARN"
        )
        return {"status": "success", "message": f"Injected Schema Drift into {req.target_source}"}

    elif req.action == "simulate_malformed":
        if isinstance(sandbox_src, SandboxJobSource):
            sandbox_src.set_fault_mode("malformed_json")
        health_monitor.log_event(
            source=req.target_source,
            action="FAULT_INJECTED_MALFORMED",
            message="Fault injection active: Malformed/corrupted payload records.",
            level="WARN"
        )
        return {"status": "success", "message": f"Injected Malformed JSON into {req.target_source}"}

    elif req.action == "simulate_empty":
        if isinstance(sandbox_src, SandboxJobSource):
            sandbox_src.set_fault_mode("empty_response")
        health_monitor.log_event(
            source=req.target_source,
            action="FAULT_INJECTED_EMPTY",
            message="Fault injection active: Empty response payload [].",
            level="WARN"
        )
        return {"status": "success", "message": f"Injected Empty Response into {req.target_source}"}

    elif req.action == "trip_circuit":
        if cb:
            cb.trip_manually("Manually tripped via Demo Control Panel")
        return {"status": "success", "message": f"Circuit breaker for {req.target_source} manually tripped to OPEN"}

    elif req.action == "restore":
        if isinstance(sandbox_src, SandboxJobSource):
            sandbox_src.set_fault_mode("none")
        for src_name, cbreaker in orchestrator.circuit_breakers.items():
            cbreaker.reset_manually()
        health_monitor.log_event(
            source="system",
            action="SYSTEM_RESTORED",
            message="All fault simulations cleared; circuit breakers reset to CLOSED.",
            level="SUCCESS"
        )
        return {"status": "success", "message": "All sources restored to healthy state."}

    else:
        raise HTTPException(status_code=400, detail=f"Unknown simulation action '{req.action}'")


@api_router.post("/priority", tags=["Orchestration"])
async def update_source_priority(req: SourceOrderRequest):
    """Dynamically change fallback priority sequence."""
    try:
        source_registry.set_primary_order(req.priority_order)
        return {"status": "success", "priority_order": source_registry.get_ordered_source_names()}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@api_router.get("/drift/report/{source_name}", response_model=Optional[DriftReport], tags=["Schema Drift"])
async def get_drift_report(source_name: str):
    """Retrieve the latest schema drift evaluation report for a given source."""
    return orchestrator.get_last_drift_report(source_name)


@api_router.post("/ai/diagnose-drift", response_model=DriftDiagnosisResponse, tags=["AI Diagnostics"])
async def diagnose_schema_drift(source_name: str = Query("sandbox_source")):
    """
    Triggers AI-assisted schema drift diagnosis. Analyzes missing keys vs observed keys,
    proposes typed field mappings, and generates connector patch guidance.
    """
    report = orchestrator.get_last_drift_report(source_name)
    if not report or not report.drift_detected:
        # If no active drift report exists yet, generate one from sandbox drifted schema for demo
        sbx = source_registry.get_source("sandbox_source")
        if isinstance(sbx, SandboxJobSource):
            old_mode = sbx.fault_mode
            sbx.set_fault_mode("schema_drift")
            sample_records = await sbx.fetch_raw(JobSearchParams())
            report = orchestrator.drift_detector.detect_drift(
                source_name=source_name,
                expected_keys=sbx.get_expected_schema_keys(),
                raw_records=sample_records,
                validation_rejection_count=len(sample_records)
            )
            sbx.set_fault_mode(old_mode)

    return await ai_drift_assistant.diagnose_drift(report)


@api_router.get("/detection-surface", tags=["Documentation"])
async def get_detection_surface_doc():
    """Returns technical overview of detection surface, pacing policy, and ethical stopping boundary."""
    return {
        "detection_surface_analysis": {
            "network_fingerprints": [
                "TLS Client Hello cipher suites & ALPN negotiation",
                "HTTP/2 SETTINGS frame parameters & header pseudo-ordering",
                "IP reputation, ASN categorization (Datacenter vs Residential vs Mobile)"
            ],
            "header_signatures": [
                "User-Agent structure & consistency with Sec-CH-UA client hints",
                "Accept, Accept-Language, and Referer header completeness",
                "Absence of expected browser headers during direct API invocation"
            ],
            "behavioral_patterns": [
                "High request frequency and non-human interval regularity (mitigated by jitter)",
                "Sequential paging traversal without prior search referrer",
                "Rapid multi-tab concurrent fetching"
            ]
        },
        "sentinel_resilience_strategy": {
            "request_pacing": "Bounded exponential backoff with Gaussian jitter and minimum interval enforcement",
            "circuit_breaker": "3-state machine (CLOSED -> OPEN -> HALF_OPEN) preventing cascading load on failing sources",
            "graceful_degradation": "Deterministic multi-tier fallback routing from Primary API to RSS XML feed to Controlled Sandbox",
            "isolation": "Typed Pydantic batch validation isolating corrupt individual records without aborting batches"
        },
        "ethical_stopping_boundary": {
            "permitted": "Public structured APIs, public RSS feeds, controlled sandbox environments, polite backoff",
            "strictly_forbidden": "CAPTCHA solving services, session/cookie credential stuffing, anti-bot circumvention, authentication bypass, private data extraction"
        }
    }


# Include router under /api for all API routes
app.include_router(api_router, prefix="/api")


# Mount Static UI Files if compiled
dist_candidates = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")),
    os.path.abspath(os.path.join(os.getcwd(), "frontend", "dist")),
    os.path.abspath(os.path.join(os.getcwd(), "dist")),
]

for d in dist_candidates:
    if os.path.exists(d) and os.path.isdir(d):
        app.mount("/", StaticFiles(directory=d, html=True), name="static_ui")
        break
