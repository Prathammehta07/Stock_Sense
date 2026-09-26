import React, { useState } from 'react';
import { Bell, User, LogOut, ChevronDown, ShieldAlert, Package, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../context/InventoryContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { stats } = useInventory();
  const navigate = useNavigate();

  const [showAlerts, setShowAlerts] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const alerts = stats.alerts || [];

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Brand Title / Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'var(--success)',
            boxShadow: 'var(--shadow-glow)'
          }}
        />
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          Real-time Inventory Engine
        </span>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Low Stock Alerts Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            style={{
              position: 'relative',
              padding: '0.625rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: showAlerts ? 'var(--bg-card-hover)' : 'transparent',
              color: 'var(--text-muted)',
              transition: 'var(--transition)'
            }}
          >
            <Bell size={20} />
            {alerts.length > 0 && (
              <span
                className="badge-pulse"
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '9px',
                  height: '9px',
                  backgroundColor: 'var(--danger)',
                  borderRadius: '50%'
                }}
              />
            )}
          </button>

          {/* Alerts Dropdown Modal */}
          {showAlerts && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '340px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 200,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '0.875rem 1rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(15, 23, 42, 0.5)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldAlert size={16} color="var(--warning)" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Low Stock Alerts</span>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: 'var(--danger)',
                    fontWeight: 600
                  }}
                >
                  {alerts.length} New
                </span>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {alerts.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.875rem' }}>
                    <CheckCircle2 size={24} color="var(--success)" style={{ margin: '0 auto 0.5rem auto' }} />
                    All stock levels are optimal!
                  </div>
                ) : (
                  alerts.map((alert, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setShowAlerts(false);
                        navigate('/products');
                      }}
                      style={{
                        padding: '0.875rem 1rem',
                        borderBottom: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '2px' }}>
                        {alert.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {alert.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }} />

        {/* User Profile Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.375rem 0.625rem',
              borderRadius: 'var(--radius-sm)',
              transition: 'var(--transition)'
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: '#fff',
                fontSize: '0.875rem'
              }}
            >
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div style={{ textAlign: 'left', display: 'none', md: 'block' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
                {user?.name || 'Inventory User'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                {user?.role || 'Staff'}
              </div>
            </div>
            <ChevronDown size={16} color="var(--text-muted)" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '200px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 200,
                padding: '0.5rem 0'
              }}
            >
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/profile');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.625rem 1rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-main)',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <User size={16} /> My Profile
              </button>
              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.375rem 0' }} />
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  navigate('/auth/login');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.625rem 1rem',
                  fontSize: '0.875rem',
                  color: 'var(--danger)',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger-glow)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
