"""Tests for Source Connectors and Normalization."""

import pytest
from app.models.job import JobSearchParams
from app.sources.remoteok import RemoteOKSource
from app.sources.rss import RSSJobSource
from app.sources.sandbox import SandboxJobSource


@pytest.mark.asyncio
async def test_sandbox_source_normal_fetch():
    src = SandboxJobSource()
    src.set_fault_mode("none")
    records = await src.fetch_raw(JobSearchParams())
    assert len(records) > 0
    
    first = records[0]
    normalized = src.normalize(first)
    assert normalized is not None
    assert normalized.source == "sandbox_source"
    assert normalized.title == first["title"]
    assert normalized.company == first["company"]
    assert normalized.url.startswith("https://")


@pytest.mark.asyncio
async def test_sandbox_source_fault_modes():
    src = SandboxJobSource()
    
    src.set_fault_mode("empty_response")
    assert await src.fetch_raw(JobSearchParams()) == []

    src.set_fault_mode("http_500")
    with pytest.raises(Exception) as exc_info:
        await src.fetch_raw(JobSearchParams())
    assert "500" in str(exc_info.value)

    src.set_fault_mode("rate_limit_429")
    with pytest.raises(Exception) as exc_info:
        await src.fetch_raw(JobSearchParams())
    assert "429" in str(exc_info.value)


def test_remoteok_normalization_logic():
    src = RemoteOKSource()
    raw = {
        "id": "12345",
        "position": "Senior Backend Python Engineer",
        "company": "ScaleAI Inc",
        "url": "https://remoteok.com/l/12345",
        "date": "2026-08-15T12:00:00Z",
        "description": "<p>We are hiring a <b>Python</b> specialist.</p>",
        "tags": ["python", "fastapi", "docker"],
        "salary_min": 150000,
        "salary_max": 190000,
        "location": "Worldwide"
    }
    job = src.normalize(raw)
    assert job is not None
    assert job.id == "remoteok:12345"
    assert job.title == "Senior Backend Python Engineer"
    assert job.company == "ScaleAI Inc"
    assert "<b>" not in job.description
    assert job.salary_min == 150000.0


def test_rss_normalization_logic():
    src = RSSJobSource()
    raw = {
        "title": "Stripe: Staff Infrastructure Engineer",
        "link": "https://weworkremotely.com/jobs/stripe-staff-infra",
        "guid": {"#text": "wwr-9876"},
        "pubDate": "Mon, 18 Aug 2026 10:00:00 +0000",
        "description": "<p>Join Stripe remote team.</p>",
        "category": ["Programming", "Infrastructure"]
    }
    job = src.normalize(raw)
    assert job is not None
    assert job.id == "wwr:wwr-9876"
    assert job.company == "Stripe"
    assert job.title == "Staff Infrastructure Engineer"
    assert job.url == "https://weworkremotely.com/jobs/stripe-staff-infra"
