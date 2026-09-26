import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import { useInventory } from '../../context/InventoryContext';
import { warehouseService } from '../../services/warehouseService';
import { Plus, Building2, MapPin } from 'lucide-react';

const Warehouses = () => {
  const { warehouses, locations, refreshAll, loading } = useInventory();
  const [isWhModalOpen, setIsWhModalOpen] = useState(false);
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);

  // Warehouse Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  // Location Form State
  const [whId, setWhId] = useState('');
  const [locCode, setLocCode] = useState('');
  const [locName, setLocName] = useState('');
  const [locType, setLocType] = useState('Internal');

  const [submitting, setSubmitting] = useState(false);

  const handleOpenWhModal = () => {
    setCode(`WH-${Math.floor(100 + Math.random() * 900)}`);
    setName('');
    setAddress('');
    setIsWhModalOpen(true);
  };

  const handleOpenLocModal = () => {
    setWhId(warehouses[0]?.id || 'wh-001');
    setLocCode(`WH/RACK-${Math.floor(10 + Math.random() * 90)}`);
    setLocName('');
    setLocType('Internal');
    setIsLocModalOpen(true);
  };

  const handleCreateWh = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await warehouseService.createWarehouse({ code, name, address });
      setIsWhModalOpen(false);
      refreshAll();
    } catch (err) {
      alert(err.message || 'Failed to create warehouse');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateLoc = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await warehouseService.createLocation({ warehouse_id: whId, code: locCode, name: locName, location_type: locType });
      setIsLocModalOpen(false);
      refreshAll();
    } catch (err) {
      alert(err.message || 'Failed to create location');
    } finally {
      setSubmitting(false);
    }
  };

  const whColumns = [
    {
      header: 'Warehouse Name',
      accessor: 'name',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
            <Building2 size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Code: {row.code}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Address',
      accessor: 'address',
      cell: (row) => <span style={{ color: 'var(--text-muted)' }}>{row.address || 'N/A'}</span>
    },
    {
      header: 'Internal Racks / Sub-Locations',
      accessor: 'locations',
      cell: (row) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {(row.locations || []).map((loc, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)'
              }}
            >
              {loc.name}
            </span>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <Header
        title="Multi-Warehouse & Sub-Location Management"
        subtitle="Configure physical warehouses, distribution hubs, storage racks, and shelving bin locations"
        actions={
          <>
            <Button variant="secondary" icon={MapPin} onClick={handleOpenLocModal}>
              + Add Sub-Location / Rack
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleOpenWhModal}>
              + Add New Warehouse
            </Button>
          </>
        }
      />

      <Table columns={whColumns} data={warehouses} loading={loading} emptyMessage="No warehouses configured." />

      {/* Warehouse Modal */}
      <Modal isOpen={isWhModalOpen} onClose={() => setIsWhModalOpen(false)} title="Create New Warehouse Hub" maxWidth="550px">
        <form onSubmit={handleCreateWh} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Warehouse Code
            </label>
            <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. WH-NORTH" style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Warehouse Name
            </label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. North Distribution Center" style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Full Address
            </label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 789 Highway 101, Cargo Zone" style={{ width: '100%' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setIsWhModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Creating...' : 'Save Warehouse'}</Button>
          </div>
        </form>
      </Modal>

      {/* Sub-Location Modal */}
      <Modal isOpen={isLocModalOpen} onClose={() => setIsLocModalOpen(false)} title="Add Sub-Location / Rack / Bin" maxWidth="550px">
        <form onSubmit={handleCreateLoc} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Parent Warehouse
            </label>
            <select value={whId} onChange={(e) => setWhId(e.target.value)} style={{ width: '100%' }}>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name} ({w.code})</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Location Code
            </label>
            <input type="text" required value={locCode} onChange={(e) => setLocCode(e.target.value)} placeholder="e.g. WH/MAIN/RACK-C" style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Location Name
            </label>
            <input type="text" required value={locName} onChange={(e) => setLocName(e.target.value)} placeholder="e.g. Main Store - Rack C (Electronics)" style={{ width: '100%' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setIsLocModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Creating...' : 'Save Location'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Warehouses;
