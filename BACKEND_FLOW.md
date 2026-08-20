# Sentinel Backend Architecture & Ingestion Flow Master Guide

> **Production-Grade Resilient Data Ingestion Engine**  
> Built with **Python 3.12**, **FastAPI**, **Pydantic v2**, **httpx**, and **defusedxml**.

---

## 1. High-Level Architecture Overview

Sentinel coordinates multi-source data ingestion, fault isolation, strict invariant validation, and real-time observability. The architecture is decoupled into modular components conforming to the **Single Responsibility Principle** and **Open-Closed Principle**.

```
                           CLIENT (React / Three.js Frontend)
                                       │
                                       ▼  HTTP GET /api/jobs?query=python
                         ┌───────────────────────────┐
                         │    FastAPI Route Layer    │ (app/main.py)
                         └─────────────┬─────────────┘
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │   Ingestion Orchestrator  │ (app/ingestion/orchestrator.py)
                         └─────────────┬─────────────┘
                                       │
           ┌───────────────────────────┴───────────────────────────┐
           ▼                                                       ▼
┌───────────────────────┐                               ┌───────────────────────┐
│    Source Registry    │ (app/sources/registry.py)     │  SourceHealthMonitor  │ (app/health/monitor.py)
└──────────┬────────────┘                               └───────────────────────┘
           │
           │ Resolves Dynamic Priority Tier: RemoteOK (API) ➔ WWR (RSS) ➔ Sandbox
           ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                      PIPELINE EXECUTION PER SOURCE TIER                       │
│                                                                               │
│  [Step 1] Circuit Breaker Check                                               │
│           • CLOSED    ➔ Allow request execution                               │
│           • OPEN      ➔ Fail fast (<1ms); trigger deterministic fallback      │
│           • HALF_OPEN ➔ Send single canary probe request                      │
│                                                                               │
│  [Step 2] Request Pacer & Gaussian Jitter                                     │
│           • Enforces 0.3s minimum polite gap between requests                 │
│           • Adds random Gaussian jitter to destroy periodic bot signatures    │
│           • Executes bounded exponential backoff on transient network faults  │
│                                                                               │
│  [Step 3] Raw Upstream Fetch (fetch_raw)                                      │
│           • RemoteOK: Async REST JSON via httpx.AsyncClient                   │
│           • WeWorkRemotely: XML RSS stream parsed via safe defusedxml         │
│           • Sandbox: Controlled stateful chaos simulation engine              │
│                                                                               │
│  [Step 4] Adapter Normalization (normalize)                                   │
│           • Transforms source-specific payload format into unvalidated Dicts  │
│                                                                               │
│  [Step 5] Pydantic Invariant Batch Validation (validate_batch)                │
│           • Valid Records   ➔ Typed canonical Job models                      │
│           • Corrupt Records ➔ Quarantined & logged (Batch survives!)          │
│                                                                               │
│  [Step 6] Schema Drift Analysis (detect_drift)                                │
│           • Compares raw payload keys against canonical schema signatures     │
│           • Alerts telemetry if upstream changes field names                  │
│                                                                               │
│  [Step 7] Telemetry & Metrics Ledger (log_event / record_success)             │
│           • Updates moving-average latency, health score, and circuit metrics │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │
                                       ▼
                       Canonical IngestionResponse JSON
```

---

## 2. Detailed Step-by-Step Request Lifecycle

When a user triggers a search (e.g., `GET /api/jobs?query=python&location=remote`):

### Step 1: Request Entry & Parameter Binding (`app/main.py`)
- FastAPI receives the request and validates query parameters using `JobSearchParams`.
- Delegates execution to the global singleton `IngestionOrchestrator`.

### Step 2: Source Priority Chain Resolution (`app/sources/registry.py`)
- The orchestrator queries the `SourceRegistry` to obtain the active tier priority order:
  1. **Primary Tier:** `RemoteOKJobSource` (Live REST API)
  2. **Secondary Tier:** `WeWorkRemotelyRSSSource` (Live XML/RSS Feed)
  3. **Fallback Tier:** `SandboxJobSource` (Synthetic Controlled Sandbox)
- If the user explicitly provided `preferred_source`, that source is promoted to the front of the chain.

