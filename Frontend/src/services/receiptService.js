import { request } from './api';

export const receiptService = {
  getAll: () => request('/receipts'),
  getById: (id) => request(`/receipts/${id}`),
  create: (data) => request('/receipts', { method: 'POST', body: JSON.stringify(data) }),
  validate: (id) => request(`/receipts/${id}/validate`, { method: 'POST' })
};
