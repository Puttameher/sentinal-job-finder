"""Tests for Batch Validator and Fault Isolation."""

import pytest
from app.models.job import Job
from app.validation.validator import BatchValidator


def test_batch_validator_isolates_bad_records():
    valid_job = Job(
        id="test:1",
        source="test",
        external_id="1",
        title="Valid Engineer",
        company="Valid Tech",
        url="https://valid.com/job/1"
    )

    bad_job_url = Job.model_construct(
        id="test:2",
        source="test",
        external_id="2",
        title="Bad URL Engineer",
        company="Valid Tech",
        url="ftp://invalid-scheme"
    )

    candidates = [valid_job, None, bad_job_url]
    raw_records = [
        {"id": "1", "title": "Valid Engineer"},
        {"bad_row": True},
        {"id": "2", "title": "Bad URL Engineer"}
    ]

    result = BatchValidator.validate_batch(candidates, raw_records)

    assert result.total_received == 3
    assert result.valid_count == 1
    assert result.rejected_count == 2
    assert result.validation_rate == 33.3
    assert len(result.valid_jobs) == 1
    assert result.valid_jobs[0].title == "Valid Engineer"
    assert len(result.rejected_issues) == 2


def test_empty_batch_validation():
    result = BatchValidator.validate_batch([])
    assert result.total_received == 0
    assert result.valid_count == 0
    assert result.validation_rate == 100.0
