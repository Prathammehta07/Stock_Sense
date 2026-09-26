import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, SlidersHorizontal } from 'lucide-react';

const Operations = () => {
  const navigate = useNavigate();

  const ops = [
    { title: 'Receipts (Incoming Stock)', desc: 'Receive vendor shipments and auto-increase stock balance.', path: '/operations/receipts', icon: ArrowDownLeft, color: 'var(--success)' },
    { title: 'Delivery Orders (Outgoing Stock)', desc: 'Pick, pack, and validate customer shipments.', path: '/operations/deliveries', icon: ArrowUpRight, color: 'var(--danger)' },
    { title: 'Internal Transfers', desc: 'Move inventory between internal warehouse locations & racks.', path: '/operations/transfers', icon: ArrowLeftRight, color: 'var(--info)' },
    { title: 'Stock Adjustments', desc: 'Reconcile system stock with physical count variance.', path: '/operations/adjustments', icon: SlidersHorizontal, color: 'var(--warning)' }
  ];

  return (
    <div className="animate-fade-in">
      <Header title="Warehouse Operations Hub" subtitle="Select an operation module to manage stock flows" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {ops.map((op, idx) => {
          const Icon = op.icon;
          return (
            <div
              key={idx}
              className="glass-panel"
              onClick={() => navigate(op.path)}
              style={{
                padding: '1.75rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', width: 'fit-content', color: op.color, marginBottom: '1rem' }}>
                <Icon size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {op.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {op.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Operations;
