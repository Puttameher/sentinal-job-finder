"""Tests for Circuit Breaker 3-State Machine."""

import time
import pytest
from app.models.health import CircuitState
from app.resilience.circuit_breaker import CircuitBreaker


def test_initial_circuit_state_is_closed():
    cb = CircuitBreaker(source_name="test_src", failure_threshold=3, recovery_cooldown_seconds=1.0)
    assert cb.state == CircuitState.CLOSED
    assert cb.allow_request() is True
    assert cb.consecutive_failures == 0


def test_circuit_trips_to_open_after_reaching_threshold():
    cb = CircuitBreaker(source_name="test_src", failure_threshold=3, recovery_cooldown_seconds=0.5)
    
    cb.record_failure("Error 1")
    assert cb.state == CircuitState.CLOSED
    assert cb.consecutive_failures == 1

    cb.record_failure("Error 2")
    assert cb.state == CircuitState.CLOSED

    cb.record_failure("Error 3")
    # Should trip to OPEN on 3rd failure
    assert cb.state == CircuitState.OPEN
    assert cb.allow_request() is False
    assert cb.trip_count == 1


def test_circuit_transitions_to_half_open_after_cooldown():
    cb = CircuitBreaker(source_name="test_src", failure_threshold=2, recovery_cooldown_seconds=0.1)
    
    cb.record_failure("Err 1")
    cb.record_failure("Err 2")
    assert cb.state == CircuitState.OPEN

    # Wait for cooldown to expire
    time.sleep(0.15)

    # State property triggers evaluation into HALF_OPEN
    assert cb.state == CircuitState.HALF_OPEN
    assert cb.allow_request() is True


def test_half_open_success_recovers_to_closed():
    cb = CircuitBreaker(source_name="test_src", failure_threshold=2, recovery_cooldown_seconds=0.05)
    cb.record_failure("Err 1")
    cb.record_failure("Err 2")
    assert cb.state == CircuitState.OPEN

    time.sleep(0.08)
    assert cb.state == CircuitState.HALF_OPEN

    cb.record_success()
    assert cb.state == CircuitState.CLOSED
    assert cb.consecutive_failures == 0


def test_half_open_failure_re_opens_circuit():
    cb = CircuitBreaker(source_name="test_src", failure_threshold=2, recovery_cooldown_seconds=0.05)
    cb.record_failure("Err 1")
    cb.record_failure("Err 2")
    assert cb.state == CircuitState.OPEN

    time.sleep(0.08)
    assert cb.state == CircuitState.HALF_OPEN

    cb.record_failure("Probe failed")
    assert cb.state == CircuitState.OPEN
    assert cb.trip_count == 2
