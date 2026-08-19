"""Schema Drift and AI Diagnostic Models."""

from datetime import datetime
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class FieldDriftInfo(BaseModel):
    """Information regarding a detected field mismatch or missing key."""
    expected_field: str
    observed_field_candidates: List[str] = Field(default_factory=list)
    missing_frequency_pct: float
    sample_values: List[Any] = Field(default_factory=list)


class DriftReport(BaseModel):
    """Drift analysis report generated when structural mismatches are detected."""
    source_name: str
    drift_detected: bool
    severity: str = "LOW"  # LOW, MEDIUM, CRITICAL
    detected_at: datetime = Field(default_factory=datetime.utcnow)
    total_records_analyzed: int
    missing_required_fields: List[str] = Field(default_factory=list)
    unexpected_new_fields: List[str] = Field(default_factory=list)
    field_details: List[FieldDriftInfo] = Field(default_factory=list)
    observed_schema_sample: Dict[str, Any] = Field(default_factory=dict)
    summary: str


class FieldMappingSuggestion(BaseModel):
    """AI or rule-suggested translation from drifted field to canonical field."""
    canonical_field: str
    suggested_source_field: str
    confidence: float = Field(ge=0.0, le=1.0)
    reasoning: str


class DriftDiagnosisResponse(BaseModel):
    """Output of AI Schema Drift Assistant."""
    model_config = {"protected_namespaces": ()}

    source_name: str
    analysis: str
    suggested_mappings: List[FieldMappingSuggestion]
    suggested_adapter_patch: Optional[str] = None
    ai_generated: bool = True
    model_used: str = "Heuristic + Semantic Drift Analyzer"
