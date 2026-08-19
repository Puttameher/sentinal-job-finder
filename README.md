# Sentinel — Adaptive Job Ingestion System

> **Acdyon Technologies Engineering Assessment (Part 1: Resilient Data Ingestion)**  
> A production-quality, fault-tolerant job ingestion engine and candidate discovery platform featuring 3-state circuit breakers, bounded request pacing, typed schema validation, deterministic fallbacks, AI-assisted schema drift diagnosis, and an interactive 3D WebGL cyber guardian mascot.

---

## 🛡️ Architecture & Frontend Design

The frontend structure features a bespoke, liquid-glass cyber aesthetic:

1. **Liquid Glass Floating Navbar (`GlassNavBar.tsx`):** Frosted glassmorphic pill container with live network pipeline badge (`Live Flow [Live]`) and quick navigation.
2. **Hero Stage (`SentinelHero.tsx`):**
   - Retro-futuristic bold typography: `WHERE YOUR JOBS LIVES`.
   - **Interactive 3D WebGL Mascot (`SentinelMask3D.tsx`):** Dynamic Three.js cybernetic guardian mask with real-time 3-axis cursor physics tracking, glowing telemetry visor, and gold trims.
   - White action CTA pill and bottom-left live update banner.
3. **Protocol Marquee Ribbon (`ProtocolMarquee.tsx`):**
   - Smooth continuous GPU-accelerated ribbon showcasing active live protocols (RemoteOK REST, WeWorkRemotely RSS, Sandbox, Pydantic invariants, Circuit Breakers).
4. **Centered Ingestion Console (`PremiumCenteredSearch.tsx`):**
   - Centered liquid glass search box with real-time **Source-Cycling Loader** (`RemoteOK` $\to$ `WeWorkRemotely` $\to$ `Sandbox`).
   - Live telemetry status and normalized opportunity inspection.
5. **Telemetry & Live Flow Studio (`SentinelSectionResilience.tsx`):**
   - Real-time circuit breaker state matrix (`CLOSED` / `OPEN` / `HALF_OPEN`), health scores, and moving average latency.
6. **Closing Stage & Minimal Footer (`SentinelClosingPage.tsx`):**
   - Centered white outline character mascot (`SentinelSketchLogo.tsx`), giant monolithic `SENTINEL` display title, and docked horizontal contact & navigation bar.

---

## 🏛️ Ingestion Pipeline & Resilience State Machine

```
                                  CLIENT UI
                   ┌───────────────────┴───────────────────┐
                   ▼                                       ▼
          [Job Discovery View]                 [Telemetry Matrix]
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
- ✅ Bounded retry loops and Gaussian jittered backoff
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

Open `http://localhost:3000` to interact with the full Sentinel platform!
