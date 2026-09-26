import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import AuthModeToggle from '../../components/AuthModeToggle/AuthModeToggle';
import { isValidEmail, isValidRequired } from '../../utils/validation';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};
    if (!isValidRequired(email)) errors.email = 'Email is required.';
    else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
    if (!isValidRequired(password)) errors.password = 'Password is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-flip-in">
      <AuthModeToggle mode="login" />

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-subtle)', marginBottom: '0.5rem' }}>
          DOC-REF LOGIN-01
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase' }}>
          Sign in to dock
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
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@stocksense.io"
              style={{ width: '100%', paddingLeft: '2.5rem', borderColor: fieldErrors.email ? 'var(--danger)' : undefined }}
            />
          </div>
          {fieldErrors.email && <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.375rem' }}>{fieldErrors.email}</div>}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Password
            </label>
            <Link to="/auth/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
              Forgot Password?
            </Link>
          </div>
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

        <Button type="submit" variant="primary" size="lg" disabled={loading} icon={LogIn} style={{ width: '100%', marginTop: '0.5rem' }}>
          {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
        </Button>
      </form>
    </div>
  );
};

export default Login;
