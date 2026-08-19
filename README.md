# Sentinel — Adaptive Job Ingestion System

> **Acdyon Technologies Engineering Assessment (Part 1: Resilient Data Ingestion)**  
> A production-quality, fault-tolerant job ingestion engine and candidate discovery platform featuring 3-state circuit breakers, bounded request pacing, typed schema validation, deterministic fallbacks, and AI-assisted schema drift diagnosis with the full MetaMask.io 3D WebGL page architecture.

---

## 🦊 MetaMask Structural Replication & Sections

The frontend structure exactly mirrors **MetaMask (https://metamask.io/)** across all 8 major sections:

1. **Sticky Header (`Header.tsx`):** MetaMask pill container with live network pipeline badge (`PIPELINES HEALTHY` / `FALLBACK ACTIVE`).
2. **Section 1: Hero Section (`MetaMaskHeroFull.tsx`):**
   - Retro-futuristic bold typography: `WHERE YOUR JOBS LIVE`.
   - **Interactive 3D WebGL Mascot Hologram (`Sentinel3DHologram.tsx`):** Dynamic Three.js cybernetic icosahedron core with gyroscopic rings and floating particle cloud that dynamically follows user mouse coordinates (mimicking the MetaMask Fox Head tracking effect).
   - Floating 3D coins, white CTA pill, and bottom-left live update banner.
3. **Section 2: Pipeline Section (`MetaMaskSectionIngest.tsx`):**
   - Giant block heading: `INGEST ANYTHING` with 4 surrounding cards (REST API, RSS Feed, Pydantic Schema, Fallback Tier) and central interactive Search & Opportunities Console.
4. **Section 3: Resilience Section (`MetaMaskSectionResilience.tsx`):**
   - Giant block heading: `TURN YOUR RESILIENCE ON` with 4 surrounding cards (Circuit Breaker, Jittered Pacer, Record Isolation, Health Scoring) and central live Telemetry Dashboard.
5. **Section 4: Security Section (`MetaMaskSectionSecurity.tsx`):**
   - Giant block heading: `MAXIMUM SECURITY` with 4 security pillars (Stopping Boundary, Detection Surface Parity, AI Schema Drift Radar, Chaos Bench) and central Chaos Demo Bench.
6. **Section 5: Stats Section (`MetaMaskSectionStats.tsx`):**
   - 4 horizontal validation benchmarks (100% Invariant Validation, 17/17 Passed Pytests, <250ms Median Latency, 3-State Breakers).
7. **Section 6: Bottom CTA Section (`MetaMaskSectionCTA.tsx`):**
   - Giant block heading: `GET STARTED` with 3D glow.
8. **Section 7: Education & Updates Section (`MetaMaskSectionEducation.tsx`):**
   - Split Newsletter card + Educational Lesson portal.
9. **Section 8: Full Mega Footer Directory (`MetaMaskFooterFull.tsx`):**
   - Footnotes with assessment alignment notes + 4-column directory (Ingestion, Resilience, Developer & Chaos, Documentation) + Bottom Language bar.

---

## 🏛️ Ingestion Pipeline & Resilience State Machine

```
                                  CLIENT UI
                   ┌───────────────────┴───────────────────┐
                   ▼                                       ▼
          [Job Discovery View]                 [Telemetry & Demo Lab]
                   │                                       │
                   └───────────────────┬───────────────────┘
                                       │ HTTP / JSON
                                       ▼
                             FASTAPI BACKEND
                                       │
                              Source Registry
                                       │
                             Ingestion Orchestrator
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
              RemoteOK (API)     WWR (RSS XML)      Sandbox (Controlled)
                    │                  │                  │
                    └──────────────────┼──────────────────┘
                                       ▼
                       Circuit Breaker & Request Pacer
                                       ▼
                             Source Normalization
                                       ▼
                            Pydantic Batch Validator
                                       ▼
                             Schema Drift Detector
                                       ▼
                           Live Telemetry & Monitor
                                       ▼
                         AI Schema Drift Diagnoser
```

---

## 🧪 Verification & Test Results

```bash
cd backend
pytest -v
```

Tests verify:
- ✅ Normalization for API, RSS XML, and Sandbox
- ✅ Circuit Breaker transitions (`CLOSED` $\to$ `OPEN` $\to$ `HALF_OPEN` $\to$ `CLOSED`)
- ✅ Bounded retry loops and jittered exponential backoff
- ✅ Batch validation and corrupted record isolation
- ✅ Schema drift structural anomaly detection
- ✅ AI diagnostic field mapping generation
- ✅ Automatic fallback diversion when primary source trips

---

## ⚡ Quick Start

```bash
# 1. Start Backend
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload

# 2. Start Frontend
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` to interact with the full MetaMask 3D experience!
