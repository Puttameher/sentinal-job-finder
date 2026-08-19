"""Circuit Breaker Implementation for External Job Sources.

Protects external endpoints from cascading failures and avoids spamming degraded
providers. Implements the classic 3-state state machine:
  - CLOSED (Healthy / Passing all traffic)
  - OPEN (Tripped / All traffic diverted to fallback)
  - HALF_OPEN (Probing recovery with canary probe)
"""

from datetime import datetime, timedelta
import logging
from typing import Callable, Optional
from ..models.health import CircuitState

logger = logging.getLogger(__name__)


class CircuitBreaker:
    """
    Stateful circuit breaker instance for an individual ingestion source.
    """

    def __init__(
        self,
        source_name: str,
        failure_threshold: int = 3,
        recovery_cooldown_seconds: float = 20.0,
        half_open_success_threshold: int = 1,
    ):
        self.source_name = source_name
        self.failure_threshold = failure_threshold
        self.recovery_cooldown_seconds = recovery_cooldown_seconds
        self.half_open_success_threshold = half_open_success_threshold

        self._state: CircuitState = CircuitState.CLOSED
        self._consecutive_failures: int = 0
        self._consecutive_successes: int = 0
        self._last_state_change: datetime = datetime.utcnow()
        self._last_failure_time: Optional[datetime] = None
        self._trip_count: int = 0
        self._on_state_change_cb: Optional[Callable[[str, CircuitState, CircuitState, str], None]] = None

    @property
    def state(self) -> CircuitState:
        """Returns the current state, evaluating if an OPEN breaker has elapsed cooldown."""
        if self._state == CircuitState.OPEN and self._last_failure_time:
            elapsed = (datetime.utcnow() - self._last_failure_time).total_seconds()
            if elapsed >= self.recovery_cooldown_seconds:
                self._transition_to(CircuitState.HALF_OPEN, "Cooldown period expired; probing source recovery with canary request")
        return self._state

    @property
    def consecutive_failures(self) -> int:
        return self._consecutive_failures

    @property
    def consecutive_successes(self) -> int:
        return self._consecutive_successes

    @property
    def trip_count(self) -> int:
        return self._trip_count

    @property
    def last_failure_time(self) -> Optional[datetime]:
        return self._last_failure_time

    @property
    def cooldown_remaining(self) -> float:
        """Returns seconds remaining before probing HALF_OPEN, or 0.0 if not OPEN."""
        if self._state == CircuitState.OPEN and self._last_failure_time:
            elapsed = (datetime.utcnow() - self._last_failure_time).total_seconds()
            remaining = max(0.0, self.recovery_cooldown_seconds - elapsed)
            return round(remaining, 1)
        return 0.0

    def set_on_state_change_callback(self, cb: Callable[[str, CircuitState, CircuitState, str], None]) -> None:
        self._on_state_change_cb = cb

    def _transition_to(self, new_state: CircuitState, reason: str) -> None:
        old_state = self._state
        if old_state != new_state:
            self._state = new_state
            self._last_state_change = datetime.utcnow()
            logger.warning(
                f"[CircuitBreaker:{self.source_name}] Transition {old_state.value} -> {new_state.value}. Reason: {reason}"
            )
            if self._on_state_change_cb:
                self._on_state_change_cb(self.source_name, old_state, new_state, reason)

    def allow_request(self) -> bool:
        """Determines if a request to this source should proceed or divert to fallback."""
        current_state = self.state  # triggers cooldown evaluation
        return current_state in (CircuitState.CLOSED, CircuitState.HALF_OPEN)

    def record_success(self) -> None:
        """Records a successful response and updates state machine."""
        current_state = self.state
        self._consecutive_failures = 0
        self._consecutive_successes += 1

        if current_state == CircuitState.HALF_OPEN:
            if self._consecutive_successes >= self.half_open_success_threshold:
                self._transition_to(
                    CircuitState.CLOSED,
                    f"Canary probe succeeded ({self._consecutive_successes} consecutive ok); circuit recovered to CLOSED."
                )

    def record_failure(self, error_message: str = "") -> None:
        """Records a failure (5xx, timeout, 429) and potentially trips the circuit."""
        self._consecutive_failures += 1
        self._consecutive_successes = 0
        self._last_failure_time = datetime.utcnow()
        current_state = self.state

        if current_state == CircuitState.HALF_OPEN:
            self._trip_count += 1
            self._transition_to(
                CircuitState.OPEN,
                f"Canary probe failed in HALF_OPEN state ({error_message}); reopening circuit breaker."
            )
        elif current_state == CircuitState.CLOSED:
            if self._consecutive_failures >= self.failure_threshold:
                self._trip_count += 1
                self._transition_to(
                    CircuitState.OPEN,
                    f"Failure threshold ({self.failure_threshold}) exceeded with error: {error_message}; circuit breaker tripped to OPEN."
                )

    def trip_manually(self, reason: str = "Manual fault injection") -> None:
        """Force the circuit breaker to OPEN state (for demos and simulation)."""
        self._consecutive_failures = self.failure_threshold
        self._last_failure_time = datetime.utcnow()
        self._trip_count += 1
        self._transition_to(CircuitState.OPEN, reason)

    def reset_manually(self) -> None:
        """Reset the circuit breaker to CLOSED state."""
        self._consecutive_failures = 0
        self._consecutive_successes = 0
        self._last_failure_time = None
        self._transition_to(CircuitState.CLOSED, "Manual circuit reset to CLOSED")
