import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import Button from '../../components/Button/Button';
import { KeyRound, Lock, CheckCircle, ArrowLeft } from 'lucide-react';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialEmail = location.state?.email || 'admin@stocksense.io';
  const [email, setEmail] = useState(initialEmail);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.verifyOTP(email, otpCode, newPassword);
      alert('Password updated successfully! Please sign in with your new password.');
      navigate('/auth/login');
    } catch (err) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          OTP Verification
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Enter the OTP sent to <strong>{email}</strong> along with your new password
        </p>
      </div>

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
            6-Digit OTP Code
          </label>
          <div style={{ position: 'relative' }}>
            <KeyRound size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              required
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="e.g. 123456"
              style={{ width: '100%', paddingLeft: '2.5rem', letterSpacing: '0.25em', fontWeight: 700 }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
            New Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new strong password"
              style={{ width: '100%', paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={loading} icon={CheckCircle} style={{ width: '100%', marginTop: '0.5rem' }}>
          {loading ? 'Verifying...' : 'Reset Password & Sign In'}
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

export default OTPVerification;
