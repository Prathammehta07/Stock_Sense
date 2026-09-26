-- StockSense Seed Data

-- 1. Users
INSERT INTO users (id, name, email, password_hash, role) VALUES
('u-001', 'Alex Mercer', 'admin@stocksense.io', '$2b$10$hashedpassword123', 'Admin'),
('u-002', 'Sarah Connor', 'sarah@stocksense.io', '$2b$10$hashedpassword123', 'Inventory Manager'),
('u-003', 'John Doe', 'john@stocksense.io', '$2b$10$hashedpassword123', 'Warehouse Staff');

-- 2. Categories
INSERT INTO categories (id, name, description) VALUES
('cat-001', 'Raw Materials', 'Industrial raw materials such as steel, aluminum, and timber'),
('cat-002', 'Electronics', 'Semiconductors, PCBs, displays, and sensory equipment'),
('cat-003', 'Finished Goods', 'Assembled products ready for customer fulfillment'),
('cat-004', 'Packaging', 'Boxes, bubble wrap, pallets, and strapping');

-- 3. Warehouses
INSERT INTO warehouses (id, code, name, address) VALUES
('wh-001', 'WH-MAIN', 'Main Central Store', '100 Logistics Blvd, Warehouse City'),
('wh-002', 'WH-PROD', 'Production Floor', '102 Industrial Parkway, Tech Zone'),
('wh-003', 'WH-SOUTH', 'Regional Hub South', '45 Distribution Way, Harbor City');

-- 4. Locations
INSERT INTO locations (id, warehouse_id, code, name, location_type) VALUES
('loc-001', 'wh-001', 'WH/MAIN/RACK-A', 'Main Store - Rack A', 'Internal'),
('loc-002', 'wh-001', 'WH/MAIN/RACK-B', 'Main Store - Rack B', 'Internal'),
('loc-003', 'wh-002', 'WH/PROD/RACK-1', 'Production Rack 1', 'Internal'),
('loc-004', 'wh-003', 'WH/SOUTH/BIN-101', 'South Hub Bin 101', 'Internal'),
('loc-005', 'wh-001', 'VEND/INPUT', 'Vendor Receiving Bay', 'Vendor'),
('loc-006', 'wh-001', 'CUST/OUTPUT', 'Customer Shipping Dock', 'Customer');

-- 5. Products
INSERT INTO products (id, sku, name, category_id, uom, min_reorder_level, max_reorder_level, cost_price, selling_price) VALUES
('prod-001', 'STL-ROD-001', 'Steel Rods (10mm)', 'cat-001', 'kg', 25, 200, 15.50, 24.00),
('prod-002', 'WOD-CHR-002', 'Wooden Ergonomic Chair', 'cat-003', 'pcs', 10, 100, 45.00, 89.99),
('prod-003', 'PCB-MCU-003', 'Microcontroller Board v2', 'cat-002', 'pcs', 50, 500, 12.00, 29.50),
('prod-004', 'ALU-SHT-004', 'Aluminum Sheet 2mm', 'cat-001', 'sqm', 15, 150, 32.00, 55.00),
('prod-005', 'BOX-CRG-005', 'Heavy Duty Corrugated Box', 'cat-004', 'pcs', 100, 1000, 1.20, 2.80);

-- 6. Initial Stock Levels
INSERT INTO stock (id, product_id, location_id, quantity) VALUES
('stk-001', 'prod-001', 'loc-001', 150.00),
('stk-002', 'prod-001', 'loc-003', 45.00),
('stk-003', 'prod-002', 'loc-001', 8.00), -- Low Stock Alert! (< 10)
('stk-004', 'prod-003', 'loc-002', 320.00),
('stk-005', 'prod-004', 'loc-001', 12.00), -- Low Stock Alert! (< 15)
('stk-006', 'prod-005', 'loc-004', 650.00);

