import { request } from './api';

export const deliveryService = {
  getAll: () => request('/deliveries'),
  getById: (id) => request(`/deliveries/${id}`),
  create: (data) => request('/deliveries', { method: 'POST', body: JSON.stringify(data) }),
  validate: (id) => request(`/deliveries/${id}/validate`, { method: 'POST' })
};
