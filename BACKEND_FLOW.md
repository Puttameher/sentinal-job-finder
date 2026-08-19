# Sentinel Backend Architecture & Ingestion Flow

This document provides a comprehensive technical breakdown of the **Sentinel Backend Architecture**, explaining how requests flow through the resilient ingestion pipeline, how fault isolation and circuit breakers operate, and how telemetry and AI schema drift diagnostics function in production.

---

## 1. High-Level Architecture Overview

Sentinel is built using **Python 3.12**, **FastAPI**, **Pydantic v2**, **httpx**, and **defusedxml**. It is designed around modular, decoupled components conforming to the **Open-Closed Principle** and the **Single Responsibility Principle**.

```
                           CLIENT (React / Browser)
                                      │
                                      ▼  HTTP GET /api/jobs
                         ┌───────────────────────────┐
                         │   FastAPI API Routing     │ (main.py)
                         └─────────────┬─────────────┘
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │   Ingestion Orchestrator  │ (orchestrator.py)
                         └─────────────┬─────────────┘
                                       │
           ┌───────────────────────────┴───────────────────────────┐
           ▼                                                       ▼
┌───────────────────────┐                               ┌───────────────────────┐
│    Source Registry    │ (registry.py)                 │  SourceHealthMonitor  │ (monitor.py)
└──────────┬────────────┘                               └───────────────────────┘
           │
           │ Resolves Priority Chain (e.g. RemoteOK -> WWR RSS -> Sandbox)
           ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                        RESILIENT INGESTION PIPELINE                           │
│                                                                               │
│  1. Check Circuit Breaker State (CLOSED / OPEN / HALF_OPEN)                   │
│     └── If OPEN: Record Telemetry Event & Fallback to Next Source Tier        │
│                                                                               │
│  2. Request Pacer & Jittered Retry Execution                                  │
│     └── Enforces 0.3s minimum gap + Gaussian Jitter + Bounded Exponential     │
│         Backoff (Base: 1.0s, Max Retries: 2, Max Wait: 4.0s)                  │
│                                                                               │
│  3. Raw Ingestion (JobSource.fetch_raw)                                       │
│     ├── RemoteOK: Async HTTP REST API (httpx.AsyncClient)                     │
│     ├── WeWorkRemotely: XML/RSS Stream (defusedxml / xmltodict)               │
│     └── Sandbox: Stateful Controlled Fault Injection Mock                     │
│                                                                               │
│  4. Normalization (JobSource.normalize)                                       │
│     └── Transforms source-specific payload format into unvalidated Dicts      │
│                                                                               │
│  5. Schema Invariant Validation (BatchValidator)                              │
│     ├── Valid Records   ──> Normalized Pydantic Job Instances                 │
│     └── Malformed Items ──> Isolated into Error Telemetry (Batch Survives)    │
│                                                                               │
│  6. Schema Drift Detection (SchemaDriftDetector)                              │
│     └── Compares raw payload keys against expected schema signatures          │
│                                                                               │
│  7. Telemetry & Metric Ledger (SourceHealthMonitor)                           │
│     └── Updates failure rates, moving-average latencies, and circuit states   │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │ Filter, Sort & Paginate   │ (In-Memory Filtering)
                         └─────────────┬─────────────┘
                                       │
                                       ▼  JSON IngestionResponse
                               CLIENT RESPONSE
```

---

## 2. Step-by-Step Request Lifecycle Trace

When a user searches for jobs (e.g., `GET /api/jobs?query=python&location=remote`):

### Step 1: Routing & Parameter Parsing (`app/main.py`)
- The request hits the `/api/jobs` endpoint with query parameters encapsulated in `JobSearchParams`.
- The endpoint delegates directly to `IngestionOrchestrator.ingest_jobs(params)`.

### Step 2: Fallback Chain Resolution (`app/sources/registry.py`)
- The `SourceRegistry` provides an ordered list of connector names to attempt.
- If the user specified a `preferred_source` (e.g., `remoteok`), that source is placed first, followed by deterministic fallback tiers (`weworkremotely_rss`, `sandbox_source`).

