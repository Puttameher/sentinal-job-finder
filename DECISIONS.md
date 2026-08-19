# Technical Decisions & Architecture Rationale — Sentinel

**Project:** Sentinel — Adaptive Job Ingestion System  
**Specification:** Acdyon Technologies Frontend Challenge (Part 1: Resilient Data Ingestion)  
**Author / Candidate:** Lead Software Engineer  

---

### 1. Why This Ingestion Strategy Over the Obvious Alternative?

Instead of relying on heavy headless browser automation (Playwright/Selenium) or unconstrained dynamic web scrapers, Sentinel implements a **typed, multi-tiered connector abstraction** prioritizing lightweight structured APIs and RSS XML streams:

1. **Efficiency & Resource Profile:** Direct HTTP REST and RSS streaming consume a fraction of the memory, CPU, and network overhead demanded by headless Chromium instances. Queries resolve in sub-300ms latency rather than multi-second browser boot times.
2. **Determinism & Testability:** Structured connectors allow strict typed validation via Pydantic, deterministic mock testing, and isolated unit verification.
3. **Resilience Separation of Concerns:** Ingestion protocols (REST vs RSS vs HTML) are fully encapsulated within individual `JobSource` adapters. The orchestration, validation, circuit breaking, and telemetry layers remain completely protocol-agnostic. Headless browser adapters can be plugged in when JavaScript rendering is genuinely required.

---

### 2. Concrete Trade-offs Under the Time Limit

1. **Deterministic Source Priority vs. Autonomous Web Crawler:**  
   *Trade-off:* We registered explicit source connectors (`RemoteOK`, `WeWorkRemotely RSS`, `Controlled Sandbox`) with priority fallback chains rather than building a speculative crawler that randomly indexes websites.  
   *Rationale:* Autonomous discovery crawlers are fragile, prone to hallucination, and run afoul of platform terms. Explicit registries provide predictable reliability, explainable fallback behavior, and clear compliance boundaries.
2. **In-Memory State Machines vs. Distributed Message Broker (Redis/Celery/Kafka):**  
   *Trade-off:* Circuit breakers, rate-limiting pacers, and telemetry event buffers were implemented in-memory within a FastAPI modular monolith.  
   *Rationale:* Avoids artificial architectural bloat and multi-container deployment overhead while maintaining 100% test coverage and instant live responsiveness for interview demonstration.

---

### 3. Where AI Was Used & The Ethical Stopping Boundary

- **AI Scope:** Artificial Intelligence is utilized exclusively as an **advisory Schema Drift Diagnostic Assistant**. When an upstream platform mutates its payload (e.g. `position` $\to$ `job_headline`), the AI analyzes the structural variance and proposes confidence-scored field mapping patches.
- **Independence:** The system remains **100% functional without an LLM key**, relying on an embedded semantic similarity engine. AI is strictly advisory and **never autonomously modifies production code**.
- **Stopping Boundary:** Sentinel strictly operates against permitted public feeds and APIs with polite header signatures and jittered backoff. We explicitly reject CAPTCHA circumvention, session hijacking, credential stuffing, and authentication bypassing.
