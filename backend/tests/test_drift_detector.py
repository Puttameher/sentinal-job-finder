"""Tests for Schema Drift Detection and AI Diagnostic Assistant."""

import pytest
from app.ai.drift_assistant import AIDriftAssistant
from app.models.job import JobSearchParams
from app.sources.sandbox import SandboxJobSource
from app.validation.drift_detector import SchemaDriftDetector


def test_schema_drift_detector_clean_schema():
    detector = SchemaDriftDetector()
    expected_keys = ["id", "title", "company", "url"]
    raw = [
        {"id": "1", "title": "Dev", "company": "Acme", "url": "https://a.com"},
        {"id": "2", "title": "QA", "company": "Acme", "url": "https://a.com"}
    ]
    report = detector.detect_drift("test_source", expected_keys, raw, validation_rejection_count=0)
    assert report.drift_detected is False
    assert len(report.missing_required_fields) == 0


def test_schema_drift_detector_mutated_schema():
    detector = SchemaDriftDetector()
    expected_keys = ["job_id", "title", "company", "apply_url"]
    # Simulated drifted payload: 'job_headline' instead of 'title', 'hiring_org' instead of 'company'
    mutated_raw = [
        {"opportunity_uuid": "101", "job_headline": "ML Engineer", "hiring_org": "DeepOrg", "posting_href": "https://a.com"},
        {"opportunity_uuid": "102", "job_headline": "SRE Engineer", "hiring_org": "DeepOrg", "posting_href": "https://b.com"}
    ]
    report = detector.detect_drift("test_source", expected_keys, mutated_raw, validation_rejection_count=2)
    assert report.drift_detected is True
    assert "title" in report.missing_required_fields
    assert "company" in report.missing_required_fields
    assert "job_headline" in report.unexpected_new_fields or "hiring_org" in report.unexpected_new_fields


@pytest.mark.asyncio
async def test_ai_drift_assistant_proposes_mappings():
    sbx = SandboxJobSource()
    sbx.set_fault_mode("schema_drift")
    raw_records = await sbx.fetch_raw(JobSearchParams())

    detector = SchemaDriftDetector()
    report = detector.detect_drift("sandbox_source", sbx.get_expected_schema_keys(), raw_records, validation_rejection_count=len(raw_records))
    
    assistant = AIDriftAssistant()
    diagnosis = await assistant.diagnose_drift(report)
    
    assert diagnosis.ai_generated is True
    assert len(diagnosis.suggested_mappings) > 0

    # Verify that 'title' was mapped to 'job_headline'
    mapped_fields = {m.canonical_field: m.suggested_source_field for m in diagnosis.suggested_mappings}
    assert mapped_fields.get("title") == "job_headline"
    assert mapped_fields.get("company") == "hiring_org"
