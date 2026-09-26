import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Filter from '../../components/Filter/Filter';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { useInventory } from '../../context/InventoryContext';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Package, Edit, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

const Products = () => {
  const { products, categories, locations, refreshAll, loading } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('cat-001');
  const [uom, setUom] = useState('Units');
  const [minReorderLevel, setMinReorderLevel] = useState(10);
  const [maxReorderLevel, setMaxReorderLevel] = useState(500);
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [initialStock, setInitialStock] = useState(0);
  const [locationId, setLocationId] = useState('loc-001');
  const [submitting, setSubmitting] = useState(false);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setSku(`PROD-${Math.floor(100 + Math.random() * 900)}`);
    setName('');
    setCategoryId(categories[0]?.id || 'cat-001');
    setUom('pcs');
    setMinReorderLevel(10);
    setMaxReorderLevel(500);
    setCostPrice(15);
    setSellingPrice(29);
    setInitialStock(50);
    setLocationId(locations[0]?.id || 'loc-001');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setSku(prod.sku);
    setName(prod.name);
    setCategoryId(prod.category_id);
    setUom(prod.uom);
    setMinReorderLevel(prod.min_reorder_level || 10);
    setMaxReorderLevel(prod.max_reorder_level || 500);
    setCostPrice(prod.cost_price || 0);
    setSellingPrice(prod.selling_price || 0);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, {
          sku, name, category_id: categoryId, uom, min_reorder_level: minReorderLevel, max_reorder_level: maxReorderLevel, cost_price: costPrice, selling_price: sellingPrice
        });
      } else {
        await productService.create({
          sku, name, category_id: categoryId, uom, min_reorder_level: minReorderLevel, max_reorder_level: maxReorderLevel, cost_price: costPrice, selling_price: sellingPrice, initial_stock: initialStock, location_id: locationId
        });
      }
      setIsModalOpen(false);
      refreshAll();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => {
    if (categoryFilter !== 'ALL' && p.category_id !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const columns = [
    {
      header: 'Product Details',
      accessor: 'name',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9375rem' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
            SKU: <code style={{ backgroundColor: 'var(--bg-input)', padding: '2px 6px', borderRadius: '4px' }}>{row.sku}</code>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category_name',
      cell: (row) => (
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)' }}>
          {row.category_name}
        </span>
      )
    },
    {
      header: 'Total Availability',
      accessor: 'total_stock',
      cell: (row) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: row.is_low_stock ? 'var(--danger)' : 'var(--success)' }}>
              {row.total_stock} {row.uom}
            </span>
            {row.is_low_stock && (
              <span className="badge-pulse" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', backgroundColor: 'var(--danger-glow)', color: 'var(--danger)', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                <AlertTriangle size={12} /> Low Stock
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
            Reorder rule: Min {row.min_reorder_level} / Max {row.max_reorder_level} {row.uom}
          </div>
        </div>
      )
    },
    {
      header: 'Stock Breakdown per Location',
      accessor: 'stock_by_location',
      cell: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {(row.stock_by_location || []).length === 0 ? (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>No assigned locations</span>
          ) : (
            row.stock_by_location.map((s, idx) => (
              <div key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <strong>{s.location_name}:</strong> {s.quantity} {row.uom}
              </div>
            ))
          )}
        </div>
      )
    },
    {
      header: 'Unit Cost / Selling',
      accessor: 'cost_price',
      cell: (row) => (
        <div style={{ fontSize: '0.8125rem' }}>
          <div>Cost: {formatCurrency(row.cost_price)}</div>
          <div style={{ color: 'var(--success)', fontWeight: 600 }}>Sell: {formatCurrency(row.selling_price)}</div>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleOpenEditModal(row)}>
          Edit
        </Button>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <Header
        title="Product Inventory Catalog"
        subtitle="Manage products, stock levels across locations, and automatic reordering rules"
        actions={
          <Button variant="primary" icon={Plus} onClick={handleOpenCreateModal}>
            Add New Product
          </Button>
        }
      />

      <Filter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
        onReset={() => {
          setSearchQuery('');
          setCategoryFilter('ALL');
        }}
      />

      <Table
        columns={columns}
        data={filteredProducts}
        loading={loading}
        emptyMessage="No products match your search criteria."
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Product'}
        maxWidth="650px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Product Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Stainless Steel Rod 12mm"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                SKU / Item Code
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. STL-ROD-012"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{ width: '100%' }}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Unit of Measure (UoM)
              </label>
              <input
                type="text"
                required
                value={uom}
                onChange={(e) => setUom(e.target.value)}
                placeholder="e.g. kg, pcs, sqm, meters"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Reordering Rules */}
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
              Reordering Rules & Stock Thresholds
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Min Reorder Level (Low Stock Trigger)
                </label>
                <input
                  type="number"
                  min="0"
                  value={minReorderLevel}
                  onChange={(e) => setMinReorderLevel(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Max Target Capacity
                </label>
                <input
                  type="number"
                  min="0"
                  value={maxReorderLevel}
                  onChange={(e) => setMaxReorderLevel(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Initial Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Cost Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Selling Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {!editingProduct && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Initial Stock Quantity (Optional)
                </label>
                <input
                  type="number"
                  value={initialStock}
                  onChange={(e) => setInitialStock(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Initial Location
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Saving Product...' : editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
