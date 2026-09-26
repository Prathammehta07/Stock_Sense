-- StockSense Inventory Management System Database Schema
-- Compatible with PostgreSQL / MySQL / SQLite

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Inventory Manager', -- 'Inventory Manager', 'Warehouse Staff', 'Admin'
    otp_code VARCHAR(10),
    otp_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Warehouses Table
CREATE TABLE IF NOT EXISTS warehouses (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Locations Table (Racks / Bins / Sub-locations inside Warehouses)
CREATE TABLE IF NOT EXISTS locations (
    id VARCHAR(36) PRIMARY KEY,
    warehouse_id VARCHAR(36) NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    location_type VARCHAR(50) DEFAULT 'Internal', -- 'Internal', 'Vendor', 'Customer', 'Inventory Loss'
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id VARCHAR(36),
    uom VARCHAR(50) NOT NULL DEFAULT 'Units', -- e.g., 'Units', 'kg', 'm', 'pcs'
    min_reorder_level INT DEFAULT 10,
    max_reorder_level INT DEFAULT 500,
    cost_price DECIMAL(10,2) DEFAULT 0.00,
    selling_price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 6. Stock Table (Stock level by Product & Location)
CREATE TABLE IF NOT EXISTS stock (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    location_id VARCHAR(36) NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    UNIQUE(product_id, location_id)
);

-- 7. Receipts Table (Incoming Goods from Vendor)
CREATE TABLE IF NOT EXISTS receipts (
    id VARCHAR(36) PRIMARY KEY,
    reference VARCHAR(100) UNIQUE NOT NULL, -- e.g. REC/2026/0001
    vendor_name VARCHAR(255) NOT NULL,
    destination_location_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft', -- 'Draft', 'Waiting', 'Ready', 'Done', 'Canceled'
    scheduled_date DATE,
    notes TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_location_id) REFERENCES locations(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 8. Receipt Items Table
CREATE TABLE IF NOT EXISTS receipt_items (
    id VARCHAR(36) PRIMARY KEY,
    receipt_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity_demanded DECIMAL(10,2) NOT NULL,
    quantity_received DECIMAL(10,2) DEFAULT 0.00,
    unit_price DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 9. Deliveries Table (Outgoing Goods to Customer)
CREATE TABLE IF NOT EXISTS deliveries (
    id VARCHAR(36) PRIMARY KEY,
    reference VARCHAR(100) UNIQUE NOT NULL, -- e.g. DEL/2026/0001
    customer_name VARCHAR(255) NOT NULL,
    source_location_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft', -- 'Draft', 'Waiting', 'Ready', 'Done', 'Canceled'
    scheduled_date DATE,
    notes TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_location_id) REFERENCES locations(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 10. Delivery Items Table
CREATE TABLE IF NOT EXISTS delivery_items (
    id VARCHAR(36) PRIMARY KEY,
    delivery_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity_demanded DECIMAL(10,2) NOT NULL,
    quantity_delivered DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 11. Transfers Table (Internal Stock Movement)
CREATE TABLE IF NOT EXISTS transfers (
    id VARCHAR(36) PRIMARY KEY,
    reference VARCHAR(100) UNIQUE NOT NULL, -- e.g. INT/2026/0001
    source_location_id VARCHAR(36) NOT NULL,
    destination_location_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft', -- 'Draft', 'Waiting', 'Ready', 'Done', 'Canceled'
    scheduled_date DATE,
    notes TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_location_id) REFERENCES locations(id),
    FOREIGN KEY (destination_location_id) REFERENCES locations(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 12. Transfer Items Table
CREATE TABLE IF NOT EXISTS transfer_items (
    id VARCHAR(36) PRIMARY KEY,
    transfer_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (transfer_id) REFERENCES transfers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 13. Adjustments Table (Stock Reconciliation)
CREATE TABLE IF NOT EXISTS adjustments (
    id VARCHAR(36) PRIMARY KEY,
    reference VARCHAR(100) UNIQUE NOT NULL, -- e.g. ADJ/2026/0001
    product_id VARCHAR(36) NOT NULL,
    location_id VARCHAR(36) NOT NULL,
    recorded_quantity DECIMAL(10,2) NOT NULL,
    counted_quantity DECIMAL(10,2) NOT NULL,
    difference DECIMAL(10,2) NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'Done',
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (location_id) REFERENCES locations(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 14. Stock Ledger Table (Immutable movement audit trail)
CREATE TABLE IF NOT EXISTS stock_ledger (
    id VARCHAR(36) PRIMARY KEY,
    reference VARCHAR(100) NOT NULL,
    movement_type VARCHAR(50) NOT NULL, -- 'Receipt', 'Delivery', 'Internal Transfer', 'Adjustment'
    product_id VARCHAR(36) NOT NULL,
    source_location_id VARCHAR(36),
    destination_location_id VARCHAR(36),
    quantity_changed DECIMAL(10,2) NOT NULL,
    user_id VARCHAR(36),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (source_location_id) REFERENCES locations(id),
    FOREIGN KEY (destination_location_id) REFERENCES locations(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
