"""Source Registry for Deterministic Ingestion Routing and Fallbacks."""

from typing import Dict, List, Optional
from .base import JobSource
from .remoteok import RemoteOKSource
from .rss import RSSJobSource
from .sandbox import SandboxJobSource


class SourceRegistry:
    """
    Central registry of explicitly configured and supported job sources.
    Maintains primary routing sequence and fallback tiers without dynamic scraping ambiguity.
    """

    def __init__(self):
        self._sources: Dict[str, JobSource] = {}
        self._default_source_order: List[str] = []
        
        # Instantiate and register standard sources
        self.register_source(RemoteOKSource())
        self.register_source(RSSJobSource())
        self.register_source(SandboxJobSource())
        
        # Define deterministic primary and fallback priority
        # 1. Primary: RemoteOK (Live API)
        # 2. Secondary Fallback: WeWorkRemotely RSS (Live XML)
        # 3. Tertiary Fallback / Test: Sandbox
        self._default_source_order = ["remoteok", "weworkremotely_rss", "sandbox_source"]

    def register_source(self, source: JobSource) -> None:
        """Register a new connector."""
        self._sources[source.name] = source
        if source.name not in self._default_source_order:
            self._default_source_order.append(source.name)

    def get_source(self, name: str) -> Optional[JobSource]:
        """Retrieve a specific connector by name."""
        return self._sources.get(name)

    def get_all_sources(self) -> Dict[str, JobSource]:
        """Get all registered connectors."""
        return self._sources

    def get_ordered_source_names(self) -> List[str]:
        """Return the priority chain for ingestion routing."""
        return list(self._default_source_order)

    def set_primary_order(self, order: List[str]) -> None:
        """Dynamically reorder the fallback tier priority."""
        for s in order:
            if s not in self._sources:
                raise ValueError(f"Unknown source '{s}' cannot be prioritized")
        self._default_source_order = [s for s in order if s in self._sources]
