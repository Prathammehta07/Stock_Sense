export const STATUS_COLORS = {
  Draft: { bg: 'rgba(167, 156, 144, 0.12)', color: '#a79c90', border: 'rgba(167, 156, 144, 0.4)' },
  Waiting: { bg: 'rgba(232, 163, 61, 0.14)', color: '#e8a33d', border: 'rgba(232, 163, 61, 0.4)' },
  Ready: { bg: 'rgba(122, 140, 107, 0.14)', color: '#9fb08f', border: 'rgba(122, 140, 107, 0.4)' },
  Done: { bg: 'rgba(76, 154, 106, 0.16)', color: '#4c9a6a', border: 'rgba(76, 154, 106, 0.45)' },
  Canceled: { bg: 'rgba(193, 68, 43, 0.16)', color: '#c1442b', border: 'rgba(193, 68, 43, 0.45)' }
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
