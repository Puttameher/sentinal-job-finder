"""Request Pacing, Jittered Backoff, and Bounded Retries.

Implements polite pacing against external endpoints to adhere strictly to ethical
scraping standards and prevent self-inflicted 429 throttling.
"""

import asyncio
import logging
import random
import time
from typing import Any, Callable, Coroutine, Dict

logger = logging.getLogger(__name__)


class RequestPacer:
    """
    Manages polite inter-request delays and bounded retry loops with exponential backoff and jitter.
    """

    def __init__(
        self,
        min_interval_seconds: float = 0.5,
        max_retries: int = 2,
        initial_backoff_seconds: float = 0.5,
        backoff_multiplier: float = 1.5,
        jitter_range: float = 0.2
    ):
        self.min_interval = min_interval_seconds
        self.max_retries = max_retries
        self.initial_backoff = initial_backoff_seconds
        self.backoff_multiplier = backoff_multiplier
        self.jitter_range = jitter_range
        self._last_request_times: Dict[str, float] = {}

    async def pace(self, source_name: str) -> None:
        """Enforces minimum polite delay between calls to the same source."""
        now = time.time()
        last_time = self._last_request_times.get(source_name, 0.0)
        elapsed = now - last_time

        if elapsed < self.min_interval:
            wait_time = (self.min_interval - elapsed) + random.uniform(0.02, 0.08)
            await asyncio.sleep(wait_time)

        self._last_request_times[source_name] = time.time()

    async def execute_with_retry(
        self,
        source_name: str,
        operation: Callable[[], Coroutine[Any, Any, Any]],
        on_retry_cb: Callable[[str, int, float, str], None] = None
    ) -> Any:
        """
        Executes an async fetch operation with bounded retries and jittered exponential backoff.
        """
        attempt = 0
        backoff = self.initial_backoff

        while True:
            await self.pace(source_name)
            try:
                attempt += 1
                return await operation()
            except Exception as e:
                # Do not retry on definite non-retryable 4xx errors (except 429)
                error_str = str(e)
                if attempt > self.max_retries:
                    logger.warning(
                        f"[Pacer:{source_name}] Exceeded max retries ({self.max_retries}). Last error: {error_str}"
                    )
                    raise e

                # Calculate backoff + jitter
                jitter = random.uniform(-self.jitter_range * backoff, self.jitter_range * backoff)
                sleep_duration = max(0.1, backoff + jitter)

                logger.info(
                    f"[Pacer:{source_name}] Attempt {attempt} failed: {error_str}. Retrying in {sleep_duration:.2f}s..."
                )
                if on_retry_cb:
                    on_retry_cb(source_name, attempt, sleep_duration, error_str)

                await asyncio.sleep(sleep_duration)
                backoff *= self.backoff_multiplier
