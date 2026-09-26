import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Filter from '../../components/Filter/Filter';
import Table from '../../components/Table/Table';
import { stockService } from '../../services/stockService';
import { useInventory } from '../../context/InventoryContext';
import { formatDate } from '../../utils/formatters';
import { History, ShieldCheck } from 'lucide-react';

const MoveHistory = () => {
  const { locations } = useInventory();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [docType, setDocType] = useState('ALL');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await stockService.getMoveHistory();
        if (res.success) setLogs(res.data);
      } catch (err) {
        console.warn('Move history fetch fallback', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(l => {
    if (docType !== 'ALL' && l.movement_type.toLowerCase() !== docType.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return l.reference?.toLowerCase().includes(q) || l.product_name?.toLowerCase().includes(q) || l.product_sku?.toLowerCase().includes(q);
    }
    return true;
  });

  const columns = [
    {
      header: 'Reference',
      accessor: 'reference',
      cell: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
          {row.reference}
        </span>
      )
    },
    {
      header: 'Movement Type',
      accessor: 'movement_type',
      cell: (row) => {
        let color = 'var(--text-main)';
        if (row.movement_type === 'Receipt') color = 'var(--success)';
        if (row.movement_type === 'Delivery') color = 'var(--danger)';
        if (row.movement_type === 'Internal Transfer') color = 'var(--info)';
        if (row.movement_type === 'Adjustment') color = 'var(--warning)';

        return <span style={{ fontWeight: 700, color }}>{row.movement_type}</span>;
      }
    },
    {
      header: 'Product',
      accessor: 'product_name',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{row.product_name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>SKU: {row.product_sku}</div>
        </div>
      )
    },
    {
      header: 'From (Source)',
      accessor: 'source_location_name',
      cell: (row) => <span style={{ color: 'var(--text-muted)' }}>{row.source_location_name}</span>
    },
    {
      header: 'To (Destination)',
      accessor: 'destination_location_name',
      cell: (row) => <span style={{ color: 'var(--text-muted)' }}>{row.destination_location_name}</span>
    },
    {
      header: 'Quantity Changed',
      accessor: 'quantity_changed',
      cell: (row) => {
        const isPos = row.quantity_changed > 0;
        return (
          <span style={{ fontWeight: 800, color: isPos ? 'var(--success)' : 'var(--danger)' }}>
            {isPos ? `+${row.quantity_changed}` : row.quantity_changed} {row.product_uom}
          </span>
        );
      }
    },
    {
      header: 'Logged User',
      accessor: 'user_name',
      cell: (row) => <span style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>{row.user_name}</span>
    },
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      cell: (row) => <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{formatDate(row.timestamp)}</span>
    }
  ];

  return (
    <div className="animate-fade-in">
      <Header
        title="Move History (Double-Entry Stock Ledger)"
        subtitle="Complete immutable audit trail of every stock increment, decrement, and transfer across warehouses"
      />

      <Filter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        documentType={docType}
        onDocumentTypeChange={setDocType}
        onReset={() => {
          setSearchQuery('');
          setDocType('ALL');
        }}
      />

      <Table columns={columns} data={filteredLogs} loading={loading} emptyMessage="No stock ledger movements recorded." />
    </div>
  );
};

export default MoveHistory;
