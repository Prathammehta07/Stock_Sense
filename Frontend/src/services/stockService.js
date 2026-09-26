import { request } from './api';

export const stockService = {
  getAll: () => request('/stock'),
  getMoveHistory: (params = '') => request(`/move-history${params ? `?${params}` : ''}`)
};