### Step 3: Circuit Breaker Inspection (`app/resilience/circuit_breaker.py`)
For each source in the chain:
- The orchestrator queries `circuit_breaker.allow_request()`.
- **Case A (`CLOSED`):** Breaker allows the request.
- **Case B (`OPEN`):** If within cooldown (default: 30s), the breaker **fails fast immediately** without wasting network bandwidth or hammering a degraded upstream host. The orchestrator records a `FALLBACK_DIVERSIFICATION` event and seamlessly advances to the next source.
- **Case C (`HALF_OPEN`):** Cooldown has expired. The breaker allows a single "canary" request through to probe host recovery.

### Step 4: Paced Network Fetch (`app/resilience/pacer.py`)
- The `RequestPacer` checks when the source was last queried.
- If less than `min_interval_seconds` (default: 0.3s) has elapsed, it sleeps for the remaining duration plus randomized Gaussian jitter (`±0.05s`). This prevents detectable periodic timing signatures.
- If a network error or 5xx occurs, `pacer.execute_with_retry()` executes a bounded exponential backoff ($wait = \min(base \times 2^{attempt} + jitter, max\_wait)$) up to 2 retry attempts.

### Step 5: Data Connector Execution (`app/sources/`)
- **RemoteOK Connector (`remoteok.py`):** Makes an asynchronous GET request to `https://remoteok.com/api` with custom `User-Agent` headers matching modern browser Client Hints.
- **RSS Connector (`rss.py`):** Fetches the XML channel feed from `https://weworkremotely.com/categories/remote-programming-jobs.rss` and parses it safely using `defusedxml` to prevent XML entity expansion attacks.
- **Sandbox Connector (`sandbox.py`):** For controlled chaos testing, inspects its active fault mode (`http_500`, `rate_limit_429`, `schema_drift`, `malformed_json`, `empty_response`, `none`) and yields corresponding synthetic responses.

### Step 6: Invariant Batch Validation (`app/validation/validator.py`)
- Raw dictionaries are validated against the strict **Pydantic v2 `Job` schema**.
- **Fault Isolation Principle:** If 3 out of 50 records contain invalid URLs or missing titles, the `BatchValidator` extracts the 3 malformed records into telemetry error logs, and allows the 47 valid records to proceed. **The entire search request is never terminated due to partial corruptions.**

### Step 7: Schema Drift Analysis (`app/validation/drift_detector.py`)
- Compares the set of raw keys against the connector's registered expected keys.
- If keys are missing (e.g. `position` replaced by `job_headline`), a `DriftReport` is generated with `drift_detected=True`.
- This automatically triggers an alert in the `SourceHealthMonitor` for developer inspection.

### Step 8: Telemetry & State Updates (`app/health/monitor.py`)
- Upon success: Recorded request latency, increments valid record counters, and resets consecutive failure counters in the circuit breaker.
- Upon failure: Increments failure counters. If consecutive failures reach `failure_threshold` (default: 3), the breaker transitions to `OPEN`.

### Step 9: Filtering & Client Response
- The validated `Job` instances are filtered in-memory by query, location, and company.
- Returned to the client as an `IngestionResponse` containing:
  - List of `Job` objects
  - `source_used`
  - `fallback_activated` (boolean)
  - `latency_ms`
  - `validation_rate` (percentage)

---

## 3. Circuit Breaker State Machine

The Circuit Breaker prevents cascading system failures and protects upstream providers from being overwhelmed when degraded:

