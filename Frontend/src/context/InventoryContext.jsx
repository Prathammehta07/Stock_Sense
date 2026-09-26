import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import { warehouseService } from '../services/warehouseService';
import { request } from '../services/api';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [stats, setStats] = useState({
    kpis: {
      total_products: 5,
      low_stock_count: 2,
      pending_receipts_count: 2,
      pending_deliveries_count: 1,
      scheduled_transfers_count: 1
    },
    low_stock_items: [],
    recent_movements: [],
    alerts: []
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const data = await request('/dashboard/stats');
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.warn('Dashboard fetch fallback', err);
    }
  }, []);

  const fetchProductsData = useCallback(async () => {
    try {
      const data = await productService.getAll();
      if (data.success) {
        setProducts(data.data);
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.warn('Products fetch fallback', err);
    }
  }, []);

  const fetchWarehousesData = useCallback(async () => {
    try {
      const data = await warehouseService.getAll();
      if (data.success) {
        setWarehouses(data.warehouses || []);
        setLocations(data.locations || []);
      }
    } catch (err) {
      console.warn('Warehouses fetch fallback', err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchDashboardData(), fetchProductsData(), fetchWarehousesData()]);
    setLoading(false);
  }, [fetchDashboardData, fetchProductsData, fetchWarehousesData]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return (
    <InventoryContext.Provider value={{
      stats,
      products,
      categories,
      warehouses,
      locations,
      loading,
      refreshAll,
      fetchDashboardData,
      fetchProductsData,
      fetchWarehousesData
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
