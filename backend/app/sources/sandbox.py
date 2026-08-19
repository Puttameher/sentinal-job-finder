"""Controlled Sandbox Job Connector with Real-Time Fault Injection.

Enables safe, reproducible live demonstrations of failure recovery, rate limits,
schema drift, malformed payloads, and circuit breaker activation without abusing
external services.
"""

from datetime import datetime, timedelta
import random
from typing import Any, Dict, List, Optional
import httpx

from .base import JobSource
from ..models.job import Job, JobSearchParams


class SandboxJobSource(JobSource):
    """
    Controlled sandbox source with stateful fault simulation.
    Fault modes:
      - 'none': Returns clean canonical mock records
      - 'http_500': Raises HTTP 500 Internal Server Error
      - 'rate_limit_429': Raises HTTP 429 Rate Limit Exceeded
      - 'empty_response': Returns empty list []
      - 'malformed_json': Returns records with corrupted datatypes/structures
      - 'schema_drift': Returns renamed fields (e.g., 'position' -> 'job_title', 'company' -> 'employer_name')
      - 'slow_timeout': Induces latency simulating hanging network
    """

    def __init__(self):
        self._name = "sandbox_source"
        self._source_type = "SANDBOX"
        self._base_url = "https://sandbox.sentinel.internal/jobs"
        self.fault_mode: str = "none"
        self.latency_simulation_ms: float = 80.0

    @property
    def name(self) -> str:
        return self._name

    @property
    def source_type(self) -> str:
        return self._source_type

    @property
    def base_url(self) -> str:
        return self._base_url

    def set_fault_mode(self, mode: str) -> str:
        valid_modes = [
            "none",
            "http_500",
            "rate_limit_429",
            "empty_response",
            "malformed_json",
            "schema_drift",
            "slow_timeout"
        ]
        if mode not in valid_modes:
            raise ValueError(f"Invalid fault mode '{mode}'. Choose from: {valid_modes}")
        self.fault_mode = mode
        return self.fault_mode

    def get_expected_schema_keys(self) -> List[str]:
        return ["job_id", "title", "company", "apply_url", "skills", "location"]

    async def fetch_raw(self, params: JobSearchParams) -> List[Dict[str, Any]]:
        """Simulates fetching with active fault mode."""
        if self.fault_mode == "http_500":
            request = httpx.Request("GET", self._base_url)
            response = httpx.Response(500, request=request, text="Internal Server Error: Database Connection Pool Exhausted")
            raise httpx.HTTPStatusError("500 Internal Server Error (Simulated Sandbox Fault)", request=request, response=response)

        elif self.fault_mode == "rate_limit_429":
            request = httpx.Request("GET", self._base_url)
            response = httpx.Response(429, request=request, text="Too Many Requests: Rate limit exceeded (429)")
            raise httpx.HTTPStatusError("429 Too Many Requests (Simulated Sandbox Rate Limit)", request=request, response=response)

        elif self.fault_mode == "empty_response":
            return []

        elif self.fault_mode == "malformed_json":
            # Records with corrupted missing fields and malformed types
            return [
                {"bad_key": None, "corrupt_data": True},
                {"job_id": 101, "title": None, "company": ""},  # empty title & company
                {"job_id": "bad-url-id", "title": "Senior Engineer", "company": "Broken Co", "apply_url": "ftp://not-http"},
                {"job_id": "valid-1", "title": "Valid Backend Engineer", "company": "Robust Systems", "apply_url": "https://example.com/apply/1", "skills": ["python"], "location": "Remote"},
            ]

        elif self.fault_mode == "schema_drift":
            # Upstream platform secretly changed JSON schema keys!
            # 'title' -> 'job_headline'
            # 'company' -> 'hiring_org'
            # 'apply_url' -> 'posting_href'
            # 'job_id' -> 'opportunity_uuid'
            return [
                {
                    "opportunity_uuid": "drift-901",
                    "job_headline": "Senior AI Infrastructure Engineer",
                    "hiring_org": "DeepVector Labs",
                    "posting_href": "https://example.com/drift/901",
                    "skills_required": ["pytorch", "kubernetes", "python"],
                    "work_location": "Remote - Worldwide",
                    "compensation": "$180,000 - $220,000"
                },
                {
                    "opportunity_uuid": "drift-902",
                    "job_headline": "Frontend Reliability Architect",
                    "hiring_org": "NextGen Systems",
                    "posting_href": "https://example.com/drift/902",
                    "skills_required": ["react", "typescript", "performance"],
                    "work_location": "Remote - US/EU",
                    "compensation": "$160,000 - $190,000"
                },
                {
                    "opportunity_uuid": "drift-903",
                    "job_headline": "Distributed Systems Engineer",
                    "hiring_org": "QuantScale",
                    "posting_href": "https://example.com/drift/903",
                    "skills_required": ["rust", "go", "kafka"],
                    "work_location": "Remote",
                    "compensation": "$200,000"
                }
            ]

        # Normal clean mode ('none')
        sample_jobs = [
            {
                "job_id": "sbx-001",
                "title": "Senior Distributed Systems Engineer",
                "company": "CloudScale Architectures",
                "location": "Remote (US/EU)",
                "apply_url": "https://example.com/careers/sbx-001",
                "skills": ["python", "distributed systems", "resilience", "fastapi"],
                "salary_min": 160000,
                "salary_max": 210000,
                "description": "Architect high-throughput, self-healing ingestion systems with circuit breakers and event buffering.",
                "days_ago": 1
            },
            {
                "job_id": "sbx-002",
                "title": "Lead Frontend Engineer (Design Systems)",
                "company": "Voxel Interactive",
                "location": "Remote (Global)",
                "apply_url": "https://example.com/careers/sbx-002",
                "skills": ["react", "typescript", "tailwind", "web performance"],
                "salary_min": 145000,
                "salary_max": 185000,
                "description": "Build state of the art, ultra-responsive dashboards and telemetry viewers.",
                "days_ago": 2
            },
            {
                "job_id": "sbx-003",
                "title": "Machine Learning Platform Engineer",
                "company": "NeuralFlow AI",
                "location": "Remote",
                "apply_url": "https://example.com/careers/sbx-003",
                "skills": ["python", "pytorch", "llm", "fastapi", "docker"],
                "salary_min": 170000,
                "salary_max": 230000,
                "description": "Deploy reliable inference pipelines and schema validation layers for multimodal models.",
                "days_ago": 3
            },
            {
                "job_id": "sbx-004",
                "title": "Site Reliability Engineer (SRE)",
                "company": "Aegis Observability",
                "location": "Remote",
                "apply_url": "https://example.com/careers/sbx-004",
                "skills": ["go", "kubernetes", "telemetry", "prometheus"],
                "salary_min": 150000,
                "salary_max": 195000,
                "description": "Maintain 99.99% uptime, design circuit-breaker policies, and automated failover mechanics.",
                "days_ago": 4
            },
            {
                "job_id": "sbx-005",
                "title": "Full Stack Engineer (API & Integrations)",
                "company": "MeshConnect",
                "location": "Remote",
                "apply_url": "https://example.com/careers/sbx-005",
                "skills": ["python", "react", "fastapi", "postgresql"],
                "salary_min": 130000,
                "salary_max": 165000,
                "description": "Develop resilient connectors and schema normalization engines for third-party platforms.",
                "days_ago": 5
            }
        ]
        return sample_jobs

    def normalize(self, raw_record: Dict[str, Any]) -> Optional[Job]:
        """Normalize canonical sandbox record. Returns None if expected schema keys are missing (such as during schema drift)."""
        try:
            # During schema drift, these standard keys will be missing
            ext_id = str(raw_record.get("job_id") or "").strip()
            title = str(raw_record.get("title") or "").strip()
            company = str(raw_record.get("company") or "").strip()
            url = str(raw_record.get("apply_url") or "").strip()

            if not ext_id or not title or not company or not url:
                return None

            days_ago = raw_record.get("days_ago", 0)
            posted_at = datetime.utcnow() - timedelta(days=days_ago)

            return Job(
                id=f"sandbox:{ext_id}",
                source="sandbox_source",
                external_id=ext_id,
                title=title,
                company=company,
                location=str(raw_record.get("location") or "Remote"),
                url=url,
                posted_at=posted_at,
                description=str(raw_record.get("description") or "Controlled test job posting."),
                tags=raw_record.get("skills", []),
                salary_min=raw_record.get("salary_min"),
                salary_max=raw_record.get("salary_max"),
                salary_currency="USD",
                employment_type="Full-time",
                raw_preview=raw_record
            )
        except Exception:
            return None
