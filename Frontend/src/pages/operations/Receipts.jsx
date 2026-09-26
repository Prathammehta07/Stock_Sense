import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Filter from '../../components/Filter/Filter';
import Table from '../../components/Table/Table';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { useInventory } from '../../context/InventoryContext';
import { receiptService } from '../../services/receiptService';
import { formatDate } from '../../utils/formatters';
import { Plus, CheckCircle2, ArrowDownLeft, Eye, Trash2 } from 'lucide-react';

const Receipts = () => {
  const { products, locations, refreshAll } = useInventory();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [vendorName, setVendorName] = useState('');
  const [destinationLocationId, setDestinationLocationId] = useState('loc-001');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { product_id: products[0]?.id || 'prod-001', quantity_demanded: 50, unit_price: 15.50 }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const res = await receiptService.getAll();
      if (res.success) setReceipts(res.data);
    } catch (err) {
      console.warn('Receipts fetch fallback', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedReceipt(null);
    setVendorName('');
    setDestinationLocationId(locations[0]?.id || 'loc-001');
    setNotes('');
    setItems([{ product_id: products[0]?.id || 'prod-001', quantity_demanded: 50, unit_price: 15.50 }]);
    setIsModalOpen(true);
  };

  const handleAddItemRow = () => {
    setItems([...items, { product_id: products[0]?.id || 'prod-001', quantity_demanded: 10, unit_price: 10 }]);
  };

  const handleRemoveItemRow = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    setItems(newItems);
  };

  const handleCreateReceipt = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await receiptService.create({
        vendor_name: vendorName,
        destination_location_id: destinationLocationId,
        scheduled_date: scheduledDate,
        notes,
        items
      });
      setIsModalOpen(false);
      fetchReceipts();
      refreshAll();
    } catch (err) {
      alert(err.message || 'Failed to create receipt');
    } finally {
      setSubmitting(false);
    }
  };

  const handleValidateReceipt = async (id) => {
    if (!window.confirm('Validate receipt? This will automatically increase physical stock at destination location and record ledger entry.')) return;
    try {
      await receiptService.validate(id);
      alert('Receipt validated! Stock increased successfully.');
      fetchReceipts();
      refreshAll();
    } catch (err) {
      alert(err.message || 'Validation failed');
    }
  };

  const filteredReceipts = receipts.filter(r => {
    if (statusFilter !== 'ALL' && r.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.reference.toLowerCase().includes(q) || r.vendor_name.toLowerCase().includes(q);
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
      header: 'Vendor Supplier',
      accessor: 'vendor_name',
      cell: (row) => <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{row.vendor_name}</span>
    },
    {
      header: 'Destination Location',
      accessor: 'destination_location_name',
      cell: (row) => <span style={{ color: 'var(--text-muted)' }}>{row.destination_location_name}</span>
    },
    {
      header: 'Items Count',
      accessor: 'items',
      cell: (row) => <span>{(row.items || []).length} Product(s)</span>
    },
    {
      header: 'Status',
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
              setSelectedReceipt(row);
              setIsModalOpen(true);
            }}
          >
            View Details
          </Button>
          {row.status !== 'Done' && (
            <Button
              variant="success"
              size="sm"
              icon={CheckCircle2}
              onClick={() => handleValidateReceipt(row.id)}
            >
              Validate
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <Header
        title="Vendor Receipts (Incoming Goods)"
        subtitle="Receive products from external vendors and auto-update warehouse stock upon validation"
        actions={
          <Button variant="primary" icon={Plus} onClick={handleOpenCreateModal}>
            Create New Receipt
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
        data={filteredReceipts}
        loading={loading}
        emptyMessage="No vendor receipts found matching criteria."
      />

      {/* Detail / Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedReceipt ? `Receipt Detail: ${selectedReceipt.reference}` : 'Create Incoming Vendor Receipt'}
        maxWidth="700px"
      >
        {selectedReceipt ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Vendor Name</div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedReceipt.vendor_name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Status</div>
                <StatusBadge status={selectedReceipt.status} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Destination Warehouse Rack</div>
                <div style={{ fontWeight: 600 }}>{selectedReceipt.destination_location_name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Scheduled Date</div>
                <div>{formatDate(selectedReceipt.scheduled_date)}</div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Line Items Received
            </h4>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-card-hover)' }}>
                  <tr>
                    <th style={{ padding: '0.625rem 1rem', textAlign: 'left' }}>Product</th>
                    <th style={{ padding: '0.625rem 1rem', textAlign: 'right' }}>Demanded</th>
                    <th style={{ padding: '0.625rem 1rem', textAlign: 'right' }}>Received</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedReceipt.items || []).map((item, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.625rem 1rem', fontWeight: 600 }}>{item.product_name}</td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right' }}>{item.quantity_demanded}</td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--success)' }}>
                        {item.quantity_received}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
              {selectedReceipt.status !== 'Done' && (
                <Button
                  variant="success"
                  icon={CheckCircle2}
                  onClick={() => {
                    handleValidateReceipt(selectedReceipt.id);
                    setIsModalOpen(false);
                  }}
                >
                  Validate & Receive Stock (+Qty)
                </Button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateReceipt} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Vendor Supplier Name
                </label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. Apex Industrial Steel Ltd"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Destination Location / Rack
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
                  Scheduled Arrival Date
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
                  Notes / PO Reference
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. PO #9921 urgent shipment"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Add Line Items to Receive
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
                      value={item.quantity_demanded}
                      onChange={(e) => handleItemChange(idx, 'quantity_demanded', e.target.value)}
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
                {submitting ? 'Creating Receipt...' : 'Save Receipt Draft'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Receipts;