-- 7. Receipts (Incoming Goods)
INSERT INTO receipts (id, reference, vendor_name, destination_location_id, status, scheduled_date, notes, created_by) VALUES
('rec-001', 'REC/2026/0001', 'Apex Steel Supplies', 'loc-001', 'Done', '2026-09-20', 'Batch #992 received cleanly', 'u-002'),
('rec-002', 'REC/2026/0002', 'Nordic Timber & Crafts', 'loc-001', 'Ready', '2026-09-27', 'Awaiting truck dock unloader', 'u-002'),
('rec-003', 'REC/2026/0003', 'Silicon Semi Components', 'loc-002', 'Draft', '2026-09-30', 'PO #4088 purchase order draft', 'u-001');

INSERT INTO receipt_items (id, receipt_id, product_id, quantity_demanded, quantity_received, unit_price) VALUES
('ri-001', 'rec-001', 'prod-001', 100.00, 100.00, 15.50),
('ri-002', 'rec-002', 'prod-002', 50.00, 0.00, 45.00),
('ri-003', 'rec-003', 'prod-003', 200.00, 0.00, 12.00);

-- 8. Deliveries (Outgoing Goods)
INSERT INTO deliveries (id, reference, customer_name, source_location_id, status, scheduled_date, notes, created_by) VALUES
('del-001', 'DEL/2026/0001', 'Global Logistics Ltd', 'loc-001', 'Done', '2026-09-22', 'Shipped via Express Freight', 'u-002'),
('del-002', 'DEL/2026/0002', 'TechCorp Enterprises', 'loc-002', 'Waiting', '2026-09-28', 'Packing in progress', 'u-003');

INSERT INTO delivery_items (id, delivery_id, product_id, quantity_demanded, quantity_delivered) VALUES
('di-001', 'del-001', 'prod-002', 10.00, 10.00),
('di-002', 'del-002', 'prod-003', 50.00, 0.00);

-- 9. Internal Transfers
INSERT INTO transfers (id, reference, source_location_id, destination_location_id, status, scheduled_date, notes, created_by) VALUES
('trf-001', 'INT/2026/0001', 'loc-001', 'loc-003', 'Done', '2026-09-24', 'Moved raw steel to production rack', 'u-003'),
('trf-002', 'INT/2026/0002', 'loc-001', 'loc-002', 'Ready', '2026-09-29', 'Rebalancing stock between Rack A and B', 'u-002');

INSERT INTO transfer_items (id, transfer_id, product_id, quantity) VALUES
('ti-001', 'trf-001', 'prod-001', 45.00),
('ti-002', 'trf-002', 'prod-004', 10.00);

-- 10. Stock Adjustments
INSERT INTO adjustments (id, reference, product_id, location_id, recorded_quantity, counted_quantity, difference, reason, status, created_by) VALUES
('adj-001', 'ADJ/2026/0001', 'prod-001', 'loc-001', 153.00, 150.00, -3.00, 'Damaged steel bars scrapped during audit', 'Done', 'u-002');

-- 11. Stock Ledger (Initial history records)
INSERT INTO stock_ledger (id, reference, movement_type, product_id, source_location_id, destination_location_id, quantity_changed, user_id, notes) VALUES
('ldg-001', 'REC/2026/0001', 'Receipt', 'prod-001', 'loc-005', 'loc-001', 100.00, 'u-002', 'Received 100kg Steel Rods from Apex Steel'),
('ldg-002', 'INT/2026/0001', 'Internal Transfer', 'prod-001', 'loc-001', 'loc-003', 45.00, 'u-003', 'Transferred 45kg Steel Rods to Production Rack 1'),
('ldg-003', 'DEL/2026/0001', 'Delivery', 'prod-002', 'loc-001', 'loc-006', 10.00, 'u-002', 'Delivered 10 Wooden Ergonomic Chairs to Global Logistics'),
('ldg-004', 'ADJ/2026/0001', 'Adjustment', 'prod-001', 'loc-001', 'loc-001', -3.00, 'u-002', 'Adjusted -3kg Steel Rods (damaged items)');
