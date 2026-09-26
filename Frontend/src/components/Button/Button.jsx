import React from 'react';

const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'success', 'outline'
  size = 'md', // 'sm', 'md', 'lg'
  icon: Icon,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    borderRadius: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    border: 'none',
    outline: 'none'
  };

  const sizes = {
    sm: { padding: '0.375rem 0.75rem', fontSize: '0.75rem' },
    md: { padding: '0.625rem 1.125rem', fontSize: '0.875rem' },
    lg: { padding: '0.875rem 1.5rem', fontSize: '1rem' }
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(99, 102, 241, 0.3)'
    },
    secondary: {
      backgroundColor: 'var(--bg-card-hover)',
      color: 'var(--text-main)',
      border: '1px solid var(--border-color)'
    },
    success: {
      backgroundColor: 'var(--success)',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
    },
    danger: {
      backgroundColor: 'var(--danger)',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--primary)',
      border: '1px solid var(--primary)'
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        ...baseStyles,
        ...sizes[size],
        ...variants[variant]
      }}
      className={className}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  );
};

export default Button;
