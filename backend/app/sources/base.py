"""Abstract Base Job Source Connector Interface."""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from ..models.job import Job, JobSearchParams


class JobSource(ABC):
    """
    Common connector abstraction for all external and synthetic job sources.
    Every connector encapsulates source-specific fetching protocols (REST, RSS/XML, HTML)
    and normalizes raw heterogeneous records into standard canonical Job models.
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """Human-readable identifier for the source."""
        pass

    @property
    @abstractmethod
    def source_type(self) -> str:
        """Type of source connector: 'API', 'RSS', or 'SANDBOX'."""
        pass

    @property
    @abstractmethod
    def base_url(self) -> str:
        """Endpoint or base URL for this source."""
        pass

    @abstractmethod
    async def fetch_raw(self, params: JobSearchParams) -> List[Dict[str, Any]]:
        """
        Execute raw network or simulated request and return parsed record dicts.
        Raises exceptions on network, rate limiting, or server failures.
        """
        pass

    @abstractmethod
    def normalize(self, raw_record: Dict[str, Any]) -> Optional[Job]:
        """
        Convert a source-specific dictionary into the normalized Job model.
        Returns None if record lacks essential identifiers.
        """
        pass

    def get_expected_schema_keys(self) -> List[str]:
        """Returns the expected list of core field keys for schema drift detection."""
        return ["id", "title", "company", "url"]
