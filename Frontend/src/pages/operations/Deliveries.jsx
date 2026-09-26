import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Filter from '../../components/Filter/Filter';
import Table from '../../components/Table/Table';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { useInventory } from '../../context/InventoryContext';
import { deliveryService } from '../../services/deliveryService';
import { formatDate } from '../../utils/formatters';
import { Plus, CheckCircle2, ArrowUpRight, Eye, Trash2, PackageCheck } from 'lucide-react';

const Deliveries = () => {
  const { products, locations, refreshAll } = useInventory();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [sourceLocationId, setSourceLocationId] = useState('loc-001');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { product_id: products[0]?.id || 'prod-002', quantity_demanded: 10 }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const res = await deliveryService.getAll();
      if (res.success) setDeliveries(res.data);
    } catch (err) {
      console.warn('Deliveries fetch fallback', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedDelivery(null);
    setCustomerName('');
    setSourceLocationId(locations[0]?.id || 'loc-001');
    setNotes('');
    setItems([{ product_id: products[0]?.id || 'prod-002', quantity_demanded: 5 }]);
    setIsModalOpen(true);
  };

  const handleAddItemRow = () => {
    setItems([...items, { product_id: products[0]?.id || 'prod-001', quantity_demanded: 5 }]);
  };

  const handleRemoveItemRow = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    setItems(newItems);
  };

  const handleCreateDelivery = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await deliveryService.create({
        customer_name: customerName,
        source_location_id: sourceLocationId,
        scheduled_date: scheduledDate,
        notes,
        items
      });
      setIsModalOpen(false);
      fetchDeliveries();
      refreshAll();
    } catch (err) {
      alert(err.message || 'Failed to create delivery order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleValidateDelivery = async (id) => {
    if (!window.confirm('Validate delivery shipment? This will check stock availability, decrease stock from source location, and record ledger entry.')) return;
    try {
      await deliveryService.validate(id);
      alert('Delivery order validated and shipped! Stock decreased.');
      fetchDeliveries();
      refreshAll();
    } catch (err) {
      alert(err.message || 'Validation failed. Check stock levels.');
    }
  };

  const filteredDeliveries = deliveries.filter(d => {
    if (statusFilter !== 'ALL' && d.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return d.reference.toLowerCase().includes(q) || d.customer_name.toLowerCase().includes(q);
    }
    return true;
  });

  const columns = [
    {
      header: 'Reference',
      accessor: 'reference',
      cell: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--danger)' }}>
          {row.reference}
        </span>
      )
    },
    {
      header: 'Customer Recipient',
      accessor: 'customer_name',
      cell: (row) => <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{row.customer_name}</span>
    },
    {
      header: 'Source Location',
      accessor: 'source_location_name',
      cell: (row) => <span style={{ color: 'var(--text-muted)' }}>{row.source_location_name}</span>
    },
    {
      header: 'Items Count',
      accessor: 'items',
      cell: (row) => <span>{(row.items || []).length} Product(s)</span>
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
              setSelectedDelivery(row);
              setIsModalOpen(true);
            }}
          >
            View Details
          </Button>
          {row.status !== 'Done' && (
            <Button
              variant="danger"
              size="sm"
              icon={PackageCheck}
              onClick={() => handleValidateDelivery(row.id)}
            >
              Pick, Pack & Ship
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <Header
        title="Delivery Orders (Outgoing Goods)"
        subtitle="Manage customer shipments: Pick items → Pack items → Validate to automatically decrease warehouse stock"
        actions={
          <Button variant="primary" icon={Plus} onClick={handleOpenCreateModal}>
            Create Delivery Order
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
        data={filteredDeliveries}
        loading={loading}
        emptyMessage="No delivery orders found matching criteria."
      />

      {/* Detail / Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDelivery ? `Delivery Order: ${selectedDelivery.reference}` : 'Create Outgoing Delivery Order'}
        maxWidth="700px"
      >
        {selectedDelivery ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Customer Name</div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedDelivery.customer_name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Status Stage</div>
                <StatusBadge status={selectedDelivery.status} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Dispatch Source Location</div>
                <div style={{ fontWeight: 600 }}>{selectedDelivery.source_location_name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Scheduled Date</div>
                <div>{formatDate(selectedDelivery.scheduled_date)}</div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Items to Pick & Ship
            </h4>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-card-hover)' }}>
                  <tr>
                    <th style={{ padding: '0.625rem 1rem', textAlign: 'left' }}>Product</th>
                    <th style={{ padding: '0.625rem 1rem', textAlign: 'right' }}>Demanded</th>
                    <th style={{ padding: '0.625rem 1rem', textAlign: 'right' }}>Shipped</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedDelivery.items || []).map((item, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.625rem 1rem', fontWeight: 600 }}>{item.product_name}</td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right' }}>{item.quantity_demanded}</td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--danger)' }}>
                        {item.quantity_delivered}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
              {selectedDelivery.status !== 'Done' && (
                <Button
                  variant="danger"
                  icon={PackageCheck}
                  onClick={() => {
                    handleValidateDelivery(selectedDelivery.id);
                    setIsModalOpen(false);
                  }}
                >
                  Validate & Dispatch (-Qty)
                </Button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateDelivery} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Customer Name / Recipient
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Global Tech Solutions"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Source Warehouse Location
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Scheduled Dispatch Date
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
                  Shipping Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Priority shipping dock #4"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Line Items to Ship
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
                        <option key={p.id} value={p.id}>{p.name} (Stock: {p.total_stock} {p.uom})</option>
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
                {submitting ? 'Creating Order...' : 'Create Delivery Order'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Deliveries;
