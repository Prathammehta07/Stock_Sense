import { request } from './api';

export const adjustmentService = {
  getAll: () => request('/adjustments'),
  getById: (id) => request(`/adjustments/${id}`),
  create: (data) => request('/adjustments', { method: 'POST', body: JSON.stringify(data) })
};
