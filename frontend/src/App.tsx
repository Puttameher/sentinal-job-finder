import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ProtocolMarquee } from './components/ProtocolMarquee';
import { SentinelHero } from './components/SentinelHero';
import { PremiumCenteredSearch } from './components/PremiumCenteredSearch';
import { SentinelSectionIngest } from './components/SentinelSectionIngest';
import { SentinelSectionResilience } from './components/SentinelSectionResilience';
import { SentinelSectionStats } from './components/SentinelSectionStats';
import { SentinelClosingPage } from './components/SentinelClosingPage';
import { GlassNavBar, NavPage } from './components/GlassNavBar';
import { SourceCycleLoader } from './components/SourceCycleLoader';
import { JobDetailModal } from './components/JobDetailModal';
import { DriftDiagnosisModal } from './components/DriftDiagnosisModal';
import { IngestionResponse, Job, SystemHealthResponse, DriftDiagnosisResponse } from './types';
import { X } from 'lucide-react';

export function App() {
  const [activePage, setActivePage] = useState<NavPage>('home');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [systemHealth, setSystemHealth] = useState<SystemHealthResponse | null>(null);
  const [ingestionData, setIngestionData] = useState<IngestionResponse | null>(null);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // AI Drift Diagnosis Modal State
  const [driftModalOpen, setDriftModalOpen] = useState<boolean>(false);
  const [driftDiagnosis, setDriftDiagnosis] = useState<DriftDiagnosisResponse | null>(null);
  const [loadingDrift, setLoadingDrift] = useState<boolean>(false);

  // Search section ref for smooth scrolling on Home page
  const searchRef = useRef<HTMLDivElement>(null);

  const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

  // Fetch telemetry and system health
  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      if (res.ok) {
        const data: SystemHealthResponse = await res.json();
        setSystemHealth(data);
      }
    } catch (err) {
      console.error('Error fetching system health:', err);
    }
  }, [API_BASE]);

  // Fetch jobs
  const handleSearch = useCallback(
    async (query = '', location = '', company = '', preferredSource = '') => {
      setLoadingSearch(true);
      try {
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (location) params.append('location', location);
        if (company) params.append('company', company);
        if (preferredSource) params.append('preferred_source', preferredSource);

        const res = await fetch(`${API_BASE}/api/jobs?${params.toString()}`);
        if (res.ok) {
          const data: IngestionResponse = await res.json();
          setIngestionData(data);
        }
      } catch (err) {
        console.error('Error executing job ingestion search:', err);
      } finally {
        setLoadingSearch(false);
        fetchHealth(); // refresh telemetry
      }
    },
    [fetchHealth, API_BASE]
  );

  // Initial load
  useEffect(() => {
    handleSearch();
    fetchHealth();

    // Background telemetry polling every 4 seconds
    const interval = setInterval(fetchHealth, 4000);
    return () => clearInterval(interval);
  }, [fetchHealth, handleSearch]);

  // Trigger AI Schema Drift Diagnosis
  const handleOpenDriftDiagnosis = async (sourceName: string) => {
    setDriftModalOpen(true);
    setLoadingDrift(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/diagnose-drift?source_name=${encodeURIComponent(sourceName)}`, {
        method: 'POST',
      });
      if (res.ok) {
        const data: DriftDiagnosisResponse = await res.json();
        setDriftDiagnosis(data);
      }
    } catch (err) {
      console.error('Error diagnosing schema drift:', err);
    } finally {
      setLoadingDrift(false);
    }
  };

  const scrollToSearch = () => {
    if (activePage !== 'home') {
      setActivePage('home');
    }
    setMenuOpen(false);
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);
  };

  const navigateTo = (page: NavPage) => {
    setActivePage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#052824] text-gray-100 flex flex-col selection:bg-[#e2761b] selection:text-white font-sans">
      {/* Slide-over Fullscreen Navigation Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#052824]/98 backdrop-blur-2xl flex flex-col justify-between p-8 sm:p-12 animate-fadeIn text-left">
          <div className="flex items-center justify-between">
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-2xl text-white tracking-tight leading-none font-sans">
                Senti
              </span>
              <span className="font-extrabold text-2xl text-white tracking-tight leading-none font-sans">
                nel
              </span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-[#0c0d0e] hover:bg-[#1a1c1e] text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 max-w-xl my-auto">
            <button
              onClick={() => {
                setActivePage('home');
                setMenuOpen(false);
                setTimeout(scrollToSearch, 80);
              }}
              className="block font-dela text-4xl sm:text-5xl text-white hover:text-[#bbf3e5] transition-colors cursor-pointer text-left"
            >
              SEARCH ROLES
            </button>
            <button
              onClick={() => navigateTo('dashboard')}
              className="block font-dela text-4xl sm:text-5xl text-white hover:text-[#bbf3e5] transition-colors cursor-pointer text-left"
            >
              OPPORTUNITIES
            </button>
            <button
              onClick={() => navigateTo('telemetry')}
              className="block font-dela text-4xl sm:text-5xl text-white hover:text-[#bbf3e5] transition-colors cursor-pointer text-left"
            >
              TELEMETRY MATRIX
            </button>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#74ab9f]">
            <span>Acdyon Technologies Engineering Assessment (Part 1)</span>
            <span>FastAPI + React 100% Operational</span>
          </div>
        </div>
      )}

      {/* Glassmorphic Floating Nav Bar */}
      <GlassNavBar activePage={activePage} onNavigate={navigateTo} />

      {/* ==================== PAGES ==================== */}

      {/* 1. HOME PAGE — Hero -> Marquee -> Centered Search -> Closing Screen */}
      {activePage === 'home' && (
        <main className="flex-1 w-full">
          {/* Page 1: Hero Stage with 3D Mascot */}
          <SentinelHero
            onGetStarted={scrollToSearch}
            onExploreDemo={() => navigateTo('telemetry')}
            onOpenMenu={() => setMenuOpen(true)}
          />

          <ProtocolMarquee />

          {/* Page 2: Premium Centered Liquid Search Box */}
          <div ref={searchRef}>
            <PremiumCenteredSearch
              onSearch={handleSearch}
              loading={loadingSearch}
              ingestionData={ingestionData}
              onOpenDashboard={() => navigateTo('dashboard')}
              onSelectJob={(job) => setSelectedJob(job)}
            />
          </div>

          {/* Page 3: Minimalist Closing Screen */}
          <SentinelClosingPage onNavigate={navigateTo} />
        </main>
      )}

      {/* 2. DASHBOARD PAGE — Dedicated Full Ingestion Grid & Cards */}
      {activePage === 'dashboard' && (
        <main className="flex-1 w-full pt-20">
          <SentinelSectionIngest
            onSearch={handleSearch}
            loading={loadingSearch}
            ingestionData={ingestionData}
            onSelectJob={(job) => setSelectedJob(job)}
            loadingOverlay={loadingSearch ? <SourceCycleLoader /> : undefined}
          />
          <SentinelClosingPage onNavigate={navigateTo} />
        </main>
      )}

      {/* 3. TELEMETRY PAGE — Live Flow / Health & Metrics */}
      {activePage === 'telemetry' && (
        <main className="flex-1 w-full pt-20">
          <SentinelSectionResilience
            systemHealth={systemHealth}
            onRefresh={fetchHealth}
            onOpenDriftDiagnosis={handleOpenDriftDiagnosis}
          />
          <SentinelSectionStats />
          <SentinelClosingPage onNavigate={navigateTo} />
        </main>
      )}

      {/* Modals */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />

      {driftModalOpen && (
        <DriftDiagnosisModal
          diagnosis={driftDiagnosis}
          loading={loadingDrift}
          onClose={() => setDriftModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
