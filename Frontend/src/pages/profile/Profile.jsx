import React from 'react';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Key, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <Header title="User Profile & Credentials" subtitle="Manage your account profile and authentication details" />

      <div style={{ maxWidth: '600px' }} className="glass-panel">
        <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#fff',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{user?.name || 'Inventory User'}</h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.25rem', padding: '0.25rem 0.625rem', borderRadius: '9999px', backgroundColor: 'rgba(99,102,241,0.2)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700 }}>
              <Shield size={14} /> {user?.role || 'Inventory Manager'}
            </div>
          </div>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Mail size={20} color="var(--text-subtle)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Email Address</div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user?.email || 'user@stocksense.io'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Key size={20} color="var(--text-subtle)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Security Status</div>
              <div style={{ fontWeight: 600, color: 'var(--success)' }}>JWT Session Active</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
            <Button
              variant="danger"
              icon={LogOut}
              onClick={() => {
                logout();
                navigate('/auth/login');
              }}
            >
              Sign Out of Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
