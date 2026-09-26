import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, ShieldCheck, TrendingUp, RefreshCw } from 'lucide-react';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: 'var(--bg-dark)'
      }}
    >
      {/* Left Branding Panel */}
      <div
        style={{
          flex: '1 1 50%',
          display: 'none',
          lg: 'flex',
          flexDirection: 'column',
          justifyContent: 'between',
          padding: '3.5rem',
          background: 'linear-gradient(135deg, #0b1329 0%, #1e1b4b 50%, #0f172a 100%)',
          borderRight: '1px solid var(--border-color)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glowing aura */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-20%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Package color="#fff" size={26} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>StockSense</span>
        </div>

        {/* Hero Features */}
        <div style={{ margin: 'auto 0' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '1rem' }}>
            Next-Gen Modular <br /> Inventory Management System
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '480px' }}>
            Digitize receipts, delivery orders, internal transfers, and physical adjustments with a centralized real-time Stock Ledger.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.625rem', borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff' }}>Double-Entry Ledger Integrity</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Immutable audit trail for every incoming and outgoing stock movement.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.625rem', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                <TrendingUp size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff' }}>Real-time Low Stock Alerts</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Automated notifications when item counts dip below reordering rules.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.625rem', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--secondary)' }}>
                <RefreshCw size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff' }}>Multi-Warehouse & Rack Support</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Track exact availability per warehouse bin, rack, and shelving zone.</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.875rem', color: 'var(--text-subtle)' }}>
          © 2026 StockSense Enterprise. All rights reserved.
        </div>
      </div>

      {/* Right Auth Form Outlet */}
      <div
        style={{
          flex: '1 1 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
