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

    async def fetch_raw(self, params: JobSearchParams) -> List[Dict[str, Any]]:
        """Fetch raw JSON job records from RemoteOK with responsible headers."""
        headers = {
            "User-Agent": "SentinelJobIngestionBot/1.0 (Educational Assessment Demo; contact@sentinel-research.local)",
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9",
        }
        
        # Build query parameters
        url = self._base_url
        query_params = {}
        if params.tags and len(params.tags) > 0:
            query_params["tag"] = params.tags[0].lower()
        elif params.query:
            query_params["tag"] = params.query.lower().replace(" ", "-")

        async with httpx.AsyncClient(timeout=self._timeout, follow_redirects=True) as client:
            response = await client.get(url, headers=headers, params=query_params)
            
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
            
            # RemoteOK includes a metadata dictionary as first element (e.g. {"legal": ...})
            raw_records = [
                item for item in data 
                if isinstance(item, dict) and "id" in item and "position" in item
            ]
            
            return raw_records

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
                        # ISO 8601 string
                        posted_at = datetime.fromisoformat(str(date_str).replace("Z", "+00:00"))
                except Exception:
                    posted_at = None

            # Clean description html tags
            desc = str(raw_record.get("description") or "")
            clean_desc = re.sub(r"<[^>]+>", " ", desc).strip()
            clean_desc = re.sub(r"\s+", " ", clean_desc)

            # Extract tags
            tags = raw_record.get("tags") or []
            if isinstance(tags, list):
                tags = [str(t).strip().lower() for t in tags if str(t).strip()]
            else:
                tags = []

            # Extract salary if provided
            salary_min = None
            salary_max = None
            sal_min_val = raw_record.get("salary_min")
            sal_max_val = raw_record.get("salary_max")
            if sal_min_val is not None:
                try:
                    salary_min = float(sal_min_val)
                except (ValueError, TypeError):
                    pass
            if sal_max_val is not None:
                try:
                    salary_max = float(sal_max_val)
                except (ValueError, TypeError):
                    pass

            location = str(raw_record.get("location") or "Remote").strip()
            if not location:
                location = "Remote"

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
                tags=tags[:8],
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