### Step 3: Circuit Breaker Inspection (`app/resilience/circuit_breaker.py`)
- Before making any network calls, the orchestrator inspects the source's `CircuitBreaker`:
  - **`CLOSED` (Healthy):** Request proceeds to Step 4.
  - **`OPEN` (Tripped):** If the source experienced 3 consecutive failures within the failure window, the circuit breaker immediately **fails fast** without opening a network socket. The orchestrator logs a `CIRCUIT_BLOCKED_SKIPPING_SOURCE` event and seamlessly diverts to the next source tier.
  - **`HALF_OPEN` (Canary Probe):** If the 30-second cooldown elapsed, the breaker allows a single canary probe through to test if upstream recovered.

### Step 4: Paced & Jittered Execution (`app/resilience/pacer.py`)
- Upstream requests pass through the `RequestPacer`:
  - **Minimum Request Gap:** Enforces a minimum interval (0.3s) between calls to respect rate limits.
  - **Gaussian Randomized Jitter:** Adds random non-uniform delays to prevent periodic WAF fingerprinting.
  - **Bounded Exponential Backoff:** On transient `429` (Rate Limited) or `503` (Unavailable) responses, retries up to 2 times with exponential wait:
    $$\text{Wait Time} = \min(\text{base\_delay} \times 2^{\text{attempt}} + \text{jitter}, \text{max\_wait})$$

### Step 5: Raw Ingestion & Security Parsing (`app/sources/`)
- **RemoteOK (`remoteok.py`):** Uses asynchronous `httpx.AsyncClient` with custom headers (`User-Agent: Sentinel/1.0`, `Accept: application/json`).
- **WeWorkRemotely (`rss.py`):** Uses `defusedxml` to parse the live RSS XML feed, protecting against XML entity expansion (Billion Laughs) attacks.
- **Sandbox (`sandbox.py`):** Deterministic mock engine capable of simulating 500 Outages, 429 Rate Limits, Schema Mutations, and Malformed Records for live chaos testing.

### Step 6: Canonical Normalization (`JobSource.normalize`)
- Converts source-specific schemas into a standardized internal representation:
  - Maps unique fields (e.g., `position` or `job_headline` $\to$ `title`).
  - Cleans HTML tags from job descriptions using regex sanitization.
  - Extracts salary minimum/maximum and normalizes currency codes.
  - Formats timestamps to ISO-8601 strings.

### Step 7: Batch Invariant Validation & Quarantine (`app/validation/validator.py`)
- The `BatchValidator` evaluates records using Pydantic `Job` schema invariants:
  - `title`: Non-empty string.
  - `company`: Non-empty string.
  - `url`: Must be a valid `http://` or `https://` URL.
  - `tags`: Array of clean string tags.
- **Zero-Blast Radius Quarantine:** If record #14 in a batch of 50 has a missing title, record #14 is quarantined and logged to telemetry. The remaining 49 valid jobs are returned successfully. The batch is **never** failed due to individual corrupt records.

### Step 8: Schema Drift Detection (`app/validation/drift_detector.py`)
- The `SchemaDriftDetector` computes the symmetric difference between expected keys and raw received payload keys:
  - **Missing Keys:** Upstream dropped or renamed a critical field.
  - **New / Unexpected Keys:** Upstream introduced new fields.
- If drift threshold ($>30\%$ missing critical keys or $<50\%$ validation pass rate) is breached, an anomaly report is generated and logged to the telemetry ledger.

### Step 9: Telemetry & Moving Average Ledger (`app/health/monitor.py`)
- Records latency in a sliding window (calculates moving-average latency).
- Updates source health score ($0 - 100$) based on success/failure ratio.
- Logs structured events to a ring-buffer journal (`INFO`, `WARN`, `ERROR`, `SUCCESS`).

### Step 10: Automatic Fallback Resolution
- If all attempts on the primary source fail (e.g., HTTP 500 or Circuit Breaker OPEN), the orchestrator automatically executes the identical pipeline on the **Secondary Source** (`WeWorkRemotely`).
- The client receives a successful response with `fallback_activated: true` and `source_used: "weworkremotely_rss"`.

---

## 3. Resilience Component Architecture

