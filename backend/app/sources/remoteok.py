"""RemoteOK Public API Job Connector.

Connects to RemoteOK's public JSON API. Implements polite headers, user-agent
identification, and normalizes remote tech jobs.
"""

from datetime import datetime
import re
from typing import Any, Dict, List, Optional
import httpx

from .base import JobSource
from ..models.job import Job, JobSearchParams

# Keywords used to pre-filter RemoteOK results (tech-only jobs)
TECH_ROLE_KEYWORDS = [
    "engineer", "developer", "devops", "data", "backend", "frontend",
    "fullstack", "python", "react", "typescript", "golang", "rust", "java",
    "scala", "ruby", "ml", "ai", "machine learning", "cloud", "sre",
    "infrastructure", "security", "platform", "software", "architect",
    "scientist", "analyst", "blockchain", "mobile", "ios", "android",
]

# Title keywords used to enrich tags
TITLE_TAG_KEYWORDS = [
    "python", "react", "typescript", "javascript", "golang", "ruby",
    "django", "fastapi", "ai", "node", "engineer", "devops", "ml",
    "machine learning", "backend", "frontend", "fullstack", "full-stack",
    "senior", "lead", "staff", "rust", "java", "scala", "kubernetes",
    "docker", "aws", "cloud", "data", "analytics", "security", "sre",
    "architect", "mobile", "ios", "android",
]


class RemoteOKSource(JobSource):
    """Primary public API source (low-risk, structured JSON, real data)."""

    def __init__(self, timeout_seconds: float = 8.0):
        self._name = "remoteok"
        self._source_type = "API"
        self._base_url = "https://remoteok.com/api"
        self._timeout = timeout_seconds

    @property
    def name(self) -> str:
        return self._name

    @property
    def source_type(self) -> str:
        return self._source_type

    @property
    def base_url(self) -> str:
        return self._base_url

    def get_expected_schema_keys(self) -> List[str]:
        return ["id", "position", "company", "url", "date", "description", "tags"]

    def _is_tech_job(self, record: Dict[str, Any]) -> bool:
        """Filter out non-tech listings (customer support, logistics, etc.)"""
        title = str(record.get("position") or record.get("title") or "").lower()
        tags = [str(t).lower() for t in (record.get("tags") or [])]
        combined = f"{title} {' '.join(tags)}"
        return any(kw in combined for kw in TECH_ROLE_KEYWORDS)

    async def fetch_raw(self, params: JobSearchParams) -> List[Dict[str, Any]]:
        """Fetch raw JSON job records from RemoteOK with responsible headers."""
        headers = {
            "User-Agent": "SentinelJobIngestionBot/1.0 (Educational Assessment Demo; contact@sentinel-research.local)",
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9",
        }

        # Build query tag for RemoteOK API (best-effort keyword → tag mapping)
        query_params: Dict[str, str] = {}
        raw_query = (params.query or "").strip().lower()
        if raw_query:
            # Map multi-word queries to the best RemoteOK tag
            tag_map = {
                "ai": "ai", "machine learning": "machine-learning", "ml": "machine-learning",
                "python": "python", "react": "react", "typescript": "typescript",
                "javascript": "javascript", "golang": "golang", "rust": "rust",
                "java": "java", "ruby": "ruby", "node": "node",
                "devops": "devops", "kubernetes": "kubernetes", "docker": "docker",
                "aws": "aws", "cloud": "cloud", "data": "data-science",
                "backend": "back-end", "frontend": "front-end",
            }
            matched_tag = None
            for kw, tag_val in tag_map.items():
                if kw in raw_query:
                    matched_tag = tag_val
                    break
            if matched_tag:
                query_params["tag"] = matched_tag

        async with httpx.AsyncClient(timeout=self._timeout, follow_redirects=True) as client:
            response = await client.get(self._base_url, headers=headers, params=query_params)

            if response.status_code == 429:
                raise httpx.HTTPStatusError(
                    "Rate limit exceeded (HTTP 429)",
                    request=response.request,
                    response=response
                )

            response.raise_for_status()

            data = response.json()
            if not isinstance(data, list):
                raise ValueError(f"Expected JSON array from RemoteOK, got {type(data).__name__}")

            # Strip metadata first element, keep only valid job records
            raw_records = [
                item for item in data
                if isinstance(item, dict) and "id" in item and ("position" in item or "title" in item)
            ]

            # Pre-filter to tech jobs only (removes logistics, customer support, etc.)
            tech_records = [r for r in raw_records if self._is_tech_job(r)]

            # Fall back to all records if tech filter eliminates everything
            return tech_records if tech_records else raw_records

    def normalize(self, raw_record: Dict[str, Any]) -> Optional[Job]:
        """Convert RemoteOK JSON item to canonical Job."""
        try:
            ext_id = str(raw_record.get("id") or "").strip()
            title = str(raw_record.get("position") or raw_record.get("title") or "").strip()
            company = str(raw_record.get("company") or "").strip()
            url = str(raw_record.get("url") or raw_record.get("apply_url") or "").strip()

            if not ext_id or not title or not company:
                return None

            # Fix relative URLs if any
            if url and not url.startswith("http"):
                url = f"https://remoteok.com{url if url.startswith('/') else '/' + url}"
            elif not url:
                url = f"https://remoteok.com/l/{ext_id}"

            # Parse date
            posted_at = None
            date_str = raw_record.get("date") or raw_record.get("epoch")
            if date_str:
                try:
                    if isinstance(date_str, (int, float)):
                        posted_at = datetime.utcfromtimestamp(date_str)
                    else:
                        posted_at = datetime.fromisoformat(str(date_str).replace("Z", "+00:00"))
                except Exception:
                    posted_at = None

            # Clean description html tags
            desc = str(raw_record.get("description") or "")
            clean_desc = re.sub(r"<[^>]+>", " ", desc).strip()
            clean_desc = re.sub(r"\s+", " ", clean_desc)

            # Extract tags from API
            tags = raw_record.get("tags") or []
            if isinstance(tags, list):
                tags = [str(t).strip().lower() for t in tags if str(t).strip()]
            else:
                tags = []

            # Enrich tags from job title (so "engineer" searches work)
            title_lower = title.lower()
            for kw in TITLE_TAG_KEYWORDS:
                if kw in title_lower and kw not in tags:
                    tags.append(kw)

            # Extract salary if provided
            salary_min = None
            salary_max = None
            for field, target in [("salary_min", "salary_min"), ("salary_max", "salary_max")]:
                val = raw_record.get(field)
                if val is not None:
                    try:
                        if field == "salary_min":
                            salary_min = float(val)
                        else:
                            salary_max = float(val)
                    except (ValueError, TypeError):
                        pass

            location = str(raw_record.get("location") or "Remote").strip() or "Remote"

            return Job(
                id=f"remoteok:{ext_id}",
                source="remoteok",
                external_id=ext_id,
                title=title,
                company=company,
                location=location,
                url=url,
                posted_at=posted_at,
                description=clean_desc[:1200] if clean_desc else "",
                tags=tags[:10],
                salary_min=salary_min,
                salary_max=salary_max,
                salary_currency="USD",
                employment_type="Full-time",
                raw_preview={
                    "id": ext_id,
                    "position": title,
                    "company": company,
                    "location": location,
                }
            )
        except Exception:
            return None
