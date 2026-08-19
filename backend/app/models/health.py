"""Health Monitoring, Metrics, and Telemetry Models."""

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class CircuitState(str, Enum):
    CLOSED = "CLOSED"      # Normal operation
    OPEN = "OPEN"          # Source failing, requests blocked
    HALF_OPEN = "HALF_OPEN"# Testing recovery with limited traffic


class HealthState(str, Enum):
    HEALTHY = "HEALTHY"
    DEGRADED = "DEGRADED"
    UNHEALTHY = "UNHEALTHY"


class SourceMetrics(BaseModel):
    """Real-time operational metrics for a specific job source."""
    source_name: str
    circuit_state: CircuitState = CircuitState.CLOSED
    health_state: HealthState = HealthState.HEALTHY
    health_score: float = Field(default=100.0, ge=0.0, le=100.0)
    
    total_requests: int = 0
    successful_requests: int = 0
    failed_requests: int = 0
    consecutive_failures: int = 0
    consecutive_successes: int = 0
    
    empty_responses: int = 0
    total_records_ingested: int = 0
    total_records_valid: int = 0
    total_records_rejected: int = 0
    
    last_latency_ms: float = 0.0
    avg_latency_ms: float = 0.0
    last_success_timestamp: Optional[datetime] = None
    last_failure_timestamp: Optional[datetime] = None
    last_error_message: Optional[str] = None
    
    circuit_tripped_count: int = 0
    last_circuit_trip_timestamp: Optional[datetime] = None
    cooldown_remaining_seconds: float = 0.0


class TelemetryEvent(BaseModel):
    """Timestamped log entry for system visibility & activity feed."""
    id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    level: str = "INFO"  # INFO, WARN, ERROR, SUCCESS
    source: str
    action: str          # e.g., "FETCH_START", "CIRCUIT_TRIPPED", "FALLBACK_ACTIVATED"
    message: str
    details: Optional[Dict] = None


class SystemHealthResponse(BaseModel):
    """Full health snapshot returned to developer/dashboard views."""
    overall_health: HealthState
    active_primary_source: str
    sources: Dict[str, SourceMetrics]
    recent_events: List[TelemetryEvent]
    total_pipeline_requests: int
    fallback_rate: float
