import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ProtocolMarquee } from './components/ProtocolMarquee';
import { SentinelHero } from './components/SentinelHero';
import { PremiumCenteredSearch } from './components/PremiumCenteredSearch';
import { JobCard } from './components/JobCard';
import { SentinelClosingPage } from './components/SentinelClosingPage';
import { GlassNavBar, NavPage } from './components/GlassNavBar';
import { JobDetailModal } from './components/JobDetailModal';
import { LiveFlowLoader } from './components/LiveFlowLoader';
import { IngestionResponse, Job } from './types';
import { X } from 'lucide-react';

export function App() {
  const [activePage, setActivePage] = useState<NavPage>('home');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [ingestionData, setIngestionData] = useState<IngestionResponse | null>(null);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');

  // Search section ref for smooth scrolling on Home page
  const searchRef = useRef<HTMLDivElement>(null);

  const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

  // Lightweight health ping used to refresh circuit-breaker state after search
  const fetchHealth = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/api/health`);
    } catch (_) {
      // silent — health is best-effort
    }
  }, [API_BASE]);

  // Fetch jobs — only called when user explicitly searches
  const handleSearch = useCallback(
    async (query = '', location = '', company = '', preferredSource = '') => {
      setLastQuery(query);
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
        fetchHealth();
      }
    },
    [fetchHealth, API_BASE]
  );

  // On mount: only fetch health, NOT jobs (avoids scroll glitch)
  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 4000);
    return () => clearInterval(interval);
  }, [fetchHealth]);


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
              onClick={() => navigateTo('liveflow')}
              className="block font-dela text-4xl sm:text-5xl text-white hover:text-[#bbf3e5] transition-colors cursor-pointer text-left"
            >
              LIVE FLOW
            </button>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#74ab9f]">
            <span>Acdyon Technologies Engineering Assessment (Part 1)</span>
            <span>FastAPI + React 100% Operational</span>
          </div>
        </div>
      )}

      {/* Glassmorphic Floating Nav Bar */}
      <GlassNavBar activePage={activePage} onNavigate={navigateTo} onSearchJobs={scrollToSearch} />

      {/* ==================== PAGES ==================== */}

      {/* 1. HOME PAGE — Hero -> Marquee -> Centered Search -> Closing */}
      {activePage === 'home' && (
        <main className="flex-1 w-full">
          <SentinelHero
            onGetStarted={scrollToSearch}
            onExploreDemo={() => navigateTo('liveflow')}
            onOpenMenu={() => setMenuOpen(true)}
          />

          <ProtocolMarquee />

          {/* Premium Centered Search Box */}
          <div ref={searchRef} id="discover-search">
            <PremiumCenteredSearch
              onSearch={handleSearch}
              loading={loadingSearch}
              ingestionData={ingestionData}
              onOpenDashboard={() => navigateTo('liveflow')}
              onSelectJob={(job) => setSelectedJob(job)}
            />
          </div>

          <SentinelClosingPage onNavigate={navigateTo} />
        </main>
      )}

      {/* 2. LIVE FLOW PAGE — Premium loader while searching, jobs grid after */}
      {activePage === 'liveflow' && (
        <main className="flex-1 w-full pt-20">
          {loadingSearch ? (
            <LiveFlowLoader query={lastQuery} />
          ) : (
            <div className="animate-pageReveal">
              {/* Centered heading */}
              <div className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-[#0b2820] border-b border-emerald-500/10 text-center">
                <h1
                  className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none"
                  style={{ textShadow: '0 0 50px rgba(52,211,153,0.12)' }}
                >
                  Explore Jobs
                </h1>
                <p className="mt-3 text-sm text-white/40 font-medium">
                  Live opportunities from RemoteOK &amp; WeWorkRemotely — normalized in real time.
                </p>
              </div>

              {/* Jobs grid — no search form, no filters, no telemetry bar */}
              <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-[#0b2820]">
                <div className="max-w-7xl mx-auto">
                  {ingestionData && ingestionData.jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {ingestionData.jobs.map((job) => (
                        <JobCard key={job.id} job={job} onSelect={setSelectedJob} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center rounded-3xl bg-[#08201a] border border-[#1b4337] space-y-3">
                      <p className="text-base font-bold text-white/60">No results yet</p>
                      <p className="text-xs text-white/30">Search from the home page to load opportunities.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
          {!loadingSearch && <SentinelClosingPage onNavigate={navigateTo} />}
        </main>
      )}

      {/* Modals */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onDiscoverMore={() => {
          setSelectedJob(null);
          navigateTo('home');
          // scroll to search section after navigation settles
          setTimeout(() => {
            const el = document.getElementById('discover-search');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 120);
        }}
      />


    </div>
  );
}

export default App;
