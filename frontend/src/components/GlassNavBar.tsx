import React, { useState, useEffect } from 'react';
import { SentinelSketchLogo } from './SentinelSketchLogo';
import { Search } from 'lucide-react';

export type NavPage = 'home' | 'liveflow';

interface GlassNavBarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage, scrollTarget?: string) => void;
}

export const GlassNavBar: React.FC<GlassNavBarProps> = ({ activePage, onNavigate }) => {
  const [visible, setVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    if (activePage !== 'home') {
      setVisible(true);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePage]);

  const navItems = [
    { id: 'liveflow' as NavPage, label: 'Live Flow', badge: 'Live' },
  ];

  const isShown = visible || activePage !== 'home';

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isShown
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-6 pointer-events-none'
      }`}
    >
      <nav
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-[22px]"
        style={{
          background:
            'linear-gradient(135deg, rgba(8, 14, 12, 0.8) 0%, rgba(5, 10, 8, 0.88) 50%, rgba(10, 16, 14, 0.8) 100%)',
          backdropFilter: 'blur(40px) saturate(1.8) brightness(1.1)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.8) brightness(1.1)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          boxShadow: [
            '0 16px 48px rgba(0, 0, 0, 0.55)',
            '0 4px 16px rgba(0, 0, 0, 0.35)',
            'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            'inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
          ].join(', '),
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center mr-1 cursor-pointer hover:scale-105 transition-transform duration-200"
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Sentinel Home"
        >
          <SentinelSketchLogo size={34} />
        </div>

        {/* Glass Divider */}
        <div
          className="w-px h-6 mx-1.5"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.14), transparent)',
          }}
        />

        {/* Nav Items */}
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-2xl text-[13px] font-semibold transition-all duration-250 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'text-white'
                  : hoveredItem === item.id
                  ? 'text-white/90'
                  : 'text-white/50 hover:text-white/80'
              }`}
              style={
                isActive
                  ? {
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.07))',
                      boxShadow:
                        'inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 8px rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }
                  : undefined
              }
            >
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-lg border"
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Glass Divider */}
        <div
          className="w-px h-6 mx-1.5"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.14), transparent)',
          }}
        />

        {/* CTA Button */}
        <button
          onClick={() => onNavigate('liveflow')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[12px] font-bold uppercase tracking-wider text-white cursor-pointer transition-all duration-250 hover:scale-[1.04] active:scale-[0.97] whitespace-nowrap"
          style={{
            background:
              'linear-gradient(135deg, rgba(226, 118, 27, 0.4), rgba(226, 118, 27, 0.2))',
            border: '1px solid rgba(226, 118, 27, 0.3)',
            boxShadow: '0 4px 16px rgba(226, 118, 27, 0.2)',
          }}
        >
          <Search className="w-3.5 h-3.5" />
          Search Jobs
        </button>
      </nav>
    </div>
  );
};