| Component | File Path | Core Responsibility |
| :--- | :--- | :--- |
| **Circuit Breaker** | [`app/resilience/circuit_breaker.py`](file:///d:/youtube/job%20scraper/backend/app/resilience/circuit_breaker.py) | 3-state finite state machine (`CLOSED` $\to$ `OPEN` $\to$ `HALF_OPEN`) with configurable failure threshold (3) and cooldown (30s). |
| **Request Pacer** | [`app/resilience/pacer.py`](file:///d:/youtube/job%20scraper/backend/app/resilience/pacer.py) | Bounded exponential backoff with Gaussian jitter and minimum interval enforcement. |
| **Batch Validator** | [`app/validation/validator.py`](file:///d:/youtube/job%20scraper/backend/app/validation/validator.py) | Strict typed invariant verification with single-record quarantine. |
| **Drift Detector** | [`app/validation/drift_detector.py`](file:///d:/youtube/job%20scraper/backend/app/validation/drift_detector.py) | Key signature comparison and validation rate threshold monitoring. |
| **AI Drift Assistant** | [`app/ai/drift_assistant.py`](file:///d:/youtube/job%20scraper/backend/app/ai/drift_assistant.py) | Semantic LLM-assisted advisory migration proposer (Human-in-the-loop). |
| **Health Monitor** | [`app/health/monitor.py`](file:///d:/youtube/job%20scraper/backend/app/health/monitor.py) | Moving-average latency tracker, health score calculator, and event ring-buffer. |

---

## 4. API Endpoints Reference

| Method | Route | Description |
| :--- | :--- | :--- |
| **`GET`** | `/api` | Root status endpoint (`OPERATIONAL`, version, docs link). |
| **`GET`** | `/api/jobs` | Discovers & normalizes jobs across the resilient pipeline. Supports `query`, `location`, `company`, `preferred_source`, `limit`, `offset`. |
| **`GET`** | `/api/health` | Returns real-time health scores, circuit breaker states, and moving average latencies for all sources. |
| **`GET`** | `/api/sources` | Returns active source registry and priority sequence. |
| **`GET`** | `/api/telemetry` | Returns the recent 50 structured resilience events. |
| **`POST`** | `/api/demo/simulate` | Fault injection trigger (`simulate_500`, `simulate_429`, `simulate_drift`, `simulate_malformed`, `trip_circuit`, `restore`). |
| **`POST`** | `/api/priority` | Dynamically updates fallback priority order at runtime. |
| **`POST`** | `/api/ai/diagnose-drift` | Triggers AI schema drift analysis and adapter patch proposal. |
| **`GET`** | `/api/detection-surface` | Technical specification of detection surfaces, WAF mitigation, and ethical boundaries. |
| **`GET`** | `/docs` | Interactive Swagger UI API Documentation. |

---

## 5. Automated Verification & Testing

The backend includes a **17-test Pytest suite** covering all resilience invariants:

```bash
cd backend
pytest -v
```

### Verified Test Matrix:
1. `test_circuit_breaker_starts_closed` ✅
2. `test_circuit_trips_after_consecutive_failures` ✅
3. `test_circuit_half_open_probe_success` ✅
4. `test_circuit_half_open_probe_failure_reopens` ✅
5. `test_batch_validator_isolates_corrupt_records` ✅
6. `test_batch_validator_validates_clean_records` ✅
7. `test_drift_detector_flags_missing_keys` ✅
8. `test_drift_detector_flags_low_validation_rate` ✅
9. `test_orchestrator_successful_primary_ingestion` ✅
10. `test_orchestrator_fallback_on_circuit_trip` ✅
11. `test_orchestrator_fallback_on_http_error` ✅
12. `test_orchestrator_quarantines_and_returns_valid_jobs` ✅
13. `test_remoteok_source_normalization` ✅
14. `test_rss_source_safe_xml_parsing` ✅
15. `test_sandbox_fault_injection_modes` ✅
16. `test_ai_drift_assistant_generates_advisory_mappings` ✅
17. `test_pacer_applies_gaussian_jitter` ✅

---

## 6. Interview & Assessment Talking Points

When explaining this architecture in technical discussions:

1. **Why Circuit Breakers instead of endless retries?**
   *Endless retries cause the "thundering herd" problem and cascade failures to upstream servers. A 3-state circuit breaker fails fast in <1ms, shielding upstream systems while immediately serving users via secondary fallback tiers.*

2. **How does Sentinel handle anti-bot and rate limits?**
   *By enforcing minimum request intervals and applying randomized Gaussian jitter, Sentinel eliminates periodic polling signatures without resorting to illegal CAPTCHA solving or credential stuffing.*

3. **How does Sentinel handle upstream schema changes?**
   *Through typed Pydantic invariants, corrupted records are isolated at the individual level without crashing the batch. The Schema Drift Radar detects signature anomalies and leverages an AI assistant to propose human-reviewed adapter patches.*
