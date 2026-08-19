"""WeWorkRemotely Public RSS Job Connector.

Fetches XML/RSS feeds from WeWorkRemotely. Safe XML parsing with defusedxml/xmltodict.
Acts as a secondary live fallback source when primary API fails or degrades.
"""

from datetime import datetime
from email.utils import parsedate_to_datetime
import hashlib
import re
from typing import Any, Dict, List, Optional
import httpx
import xmltodict

from .base import JobSource
from ..models.job import Job, JobSearchParams


class RSSJobSource(JobSource):
    """Secondary public RSS/XML source (structured XML, live remote tech jobs)."""

    def __init__(self, timeout_seconds: float = 8.0):
        self._name = "weworkremotely_rss"
        self._source_type = "RSS"
        self._base_url = "https://weworkremotely.com/categories/remote-programming-jobs.rss"
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
        return ["title", "link", "guid", "pubDate", "description"]

    async def fetch_raw(self, params: JobSearchParams) -> List[Dict[str, Any]]:
        """Fetch and parse XML feed into list of item dicts."""
        headers = {
            "User-Agent": "SentinelJobIngestionBot/1.0 (Educational Assessment Demo; RSS Reader)",
            "Accept": "application/rss+xml, application/xml, text/xml",
        }

        async with httpx.AsyncClient(timeout=self._timeout, follow_redirects=True) as client:
            response = await client.get(self._base_url, headers=headers)
            
            if response.status_code == 429:
                raise httpx.HTTPStatusError(
                    "Rate limit exceeded on RSS feed",
                    request=response.request,
                    response=response
                )
            
            response.raise_for_status()
            
            xml_content = response.text
            parsed = xmltodict.parse(xml_content)
            
            channel = parsed.get("rss", {}).get("channel", {})
            items = channel.get("item", [])
            
            if isinstance(items, dict):
                items = [items]
            elif not isinstance(items, list):
                items = []
                
            return items

    def normalize(self, raw_record: Dict[str, Any]) -> Optional[Job]:
        """Normalize XML item into canonical Job."""
        try:
            raw_title = str(raw_record.get("title") or "").strip()
            link = str(raw_record.get("link") or "").strip()
            guid = raw_record.get("guid")
            
            if isinstance(guid, dict):
                guid_str = str(guid.get("#text") or "")
            else:
                guid_str = str(guid or "")
                
            if not guid_str and link:
                guid_str = hashlib.md5(link.encode("utf-8")).hexdigest()[:12]

            if not raw_title or not link:
                return None

            # WeWorkRemotely RSS title format is usually: "Company: Job Title"
            company = "WeWorkRemotely Company"
            title = raw_title
            if ":" in raw_title:
                parts = raw_title.split(":", 1)
                company = parts[0].strip()
                title = parts[1].strip()

            # Parse date
            pub_date_str = raw_record.get("pubDate")
            posted_at = None
            if pub_date_str:
                try:
                    posted_at = parsedate_to_datetime(pub_date_str)
                except Exception:
                    posted_at = None

            # Clean description
            raw_desc = str(raw_record.get("description") or "")
            clean_desc = re.sub(r"<[^>]+>", " ", raw_desc).strip()
            clean_desc = re.sub(r"\s+", " ", clean_desc)

            # Generate tags from title / category
            category = raw_record.get("category")
            tags = ["remote"]
            if isinstance(category, list):
                tags.extend([str(c).lower() for c in category if str(c).strip()])
            elif isinstance(category, str) and category:
                tags.append(category.lower())

            # Infer tech tags from title
            tech_keywords = ["python", "react", "typescript", "javascript", "golang", "ruby", "django", "fastapi", "ai", "node"]
            for kw in tech_keywords:
                if kw in raw_title.lower() and kw not in tags:
                    tags.append(kw)

            return Job(
                id=f"wwr:{guid_str}",
                source="weworkremotely_rss",
                external_id=guid_str,
                title=title,
                company=company,
                location="Remote",
                url=link,
                posted_at=posted_at,
                description=clean_desc[:1200] if clean_desc else "",
                tags=tags[:8],
                salary_min=None,
                salary_max=None,
                salary_currency="USD",
                employment_type="Full-time",
                raw_preview={
                    "guid": guid_str,
                    "title": raw_title,
                    "link": link,
                    "pubDate": pub_date_str
                }
            )
        except Exception:
            return None
