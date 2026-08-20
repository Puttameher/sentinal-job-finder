# Sentinel — Adaptive Job Ingestion Platform

> **Acdyon Technologies Engineering Assessment (Part 1: Resilient Data Ingestion)**  
> A production-quality, fault-tolerant job ingestion engine and candidate discovery platform featuring 3-state circuit breakers, bounded request pacing, typed schema validation, deterministic fallbacks, AI-assisted schema drift diagnosis, and an interactive 3D WebGL cyber guardian mascot.

---

## 🧭 Project Flow & User Experience

Sentinel is designed around a streamlined, responsive user flow combining retro-futuristic visuals with robust real-time ingestion:

```
                      ┌─────────────────────────────────┐
                      │          1. LANDING PAGE        │
                      │  • 3D Sentinel Mask Mascot     │
                      │  • Protocol Marquee Ribbon     │
                      │  • Instant Search & Quick Tags │
                      └────────────────┬────────────────┘
                                       │ User triggers search
                                       ▼
                      ┌─────────────────────────────────┐
                      │      2. LIVE FLOW (LOADING)     │
                      │  • 3D Toy-Cat Mascot Run Cycle │
                      │  • Dynamic Status Crossfade    │
                      │  • Synchronous Pipeline Feed   │
                      └────────────────┬────────────────┘
                                       │ Ingestion completes (<400ms)
                                       ▼
                      ┌─────────────────────────────────┐
                      │     3. EXPLORE JOBS DISPLAY     │
                      │  • Clean 3-Column Job Grid      │
                      │  • Real-Time Normalization Tags │
                      │  • Detailed Inspection Modal    │
                      │  • "Discover More" Return Link  │
                      └─────────────────────────────────┘
```

---

## 🛡️ Key Components & Architecture

### 1. Landing Stage (`SentinelHero.tsx` & `PremiumCenteredSearch.tsx`)
- **Interactive 3D WebGL Mascot (`SentinelMask3D.tsx`):** Real-time cursor tracking Three.js cybernetic guardian mask.
- **Protocol Marquee (`ProtocolMarquee.tsx`):** GPU-accelerated ticker showing live protocols (RemoteOK REST, WeWorkRemotely RSS, Sandbox, Pydantic invariants, Circuit Breakers).
- **Centered Search Console:** Instant search supporting natural language roles (e.g., *AI Engineer*, *Python*, *Remote*), with quick suggestion chips.

### 2. Live Flow & Loading Pipeline (`LiveFlowLoader.tsx`)
- **Toy-Surface Plushie Cat Mascot:** Custom SVG character with multi-layer radial gradients, glossy catch-light eyes, and physics-timed leg walk cycles.
- **Dynamic Crossfading Telemetry:** Cycles through live pipeline milestones (*Connecting…* $\to$ *Fetching API…* $\to$ *Parsing feeds…* $\to$ *Validating…* $\to$ *Ranking…* $\to$ *Almost ready…*).
- **Isolated Asset Defs:** Namespaced SVG gradient identifiers (`lf-*`) preventing style bleeding and visual glitches across the application.

### 3. Explore Jobs Results & Inspection (`JobCard.tsx` & `JobDetailModal.tsx`)
- **Distraction-Free Grid:** Clean, responsive 3-column card display of validated tech roles.
- **Deep Inspection Modal:** Full job description, salary ranges, tags, and raw **Normalized Pydantic Payload**.
- **Discover Opportunities Navigation:** Header breadcrumb link allowing seamless return to the landing search console.

---

## 🏛️ Ingestion Pipeline & Resilience State Machine

```
                                  CLIENT UI
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
          [Landing Discovery]                    [Live Flow View]
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      │ HTTP / JSON
                                      ▼
                            FASTAPI BACKEND
                                      │
                               Source Registry
                                      │
                            Ingestion Orchestrator
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
              RemoteOK (API)    WWR (RSS XML)     Sandbox (Controlled)
                    │                 │                 │
                    └─────────────────┼─────────────────┘
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

## 🧪 Verification & Test Coverage

Run the comprehensive test suite verifying the resilient backend:

```bash
cd backend
pytest -v
```

### Validated Invariants:
- ✅ **Multi-Source Normalization:** Seamless ingestion across REST APIs, XML RSS feeds, and simulated sandbox environments.
- ✅ **3-State Circuit Breakers:** Automatic state transitions (`CLOSED` $\to$ `OPEN` $\to$ `HALF_OPEN` $\to$ `CLOSED`).
- ✅ **Jittered Backoff & Pacing:** Polite request pacing destroying predictable bot signatures.
- ✅ **Partial Batch Tolerance:** Corrupted records quarantined without dropping valid jobs.
- ✅ **Schema Drift Detection & Diagnosis:** Proactive structural monitoring and AI-assisted field remapping.

---

## ⚡ Quick Start

### 1. Start Backend
```bash
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` to explore Sentinel live!
