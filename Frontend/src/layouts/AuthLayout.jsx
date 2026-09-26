import React, { useEffect, useRef, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, TrendingUp, RefreshCw } from 'lucide-react';

const SLIDES = [
  {
    icon: ShieldCheck,
    title: 'Double-entry ledger integrity',
    body: 'Every incoming and outgoing move is written to an immutable audit trail.',
    ref: 'LDG-001'
  },
  {
    icon: TrendingUp,
    title: 'Real-time low stock alerts',
    body: 'Automated flags the moment an item count dips below its reorder rule.',
    ref: 'LDG-002'
  },
  {
    icon: RefreshCw,
    title: 'Multi-warehouse rack support',
    body: 'Exact availability tracked per warehouse, bin, rack, and shelf.',
    ref: 'LDG-003'
  }
];

const CrateStack = () => {
  const stageRef = useRef(null);
  const groupRef = useRef(null);

  const handleMove = (e) => {
    const stage = stageRef.current;
    const group = groupRef.current;
    if (!stage || !group) return;
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    group.style.animationPlayState = 'paused';
    group.style.transform = `rotateX(${14 - y * 20}deg) rotateY(${-18 + x * 30}deg)`;
  };

  const handleLeave = () => {
    const group = groupRef.current;
    if (!group) return;
    group.style.animationPlayState = 'running';
    group.style.transform = '';
  };

  const crate = (size, x, y, z, color) => (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        left: `calc(50% + ${x}px - ${size / 2}px)`,
        top: `calc(50% + ${y}px - ${size / 2}px)`,
        transformStyle: 'preserve-3d',
        transform: `translateZ(${z}px)`
      }}
    >
      {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face) => {
        const faceTransform = {
          front: `translateZ(${size / 2}px)`,
          back: `rotateY(180deg) translateZ(${size / 2}px)`,
          right: `rotateY(90deg) translateZ(${size / 2}px)`,
          left: `rotateY(-90deg) translateZ(${size / 2}px)`,
          top: `rotateX(90deg) translateZ(${size / 2}px)`,
          bottom: `rotateX(-90deg) translateZ(${size / 2}px)`
        }[face];
        const shade = face === 'top' ? 1 : face === 'front' || face === 'back' ? 0.85 : 0.65;
        return (
          <div
            key={face}
            className="crate-face"
            style={{
              width: size,
              height: size,
              background: color,
              opacity: shade,
              transform: faceTransform
            }}
          />
        );
      })}
    </div>
  );

  return (
    <div
      ref={stageRef}
      className="crate-stage"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ position: 'relative', width: '100%', height: '280px' }}
    >
      <div ref={groupRef} className="crate-group" style={{ position: 'absolute', inset: 0 }}>
        {crate(96, -70, 40, -20, '#2a221d')}
        {crate(110, 60, 30, 10, '#1d1815')}
        {crate(84, -10, -55, 40, '#e30b5d')}
      </div>
    </div>
  );
};

const ScrollRail = () => {
  const railRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const slides = Array.from(rail.querySelectorAll('.scroll-rail-slide'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.dataset.index));
          }
        });
      },
      { root: rail, threshold: 0.6 }
    );
    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const jumpTo = (i) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.children[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'stretch' }}>
      <div ref={railRef} className="scroll-rail" style={{ height: '150px', flex: 1 }}>
        {SLIDES.map((slide, i) => (
          <div key={slide.ref} data-index={i} className="scroll-rail-slide" style={{ height: '150px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                flexShrink: 0,
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}
            >
              <slide.icon size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-subtle)' }}>{slide.ref}</span>
              </div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{slide.title}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '380px' }}>{slide.body}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="rail-dots" style={{ justifyContent: 'center', paddingTop: '0.25rem' }}>
        {SLIDES.map((slide, i) => (
          <div
            key={slide.ref}
            className={`rail-dot ${active === i ? 'is-active' : ''}`}
            onClick={() => jumpTo(i)}
            role="button"
            aria-label={`Go to ${slide.title}`}
          />
        ))}
      </div>
    </div>
  );
};

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-dark)' }}>
      <div
        className="branding-panel"
        style={{
          flex: '1 1 52%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3.5rem',
          borderRight: '1px solid var(--border-color)',
          position: 'relative',
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 48px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              border: '1px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              color: 'var(--primary)',
              fontSize: '1.125rem'
            }}
          >
            S
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, letterSpacing: '0.02em', color: 'var(--text-main)', textTransform: 'uppercase' }}>
            StockSense
          </span>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
            MANIFEST // WAREHOUSE-OS
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: 700,
              lineHeight: 0.95,
              color: 'var(--text-main)',
              marginBottom: '1.5rem',
              textTransform: 'uppercase'
            }}
          >
            Every crate,<br />tracked.
          </h1>

          <CrateStack />

          <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            <ScrollRail />
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
          © 2026 STOCKSENSE — DOC-REF AUTH-LAYOUT
        </div>
      </div>

      <div style={{ flex: '1 1 48%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <Outlet />
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .branding-panel { display: none; }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
