import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import AuthModeToggle from '../../components/AuthModeToggle/AuthModeToggle';
import { isValidEmail, isValidRequired } from '../../utils/validation';
import { UserPlus, Mail, Lock, User, Shield, AlertCircle } from 'lucide-react';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Inventory Manager');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};
    if (!isValidRequired(name)) errors.name = 'Full name is required.';
    if (!isValidRequired(email)) errors.email = 'Work email is required.';
    else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
    if (!isValidRequired(password)) errors.password = 'Password is required.';
    else if (password.length < 6) errors.password = 'Use at least 6 characters.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await signup({ name, email, password, role });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-flip-in">
      <AuthModeToggle mode="signup" />

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-subtle)', marginBottom: '0.5rem' }}>
          DOC-REF SIGNUP-01
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase' }}>
          Register account
        </h2>
      </div>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.875rem 1rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--danger-glow)',
            border: '1px solid var(--danger)',
            color: '#ffffff',
            fontSize: '0.875rem',
            marginBottom: '1.25rem'
          }}
        >
          <AlertCircle size={18} color="var(--danger)" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
            Full Name
          </label>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Vance"
              style={{ width: '100%', paddingLeft: '2.5rem', borderColor: fieldErrors.name ? 'var(--danger)' : undefined }}
            />
          </div>
          {fieldErrors.name && <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.375rem' }}>{fieldErrors.name}</div>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
            Work Email
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@company.com"
              style={{ width: '100%', paddingLeft: '2.5rem', borderColor: fieldErrors.email ? 'var(--danger)' : undefined }}
            />
          </div>
          {fieldErrors.email && <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.375rem' }}>{fieldErrors.email}</div>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
            Role Designation
          </label>
          <div style={{ position: 'relative' }}>
            <Shield size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.5rem' }}
            >
              <option value="Inventory Manager">Inventory Manager</option>
              <option value="Warehouse Staff">Warehouse Staff</option>
              <option value="Admin">System Admin</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', paddingLeft: '2.5rem', borderColor: fieldErrors.password ? 'var(--danger)' : undefined }}
            />
          </div>
          {fieldErrors.password && <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.375rem' }}>{fieldErrors.password}</div>}
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={loading} icon={UserPlus} style={{ width: '100%', marginTop: '0.5rem' }}>
          {loading ? 'Creating Account...' : 'Create StockSense Account'}
        </Button>
      </form>
    </div>
  );
};

export default Signup;
