import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  SlidersHorizontal,
  History,
  Building2,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [opsOpen, setOpsOpen] = useState(true);

  const isOpsActive = location.pathname.startsWith('/operations');

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.875rem',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? '#ffffff' : 'var(--text-muted)',
    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
    boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
    transition: 'var(--transition)'
  });

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 101,
        padding: '1.25rem 1rem'
      }}
    >
      <div>
        {/* Logo Brand Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 0.5rem 1.5rem 0.5rem',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '1.25rem'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--primary)',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Package color="var(--primary)" size={20} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, letterSpacing: '0.01em', color: 'var(--text-main)', textTransform: 'uppercase' }}>
              Stock<span style={{ color: 'var(--primary)' }}>Sense</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: 500 }}>
              INVENTORY-OS v1.0
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {/* Dashboard */}
          <NavLink to="/dashboard" style={linkStyle}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          {/* Products */}
          <NavLink to="/products" style={linkStyle}>
            <Package size={18} /> Products & Stock
          </NavLink>

          {/* Operations Dropdown Group */}
          <div>
            <button
              onClick={() => setOpsOpen(!opsOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontWeight: isOpsActive ? 700 : 500,
                color: isOpsActive ? 'var(--primary)' : 'var(--text-muted)',
                backgroundColor: 'transparent',
                transition: 'var(--transition)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Layers size={18} /> Operations
              </div>
              <ChevronDown
                size={16}
                style={{
                  transform: opsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>

            {opsOpen && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  paddingLeft: '1.75rem',
                  marginTop: '0.25rem'
                }}
              >
                <NavLink to="/operations/receipts" style={linkStyle}>
                  <ArrowDownLeft size={16} color="var(--success)" /> Receipts (Incoming)
                </NavLink>

                <NavLink to="/operations/deliveries" style={linkStyle}>
                  <ArrowUpRight size={16} color="var(--danger)" /> Deliveries (Outgoing)
                </NavLink>

                <NavLink to="/operations/transfers" style={linkStyle}>
                  <ArrowLeftRight size={16} color="var(--info)" /> Internal Transfers
                </NavLink>

                <NavLink to="/operations/adjustments" style={linkStyle}>
                  <SlidersHorizontal size={16} color="var(--warning)" /> Stock Adjustments
                </NavLink>
              </div>
            )}
          </div>

          {/* Move History / Stock Ledger */}
          <NavLink to="/move-history" style={linkStyle}>
            <History size={18} /> Move History
          </NavLink>

          {/* Warehouses & Locations */}
          <NavLink to="/warehouses" style={linkStyle}>
            <Building2 size={18} /> Warehouses & Racks
          </NavLink>

          {/* Settings */}
          <NavLink to="/settings" style={linkStyle}>
            <Settings size={18} /> Settings
          </NavLink>
        </nav>
      </div>

      {/* Profile Sidebar Footer */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        <NavLink to="/profile" style={linkStyle}>
          <User size={18} /> My Profile
        </NavLink>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--danger)',
            backgroundColor: 'transparent',
            transition: 'var(--transition)'
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
