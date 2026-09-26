import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Filter from '../../components/Filter/Filter';
import Table from '../../components/Table/Table';
import { stockService } from '../../services/stockService';
import { useInventory } from '../../context/InventoryContext';

const Stock = () => {
  const { locations } = useInventory();
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');

  useEffect(() => {
    const fetchStock = async () => {
      setLoading(true);
      try {
        const res = await stockService.getAll();
        if (res.success) setStockList(res.data);
      } catch (err) {
        console.warn('Stock fetch fallback', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  const filteredStock = stockList.filter(s => {
    if (locationFilter !== 'ALL' && s.location_id !== locationFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.product_name?.toLowerCase().includes(q) || s.product_sku?.toLowerCase().includes(q);
    }
    return true;
  });

  const columns = [
    {
      header: 'Product',
      accessor: 'product_name',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.product_name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>SKU: {row.product_sku}</div>
        </div>
      )
    },
    {
      header: 'Location',
      accessor: 'location_name',
      cell: (row) => <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{row.location_name}</span>
    },
    {
      header: 'On-Hand Quantity',
      accessor: 'quantity',
      cell: (row) => (
        <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--success)' }}>
          {row.quantity} {row.product_uom}
        </span>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <Header title="Stock Levels per Location" subtitle="Real-time physical inventory breakdown across all warehouses and racks" />

      <Filter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        location={locationFilter}
        onLocationChange={setLocationFilter}
        locations={locations}
        onReset={() => {
          setSearchQuery('');
          setLocationFilter('ALL');
        }}
      />

      <Table columns={columns} data={filteredStock} loading={loading} emptyMessage="No stock records found." />
    </div>
  );
};

export default Stock;
