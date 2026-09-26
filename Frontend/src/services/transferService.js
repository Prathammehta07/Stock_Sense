import { request } from './api';

export const transferService = {
  getAll: () => request('/transfers'),
  getById: (id) => request(`/transfers/${id}`),
  create: (data) => request('/transfers', { method: 'POST', body: JSON.stringify(data) }),
  validate: (id) => request(`/transfers/${id}/validate`, { method: 'POST' })
};
