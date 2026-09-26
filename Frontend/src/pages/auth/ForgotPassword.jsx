import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import Button from '../../components/Button/Button';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await authService.forgotPassword(email);
      setMessage(`OTP Code sent! (Demo OTP: ${res.otp_code || '123456'})`);
      setTimeout(() => {
        navigate('/auth/verify-otp', { state: { email } });
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Check your email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Reset Password
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Enter your registered email to receive an OTP verification code
        </p>
      </div>

      {message && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.875rem 1rem',
            borderRadius: '8px',
            backgroundColor: 'var(--success-glow)',
            border: '1px solid var(--success)',
            color: '#ffffff',
            fontSize: '0.875rem',
            marginBottom: '1.25rem'
          }}
        >
          <CheckCircle size={18} color="var(--success)" />
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '0.875rem 1rem',
            borderRadius: '8px',
            backgroundColor: 'var(--danger-glow)',
            border: '1px solid var(--danger)',
            color: '#ffffff',
            fontSize: '0.875rem',
            marginBottom: '1.25rem'
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
            Registered Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@stocksense.io"
              style={{ width: '100%', paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={loading} icon={ArrowRight} style={{ width: '100%', marginTop: '0.5rem' }}>
          {loading ? 'Sending OTP...' : 'Send Verification OTP'}
        </Button>
      </form>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link to="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
