import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthModeToggle = ({ mode }) => {
  const navigate = useNavigate();
  const isSignup = mode === 'signup';

  return (
    <div className="mode-toggle" style={{ marginBottom: '2rem' }}>
      <div className="toggle-thumb" style={{ transform: isSignup ? 'translateX(100%)' : 'translateX(0)' }} />
      <button
        type="button"
        className={!isSignup ? 'is-active' : ''}
        onClick={() => navigate('/auth/login')}
      >
        Sign In
      </button>
      <button
        type="button"
        className={isSignup ? 'is-active' : ''}
        onClick={() => navigate('/auth/signup')}
      >
        Register
      </button>
    </div>
  );
};

export default AuthModeToggle;
