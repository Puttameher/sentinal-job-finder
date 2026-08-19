"""Normalized Job Data Models and Search Schemas."""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, HttpUrl, field_validator


class Job(BaseModel):
    """Normalized Job model common across all ingested sources."""
    id: str = Field(..., description="Unique deterministic identifier (source:external_id)")
    source: str = Field(..., description="Name of the source provider, e.g., 'remoteok', 'weworkremotely'")
    external_id: str = Field(..., description="ID from the originating platform")
    title: str = Field(..., min_length=2, description="Cleaned job position title")
    company: str = Field(..., min_length=1, description="Hiring company name")
    location: str = Field(default="Remote", description="Location or Remote status")
    url: str = Field(..., description="Direct link or apply URL for the posting")
    posted_at: Optional[datetime] = Field(default=None, description="Datetime when the posting was published")
    description: Optional[str] = Field(default="", description="Cleaned job description/summary")
    tags: List[str] = Field(default_factory=list, description="Categorization keywords/skills")
    salary_min: Optional[float] = Field(default=None, description="Minimum estimated salary")
    salary_max: Optional[float] = Field(default=None, description="Maximum estimated salary")
    salary_currency: Optional[str] = Field(default="USD", description="Currency symbol/code")
    employment_type: Optional[str] = Field(default="Full-time", description="Employment type (Full-time, Contract, etc.)")
    raw_preview: Optional[Dict[str, Any]] = Field(default=None, description="Snapshot of raw fields for debug")

    @field_validator("title", "company")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip() if v else v

    @field_validator("url")
    @classmethod
    def validate_url_str(cls, v: str) -> str:
        if not v or not (v.startswith("http://") or v.startswith("https://")):
            raise ValueError("URL must start with http:// or https://")
        return v.strip()


class JobSearchParams(BaseModel):
    """Search & filtering criteria passed by the client UI."""
    query: Optional[str] = Field(default=None, description="Keywords or job title")
    location: Optional[str] = Field(default=None, description="Location search query")
    company: Optional[str] = Field(default=None, description="Specific company filter")
    tags: Optional[List[str]] = Field(default_factory=list, description="Required skill tags")
    preferred_source: Optional[str] = Field(default=None, description="Force a specific source (optional)")
    limit: int = Field(default=50, ge=1, le=200, description="Max jobs to return")
    offset: int = Field(default=0, ge=0, description="Pagination offset")


class ValidationIssue(BaseModel):
    """Describes a validation failure on an individual ingested record."""
    external_id: Optional[str] = None
    field: str
    error: str
    raw_sample: Optional[Dict[str, Any]] = None


class BatchValidationResult(BaseModel):
    """Aggregate result of running typed validation on a batch."""
    total_received: int
    valid_count: int
    rejected_count: int
    valid_jobs: List[Job]
    rejected_issues: List[ValidationIssue]
    validation_rate: float


class IngestionResponse(BaseModel):
    """API response delivered to the frontend client."""
    jobs: List[Job]
    total_count: int
    source_used: str
    fallback_activated: bool = False
    fallback_chain: List[str] = Field(default_factory=list)
    latency_ms: float
    validation_rate: float
    health_state: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