```
                  ┌──────────────────────────────┐
                  │                              │
                  │        CLOSED (Healthy)      │ ◄─────────────────────────┐
                  │   All requests permitted     │                           │
                  │                              │                           │
                  └──────────────┬───────────────┘                           │
                                 │                                           │
             3 Consecutive Failures Reach Threshold                          │
                                 │                                           │
                                 ▼                                           │
                  ┌──────────────────────────────┐                           │
                  │                              │                           │
                  │        OPEN (Tripped)        │                           │
                  │   Fail-fast without network  │                           │
                  │                              │                           │
                  └──────────────┬───────────────┘                           │
                                 │                                           │
                     Cooldown Timer (30s) Expires                            │
                                 │                                           │
                                 ▼                                           │
                  ┌──────────────────────────────┐                           │
                  │                              │                           │
                  │     HALF_OPEN (Probing)      │                           │
                  │     Single canary probe      │                           │
                  │                              │                           │
                  └──────────────┬───────────────┘                           │
                                 │                                           │
                    ┌────────────┴────────────┐                              │
                    │                         │                              │
          Canary Probe Fails         Canary Probe Succeeds                   │
                    │                         │                              │
                    ▼                         └──────────────────────────────┘
            Transitions to OPEN
```

---

## 4. AI Schema Drift Diagnostic Engine (`app/ai/drift_assistant.py`)

When an upstream platform alters its JSON schema or markup structure, Sentinel detects it and assists engineers in resolving it:

1. **Detection:** `SchemaDriftDetector` computes the symmetric difference between `expected_keys` and `observed_keys`.
2. **Semantic Similarity Heuristic:** Uses fuzzy Levenshtein distance, prefix matching, and token overlap to match renamed fields (e.g. `position` $\to$ `job_headline` with 85% confidence).
3. **LLM Diagnostic Mode:** If an API key is configured (`OPENAI_API_KEY` or `GEMINI_API_KEY`), prompts an LLM with the missing/unexpected keys to generate code-level adapter migrations.
4. **Human-in-the-Loop Safety Rule:** AI generates **advisory migration proposals and field translations**, but **never mutates production code autonomously without developer approval**.

---

## 5. Summary of Key Files

| Module | File Path | Core Responsibility |
| :--- | :--- | :--- |
| **API Server** | `app/main.py` | FastAPI app definition, CORS, endpoints (`/api/jobs`, `/api/health`, `/api/demo/simulate`, `/api/ai/diagnose-drift`). |
| **Orchestrator** | `app/ingestion/orchestrator.py` | Coordinates the end-to-end resilient ingestion pipeline. |
| **Registry** | `app/sources/registry.py` | Maintains registered connectors and priority fallback chains. |
| **Circuit Breaker** | `app/resilience/circuit_breaker.py` | 3-state state machine managing failover and recovery. |
| **Request Pacer** | `app/resilience/pacer.py` | Enforces rate limits, jitter, and bounded exponential retries. |
| **Pydantic Models** | `app/models/job.py`, `health.py`, `drift.py` | Strongly-typed data models for jobs, telemetry, and drift diagnostics. |
| **Sources** | `app/sources/remoteok.py`, `rss.py`, `sandbox.py` | Connectors for REST API, XML RSS, and Controlled Chaos Sandbox. |
| **Validator** | `app/validation/validator.py` | Batch record validation with malformed record isolation. |
| **Drift Detector** | `app/validation/drift_detector.py` | Structural variance analyzer. |
| **AI Assistant** | `app/ai/drift_assistant.py` | Semantic and LLM field migration diagnostic engine. |
| **Telemetry Monitor** | `app/health/monitor.py` | Rolling latency calculations, failure tracking, and activity logging. |

---

## 6. Interview Speaking Points (2-Minute Pitch)

1. **Architecture Over Scraping:** *"Instead of relying on brittle headless browser scraping that breaks on every DOM tweak and gets blocked by Cloudflare, Sentinel uses structured public API and RSS streams backed by a 3-state Circuit Breaker and request pacer."*
2. **Graceful Fault Isolation:** *"When upstream data is partially corrupted, our Pydantic Batch Validator isolates invalid records into telemetry error logs without failing the user's search request."*
3. **Zero-Downtime Resilience:** *"If a primary data source fails 3 consecutive times, the circuit trips to OPEN, traffic immediately diverts to secondary fallbacks, and automatic canary probes test recovery after a 30-second cooldown."*
4. **Safe AI Advisory:** *"Schema drift is detected mathematically at the key level, and our AI Drift Assistant proposes confidence-scored field translations without ever mutating production code unsafely."*
