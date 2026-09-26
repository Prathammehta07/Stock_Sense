export const STATUS_COLORS = {
  Draft: { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
  Waiting: { bg: '#ffedd5', color: '#9a3412', border: '#fed7aa' },
  Ready: { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
  Done: { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' },
  Canceled: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' }
};

export const DOCUMENT_TYPES = [
  { id: 'ALL', label: 'All Operations' },
  { id: 'Receipt', label: 'Receipts (Incoming)' },
  { id: 'Delivery', label: 'Delivery Orders (Outgoing)' },
  { id: 'Internal', label: 'Internal Transfers' },
  { id: 'Adjustment', label: 'Adjustments' }
];

export const STATUS_OPTIONS = [
  { id: 'ALL', label: 'All Statuses' },
  { id: 'Draft', label: 'Draft' },
  { id: 'Waiting', label: 'Waiting' },
  { id: 'Ready', label: 'Ready' },
  { id: 'Done', label: 'Done' },
  { id: 'Canceled', label: 'Canceled' }
];
