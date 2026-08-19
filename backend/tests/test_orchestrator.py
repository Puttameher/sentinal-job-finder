"""Tests for End-to-End Resilient Ingestion Orchestrator and Fallbacks."""

import pytest
from app.health.monitor import SourceHealthMonitor
from app.ingestion.orchestrator import IngestionOrchestrator
from app.models.health import CircuitState
from app.models.job import JobSearchParams
from app.resilience.pacer import RequestPacer
from app.sources.registry import SourceRegistry
from app.sources.sandbox import SandboxJobSource


@pytest.mark.asyncio
async def test_orchestrator_successful_sandbox_ingestion():
    registry = SourceRegistry()
    registry.set_primary_order(["sandbox_source"])
    
    health_monitor = SourceHealthMonitor()
    pacer = RequestPacer(min_interval_seconds=0.0, max_retries=1)
    
    orchestrator = IngestionOrchestrator(
        registry=registry,
        health_monitor=health_monitor,
        pacer=pacer
    )
    
    response = await orchestrator.ingest_jobs(JobSearchParams(limit=10))
    
    assert response.source_used == "sandbox_source"
    assert response.fallback_activated is False
    assert len(response.jobs) > 0
    assert response.validation_rate == 100.0
    assert response.health_state == "HEALTHY"


@pytest.mark.asyncio
async def test_orchestrator_fallback_when_primary_trips():
    registry = SourceRegistry()
    # Primary: Sandbox (fault-injected to 500)
    # Secondary Fallback: Sandbox Secondary
    sbx_primary = SandboxJobSource()
    sbx_primary._name = "primary_failing_sbx"
    sbx_primary.set_fault_mode("http_500")

    sbx_secondary = SandboxJobSource()
    sbx_secondary._name = "secondary_working_sbx"
    sbx_secondary.set_fault_mode("none")

    registry = SourceRegistry()
    registry._sources = {
        "primary_failing_sbx": sbx_primary,
        "secondary_working_sbx": sbx_secondary
    }
    registry._default_source_order = ["primary_failing_sbx", "secondary_working_sbx"]

    health_monitor = SourceHealthMonitor()
    pacer = RequestPacer(min_interval_seconds=0.0, max_retries=1, initial_backoff_seconds=0.01)
    
    orchestrator = IngestionOrchestrator(
        registry=registry,
        health_monitor=health_monitor,
        pacer=pacer
    )

    # Ingest jobs: primary fails, orchestrator must automatically activate secondary fallback
    response = await orchestrator.ingest_jobs(JobSearchParams(limit=10))

    assert response.fallback_activated is True
    assert response.source_used == "secondary_working_sbx"
    assert "primary_failing_sbx" in response.fallback_chain
    assert len(response.jobs) > 0


@pytest.mark.asyncio
async def test_orchestrator_circuit_breaker_blocks_and_diverts():
    registry = SourceRegistry()
    sbx_primary = SandboxJobSource()
    sbx_primary._name = "primary_src"
    
    sbx_secondary = SandboxJobSource()
    sbx_secondary._name = "fallback_src"
    
    registry._sources = {"primary_src": sbx_primary, "fallback_src": sbx_secondary}
    registry._default_source_order = ["primary_src", "fallback_src"]

    health_monitor = SourceHealthMonitor()
    pacer = RequestPacer(min_interval_seconds=0.0, max_retries=0)
    orchestrator = IngestionOrchestrator(registry=registry, health_monitor=health_monitor, pacer=pacer)

    # Manually trip primary circuit to OPEN
    cb = orchestrator.get_circuit_breaker("primary_src")
    cb.trip_manually("Testing circuit trip")

    assert cb.state == CircuitState.OPEN
    assert cb.allow_request() is False

    # Perform search -> should immediately bypass primary and use fallback without error
    response = await orchestrator.ingest_jobs(JobSearchParams())

    assert response.source_used == "fallback_src"
    assert "primary_src" in response.fallback_chain
    assert response.fallback_activated is True
