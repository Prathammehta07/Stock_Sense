import React from 'react';
import { Search, Filter as FilterIcon, X } from 'lucide-react';
import { DOCUMENT_TYPES, STATUS_OPTIONS } from '../../utils/constants';

const Filter = ({
  searchQuery,
  onSearchChange,
  documentType,
  onDocumentTypeChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  location,
  onLocationChange,
  categories = [],
  locations = [],
  onReset
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.875rem',
        alignItems: 'center',
        padding: '1rem 1.25rem',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '220px' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '0.875rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-subtle)'
          }}
        />
        <input
          type="text"
          placeholder="Search SKU, Product, Reference..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            paddingLeft: '2.5rem'
          }}
        />
      </div>

      {/* Document Type Filter */}
      {onDocumentTypeChange && (
        <select
          value={documentType}
          onChange={(e) => onDocumentTypeChange(e.target.value)}
          style={{ flex: '0 1 180px' }}
        >
          {DOCUMENT_TYPES.map(type => (
            <option key={type.id} value={type.id}>{type.label}</option>
          ))}
        </select>
      )}

      {/* Status Filter */}
      {onStatusChange && (
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          style={{ flex: '0 1 150px' }}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      )}

      {/* Category Filter */}
      {onCategoryChange && (
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          style={{ flex: '0 1 160px' }}
        >
          <option value="ALL">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      )}

      {/* Warehouse/Location Filter */}
      {onLocationChange && (
        <select
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          style={{ flex: '0 1 180px' }}
        >
          <option value="ALL">All Warehouses / Locations</option>
          {locations.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      )}

      {/* Reset Filters Button */}
      {onReset && (
        <button
          onClick={onReset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.625rem 0.875rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            backgroundColor: 'transparent',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            transition: 'var(--transition)'
          }}
        >
          <X size={14} /> Clear Filters
        </button>
      )}
    </div>
  );
};

export default Filter;
