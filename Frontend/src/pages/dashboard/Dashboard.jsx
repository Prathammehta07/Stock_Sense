import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Filter from '../../components/Filter/Filter';
import Table from '../../components/Table/Table';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Button from '../../components/Button/Button';
import { useInventory } from '../../context/InventoryContext';
import { formatDate } from '../../utils/formatters';
import {
  Package,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  SlidersHorizontal,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { stats, categories, locations, refreshAll, loading } = useInventory();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [docType, setDocType] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [location, setLocation] = useState('ALL');

  const { kpis = {}, recent_movements = [] } = stats;

  // Filter recent movements based on dynamic filters
  const filteredMovements = recent_movements.filter(m => {
    if (docType !== 'ALL' && m.movement_type.toLowerCase() !== docType.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchRef = m.reference?.toLowerCase().includes(q);
      const matchProd = m.product_name?.toLowerCase().includes(q);
      const matchSku = m.product_sku?.toLowerCase().includes(q);
      if (!matchRef && !matchProd && !matchSku) return false;
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
      header: 'Operation Type',
      accessor: 'movement_type',
      cell: (row) => {
        let badgeColor = 'var(--text-main)';
        if (row.movement_type === 'Receipt') badgeColor = 'var(--success)';
        if (row.movement_type === 'Delivery') badgeColor = 'var(--danger)';
        if (row.movement_type === 'Internal Transfer') badgeColor = 'var(--info)';
        if (row.movement_type === 'Adjustment') badgeColor = 'var(--warning)';

        return (
          <span style={{ fontWeight: 600, color: badgeColor }}>
            {row.movement_type}
          </span>
        );
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
      header: 'Source Location',
      accessor: 'source_location_name',
      cell: (row) => <span style={{ color: 'var(--text-muted)' }}>{row.source_location_name}</span>
    },
    {
      header: 'Destination Location',
      accessor: 'destination_location_name',
      cell: (row) => <span style={{ color: 'var(--text-muted)' }}>{row.destination_location_name}</span>
    },
    {
      header: 'Quantity Changed',
      accessor: 'quantity_changed',
      cell: (row) => {
        const isPos = row.quantity_changed > 0;
        return (
          <span style={{ fontWeight: 700, color: isPos ? 'var(--success)' : 'var(--danger)' }}>
            {isPos ? `+${row.quantity_changed}` : row.quantity_changed} {row.product_uom}
          </span>
        );
      }
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
        title="Inventory Operations Snapshot"
        subtitle="Real-time monitoring of warehouse stock movements, receipts, deliveries, and transfers"
        actions={
          <>
            <Button variant="secondary" icon={RefreshCw} onClick={refreshAll} disabled={loading}>
              Refresh
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => navigate('/operations/receipts')}>
              Create Receipt
            </Button>
          </>
        }
      />

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        {/* KPI 1: Total Products */}
        <div
          onClick={() => navigate('/products')}
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Products</span>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
            {kpis.total_products || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
            Active catalog items
          </div>
        </div>

        {/* KPI 2: Low Stock Alerts */}
        <div
          onClick={() => navigate('/products')}
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            cursor: 'pointer',
            border: kpis.low_stock_count > 0 ? '1px solid var(--danger)' : '1px solid var(--border-color)',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Low Stock Items</span>
            <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: 'var(--danger-glow)', color: 'var(--danger)' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: kpis.low_stock_count > 0 ? 'var(--danger)' : 'var(--text-main)', lineHeight: 1 }}>
            {kpis.low_stock_count || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: kpis.low_stock_count > 0 ? 'var(--danger)' : 'var(--text-subtle)', marginTop: '0.5rem', fontWeight: 600 }}>
            {kpis.low_stock_count > 0 ? 'Action required: Below min reorder level' : 'All stock levels healthy'}
          </div>
        </div>

        {/* KPI 3: Pending Receipts */}
        <div
          onClick={() => navigate('/operations/receipts')}
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pending Receipts</span>
            <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
              <ArrowDownLeft size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
            {kpis.pending_receipts_count || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
            Incoming vendor shipments
          </div>
        </div>

        {/* KPI 4: Pending Deliveries */}
        <div
          onClick={() => navigate('/operations/deliveries')}
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pending Deliveries</span>
            <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: 'var(--danger-glow)', color: 'var(--danger)' }}>
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
            {kpis.pending_deliveries_count || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
            Outgoing customer orders
          </div>
        </div>

        {/* KPI 5: Internal Transfers */}
        <div
          onClick={() => navigate('/operations/transfers')}
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Scheduled Transfers</span>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(122, 140, 107, 0.15)', color: 'var(--info)' }}>
              <ArrowLeftRight size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
            {kpis.scheduled_transfers_count || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
            Internal rack movements
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <Button variant="outline" icon={ArrowDownLeft} onClick={() => navigate('/operations/receipts')}>
          New Vendor Receipt
        </Button>
        <Button variant="outline" icon={ArrowUpRight} onClick={() => navigate('/operations/deliveries')}>
          New Customer Delivery
        </Button>
        <Button variant="outline" icon={ArrowLeftRight} onClick={() => navigate('/operations/transfers')}>
          New Internal Transfer
        </Button>
        <Button variant="outline" icon={SlidersHorizontal} onClick={() => navigate('/operations/adjustments')}>
          New Stock Adjustment
        </Button>
      </div>

      {/* Dynamic Filter Component */}
      <Filter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        documentType={docType}
        onDocumentTypeChange={setDocType}
        status={status}
        onStatusChange={setStatus}
        category={category}
        onCategoryChange={setCategory}
        location={location}
        onLocationChange={setLocation}
        categories={categories}
        locations={locations}
        onReset={() => {
          setSearchQuery('');
          setDocType('ALL');
          setStatus('ALL');
          setCategory('ALL');
          setLocation('ALL');
        }}
      />

      {/* Recent Movements Table */}
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Recent Inventory Movements (Stock Ledger)
        </h3>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Showing {filteredMovements.length} log entries
        </span>
      </div>

      <Table
        columns={columns}
        data={filteredMovements}
        loading={loading}
        emptyMessage="No stock movements match the selected filters."
      />
    </div>
  );
};

export default Dashboard;
