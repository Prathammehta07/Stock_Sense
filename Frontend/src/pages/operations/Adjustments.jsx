import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Filter from '../../components/Filter/Filter';
import Table from '../../components/Table/Table';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { useInventory } from '../../context/InventoryContext';
import { adjustmentService } from '../../services/adjustmentService';
import { formatDate } from '../../utils/formatters';
import { Plus, SlidersHorizontal, Eye } from 'lucide-react';

const Adjustments = () => {
  const { products, locations, refreshAll } = useInventory();
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || 'prod-001');
  const [selectedLocationId, setSelectedLocationId] = useState(locations[0]?.id || 'loc-001');
  const [countedQuantity, setCountedQuantity] = useState(150);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAdjustments = async () => {
    setLoading(true);
    try {
      const res = await adjustmentService.getAll();
      if (res.success) setAdjustments(res.data);
    } catch (err) {
      console.warn('Adjustments fetch fallback', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const currentRecordedQty = (selectedProduct?.stock_by_location || [])
    .find(s => s.location_id === selectedLocationId)?.quantity || 0;

  const variance = Number(countedQuantity) - Number(currentRecordedQty);

  const handleOpenModal = () => {
    const prod = products[0];
    setSelectedProductId(prod?.id || 'prod-001');
    setSelectedLocationId(locations[0]?.id || 'loc-001');
    setCountedQuantity(150);
    setReason('Physical audit mismatch reconciliation');
    setIsModalOpen(true);
  };

  const handleSubmitAdjustment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adjustmentService.create({
        product_id: selectedProductId,
        location_id: selectedLocationId,
        counted_quantity: countedQuantity,
        recorded_quantity: currentRecordedQty,
        reason
      });
      alert('Physical count adjustment saved! Stock balance auto-updated.');
      setIsModalOpen(false);
      fetchAdjustments();
      refreshAll();
    } catch (err) {
      alert(err.message || 'Adjustment failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAdjustments = adjustments.filter(a => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.reference.toLowerCase().includes(q) || a.product_name?.toLowerCase().includes(q) || a.reason?.toLowerCase().includes(q);
    }
    return true;
  });

  const columns = [
    {
      header: 'Reference',
      accessor: 'reference',
      cell: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--warning)' }}>
          {row.reference}
        </span>
      )
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
      header: 'Location',
      accessor: 'location_name',
      cell: (row) => <span style={{ color: 'var(--text-muted)' }}>{row.location_name}</span>
    },
    {
      header: 'Recorded vs Counted',
      accessor: 'recorded_quantity',
      cell: (row) => (
        <div style={{ fontSize: '0.8125rem' }}>
          <span>Recorded: {row.recorded_quantity}</span> → <strong>Counted: {row.counted_quantity}</strong>
        </div>
      )
    },
    {
      header: 'Variance Delta',
      accessor: 'difference',
      cell: (row) => {
        const isPos = row.difference > 0;
        return (
          <span style={{ fontWeight: 800, color: isPos ? 'var(--success)' : row.difference < 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
            {isPos ? `+${row.difference}` : row.difference}
          </span>
        );
      }
    },
    {
      header: 'Reason',
      accessor: 'reason',
      cell: (row) => <span style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>{row.reason || 'Audit'}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <StatusBadge status={row.status || 'Done'} />
    }
  ];

  return (
    <div className="animate-fade-in">
      <Header
        title="Stock Count Adjustments"
        subtitle="Reconcile mismatches between recorded system stock and physical count in warehouse locations"
        actions={
          <Button variant="primary" icon={Plus} onClick={handleOpenModal}>
            Log Physical Count Adjustment
          </Button>
        }
      />

      <Filter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onReset={() => setSearchQuery('')}
      />

      <Table
        columns={columns}
        data={filteredAdjustments}
        loading={loading}
        emptyMessage="No stock count adjustments recorded."
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Perform Physical Inventory Stock Adjustment"
        maxWidth="600px"
      >
        <form onSubmit={handleSubmitAdjustment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Target Product
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              style={{ width: '100%' }}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Target Location / Bin
            </label>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              style={{ width: '100%' }}
            >
              {locations.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Current Recorded System Stock</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {currentRecordedQty} {selectedProduct?.uom || 'Units'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Calculated Variance</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: variance > 0 ? 'var(--success)' : variance < 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
                  {variance > 0 ? `+${variance}` : variance} {selectedProduct?.uom || 'Units'}
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                Actual Physical Counted Quantity
              </label>
              <input
                type="number"
                required
                value={countedQuantity}
                onChange={(e) => setCountedQuantity(e.target.value)}
                style={{ width: '100%', fontSize: '1rem', fontWeight: 700 }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Reason for Adjustment
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Scrapped damaged units / Found uncounted pallet"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Applying Adjustment...' : 'Confirm & Auto-Update System Stock'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Adjustments;
