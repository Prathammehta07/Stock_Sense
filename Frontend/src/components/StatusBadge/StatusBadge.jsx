import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

const StatusBadge = ({ status = 'Draft' }) => {
  const style = STATUS_COLORS[status] || STATUS_COLORS.Draft;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '0.25rem 0.625rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        textTransform: 'uppercase',
        letterSpacing: '0.025em'
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: style.color
        }}
      />
      {status}
    </span>
  );
};

export default StatusBadge;
