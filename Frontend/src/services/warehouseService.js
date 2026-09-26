import { request } from './api';

export const warehouseService = {
  getAll: () => request('/warehouses'),
  createWarehouse: (data) => request('/warehouses', { method: 'POST', body: JSON.stringify(data) }),
  createLocation: (data) => request('/warehouses/locations', { method: 'POST', body: JSON.stringify(data) })
};
