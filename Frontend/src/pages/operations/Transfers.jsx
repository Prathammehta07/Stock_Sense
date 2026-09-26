import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Filter from '../../components/Filter/Filter';
import Table from '../../components/Table/Table';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { useInventory } from '../../context/InventoryContext';
import { transferService } from '../../services/transferService';
import { formatDate } from '../../utils/formatters';
import { Plus, CheckCircle2, ArrowLeftRight, Eye, Trash2 } from 'lucide-react';

const Transfers = () => {
  const { products, locations, refreshAll } = useInventory();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [sourceLocationId, setSourceLocationId] = useState('loc-001');
  const [destinationLocationId, setDestinationLocationId] = useState('loc-003');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { product_id: products[0]?.id || 'prod-001', quantity: 20 }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const res = await transferService.getAll();
      if (res.success) setTransfers(res.data);
    } catch (err) {
      console.warn('Transfers fetch fallback', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedTransfer(null);
    setSourceLocationId(locations[0]?.id || 'loc-001');
    setDestinationLocationId(locations[2]?.id || 'loc-003');
    setNotes('');
    setItems([{ product_id: products[0]?.id || 'prod-001', quantity: 15 }]);
    setIsModalOpen(true);
  };

  const handleAddItemRow = () => {
    setItems([...items, { product_id: products[0]?.id || 'prod-001', quantity: 10 }]);
  };

  const handleRemoveItemRow = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    setItems(newItems);
  };

  const handleCreateTransfer = async (e) => {
    e.preventDefault();
    if (sourceLocationId === destinationLocationId) {
      alert('Source and destination locations cannot be identical.');
      return;
    }
    setSubmitting(true);
    try {
      await transferService.create({
        source_location_id: sourceLocationId,
        destination_location_id: destinationLocationId,
        scheduled_date: scheduledDate,
        notes,
        items
      });
      setIsModalOpen(false);
      fetchTransfers();
      refreshAll();
    } catch (err) {
      alert(err.message || 'Failed to create internal transfer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleValidateTransfer = async (id) => {
    if (!window.confirm('Validate internal transfer? This will move stock between locations and record double-entry ledger.')) return;
    try {
      await transferService.validate(id);
      alert('Internal transfer validated and completed!');
      fetchTransfers();
      refreshAll();
    } catch (err) {
      alert(err.message || 'Validation failed');
    }
  };

  const filteredTransfers = transfers.filter(t => {
    if (statusFilter !== 'ALL' && t.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.reference.toLowerCase().includes(q) || t.source_location_name?.toLowerCase().includes(q) || t.destination_location_name?.toLowerCase().includes(q);
    }
    return true;
  });

  const columns = [
    {
      header: 'Reference',
      accessor: 'reference',
      cell: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--info)' }}>
          {row.reference}
        </span>
      )
    },
    {
      header: 'Source Location',
      accessor: 'source_location_name',
      cell: (row) => <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{row.source_location_name}</span>
    },
    {
      header: 'Destination Location',
      accessor: 'destination_location_name',
      cell: (row) => <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{row.destination_location_name}</span>
    },
    {
      header: 'Items Relocated',
      accessor: 'items',
      cell: (row) => <span>{(row.items || []).length} Line Item(s)</span>
    },
    {
      header: 'Status Stage',
      accessor: 'status',
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Scheduled Date',
      accessor: 'scheduled_date',
      cell: (row) => <span style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>{formatDate(row.scheduled_date)}</span>
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={Eye}
            onClick={() => {
              setSelectedTransfer(row);
              setIsModalOpen(true);
            }}
          >
            View Details
          </Button>
          {row.status !== 'Done' && (
            <Button
              variant="primary"
              size="sm"
              icon={CheckCircle2}
              onClick={() => handleValidateTransfer(row.id)}
            >
              Execute Transfer
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <Header
        title="Internal Stock Transfers"
        subtitle="Relocate stock inside company between warehouses, racks, and shelving bins with automated ledger tracking"
        actions={
          <Button variant="primary" icon={Plus} onClick={handleOpenCreateModal}>
            Schedule Transfer
          </Button>
        }
      />

      <Filter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('ALL');
        }}
      />

      <Table
        columns={columns}
        data={filteredTransfers}
        loading={loading}
        emptyMessage="No internal transfers found matching criteria."
      />

      {/* Detail / Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTransfer ? `Transfer Detail: ${selectedTransfer.reference}` : 'Schedule Internal Stock Transfer'}
        maxWidth="700px"
      >
        {selectedTransfer ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Source Location</div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedTransfer.source_location_name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Destination Location</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>{selectedTransfer.destination_location_name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Status Stage</div>
                <StatusBadge status={selectedTransfer.status} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Scheduled Date</div>
                <div>{formatDate(selectedTransfer.scheduled_date)}</div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Transferred Products
            </h4>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-card-hover)' }}>
                  <tr>
                    <th style={{ padding: '0.625rem 1rem', textAlign: 'left' }}>Product</th>
                    <th style={{ padding: '0.625rem 1rem', textAlign: 'right' }}>Transfer Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedTransfer.items || []).map((item, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.625rem 1rem', fontWeight: 600 }}>{item.product_name}</td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--info)' }}>
                        {item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
              {selectedTransfer.status !== 'Done' && (
                <Button
                  variant="primary"
                  icon={CheckCircle2}
                  onClick={() => {
                    handleValidateTransfer(selectedTransfer.id);
                    setIsModalOpen(false);
                  }}
                >
                  Execute Transfer Now
                </Button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Source Location (From)
                </label>
                <select
                  value={sourceLocationId}
                  onChange={(e) => setSourceLocationId(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Destination Location (To)
                </label>
                <select
                  value={destinationLocationId}
                  onChange={(e) => setDestinationLocationId(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Scheduled Move Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Reason / Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Move to production assembly line"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Items to Transfer
                </label>
                <Button variant="outline" size="sm" icon={Plus} onClick={handleAddItemRow}>
                  Add Row
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <select
                      value={item.product_id}
                      onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
                      style={{ flex: 2 }}
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      style={{ flex: 1 }}
                    />

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        style={{ color: 'var(--danger)', padding: '0.5rem' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Scheduling...' : 'Save Transfer'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Transfers;
