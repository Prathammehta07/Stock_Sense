const fs = require('fs');
const path = require('path');

// In-Memory Data Store initialized with StockSense default state
class Database {
  constructor() {
    this.users = [
      { id: 'u-001', name: 'Alex Mercer', email: 'admin@stocksense.io', password: 'password123', role: 'Admin' },
      { id: 'u-002', name: 'Sarah Connor', email: 'sarah@stocksense.io', password: 'password123', role: 'Inventory Manager' },
      { id: 'u-003', name: 'John Doe', email: 'john@stocksense.io', password: 'password123', role: 'Warehouse Staff' }
    ];

    this.categories = [
      { id: 'cat-001', name: 'Raw Materials', description: 'Industrial raw materials such as steel, aluminum, and timber' },
      { id: 'cat-002', name: 'Electronics', description: 'Semiconductors, PCBs, displays, and sensory equipment' },
      { id: 'cat-003', name: 'Finished Goods', description: 'Assembled products ready for customer fulfillment' },
      { id: 'cat-004', name: 'Packaging', description: 'Boxes, bubble wrap, pallets, and strapping' }
    ];

    this.warehouses = [
      { id: 'wh-001', code: 'WH-MAIN', name: 'Main Central Store', address: '100 Logistics Blvd, Warehouse City' },
      { id: 'wh-002', code: 'WH-PROD', name: 'Production Floor', address: '102 Industrial Parkway, Tech Zone' },
      { id: 'wh-003', code: 'WH-SOUTH', name: 'Regional Hub South', address: '45 Distribution Way, Harbor City' }
    ];

    this.locations = [
      { id: 'loc-001', warehouse_id: 'wh-001', code: 'WH/MAIN/RACK-A', name: 'Main Store - Rack A', location_type: 'Internal' },
      { id: 'loc-002', warehouse_id: 'wh-001', code: 'WH/MAIN/RACK-B', name: 'Main Store - Rack B', location_type: 'Internal' },
      { id: 'loc-003', warehouse_id: 'wh-002', code: 'WH/PROD/RACK-1', name: 'Production Rack 1', location_type: 'Internal' },
      { id: 'loc-004', warehouse_id: 'wh-003', code: 'WH/SOUTH/BIN-101', name: 'South Hub Bin 101', location_type: 'Internal' },
      { id: 'loc-005', warehouse_id: 'wh-001', code: 'VEND/INPUT', name: 'Vendor Receiving Bay', location_type: 'Vendor' },
      { id: 'loc-006', warehouse_id: 'wh-001', code: 'CUST/OUTPUT', name: 'Customer Shipping Dock', location_type: 'Customer' }
    ];

    this.products = [
      { id: 'prod-001', sku: 'STL-ROD-001', name: 'Steel Rods (10mm)', category_id: 'cat-001', uom: 'kg', min_reorder_level: 25, max_reorder_level: 200, cost_price: 15.50, selling_price: 24.00 },
      { id: 'prod-002', sku: 'WOD-CHR-002', name: 'Wooden Ergonomic Chair', category_id: 'cat-003', uom: 'pcs', min_reorder_level: 10, max_reorder_level: 100, cost_price: 45.00, selling_price: 89.99 },
      { id: 'prod-003', sku: 'PCB-MCU-003', name: 'Microcontroller Board v2', category_id: 'cat-002', uom: 'pcs', min_reorder_level: 50, max_reorder_level: 500, cost_price: 12.00, selling_price: 29.50 },
      { id: 'prod-004', sku: 'ALU-SHT-004', name: 'Aluminum Sheet 2mm', category_id: 'cat-001', uom: 'sqm', min_reorder_level: 15, max_reorder_level: 150, cost_price: 32.00, selling_price: 55.00 },
      { id: 'prod-005', sku: 'BOX-CRG-005', name: 'Heavy Duty Corrugated Box', category_id: 'cat-004', uom: 'pcs', min_reorder_level: 100, max_reorder_level: 1000, cost_price: 1.20, selling_price: 2.80 }
    ];

    this.stock = [
      { id: 'stk-001', product_id: 'prod-001', location_id: 'loc-001', quantity: 150.00 },
      { id: 'stk-002', product_id: 'prod-001', location_id: 'loc-003', quantity: 45.00 },
      { id: 'stk-003', product_id: 'prod-002', location_id: 'loc-001', quantity: 8.00 },
      { id: 'stk-004', product_id: 'prod-003', location_id: 'loc-002', quantity: 320.00 },
      { id: 'stk-005', product_id: 'prod-004', location_id: 'loc-001', quantity: 12.00 },
      { id: 'stk-006', product_id: 'prod-005', location_id: 'loc-004', quantity: 650.00 }
    ];

    this.receipts = [
      { 
        id: 'rec-001', 
        reference: 'REC/2026/0001', 
        vendor_name: 'Apex Steel Supplies', 
        destination_location_id: 'loc-001', 
        status: 'Done', 
        scheduled_date: '2026-09-20', 
        notes: 'Batch #992 received cleanly', 
        created_by: 'u-002',
        created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
        items: [{ id: 'ri-001', product_id: 'prod-001', quantity_demanded: 100, quantity_received: 100, unit_price: 15.50 }]
      },
      { 
        id: 'rec-002', 
        reference: 'REC/2026/0002', 
        vendor_name: 'Nordic Timber & Crafts', 
        destination_location_id: 'loc-001', 
        status: 'Ready', 
        scheduled_date: '2026-09-27', 
        notes: 'Awaiting unloader', 
        created_by: 'u-002',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        items: [{ id: 'ri-002', product_id: 'prod-002', quantity_demanded: 50, quantity_received: 0, unit_price: 45.00 }]
      },
      { 
        id: 'rec-003', 
        reference: 'REC/2026/0003', 
        vendor_name: 'Silicon Semi Components', 
        destination_location_id: 'loc-002', 
        status: 'Draft', 
        scheduled_date: '2026-09-30', 
        notes: 'PO #4088 draft', 
        created_by: 'u-001',
        created_at: new Date().toISOString(),
        items: [{ id: 'ri-003', product_id: 'prod-003', quantity_demanded: 200, quantity_received: 0, unit_price: 12.00 }]
      }
    ];

    this.deliveries = [
      {
        id: 'del-001',
        reference: 'DEL/2026/0001',
        customer_name: 'Global Logistics Ltd',
        source_location_id: 'loc-001',
        status: 'Done',
        scheduled_date: '2026-09-22',
        notes: 'Shipped via Express Freight',
        created_by: 'u-002',
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        items: [{ id: 'di-001', product_id: 'prod-002', quantity_demanded: 10, quantity_delivered: 10 }]
      },
      {
        id: 'del-002',
        reference: 'DEL/2026/0002',
        customer_name: 'TechCorp Enterprises',
        source_location_id: 'loc-002',
        status: 'Waiting',
        scheduled_date: '2026-09-28',
        notes: 'Packing in progress',
        created_by: 'u-003',
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        items: [{ id: 'di-002', product_id: 'prod-003', quantity_demanded: 50, quantity_delivered: 0 }]
      }
    ];

    this.transfers = [
      {
        id: 'trf-001',
        reference: 'INT/2026/0001',
        source_location_id: 'loc-001',
        destination_location_id: 'loc-003',
        status: 'Done',
        scheduled_date: '2026-09-24',
        notes: 'Moved raw steel to production rack',
        created_by: 'u-003',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        items: [{ id: 'ti-001', product_id: 'prod-001', quantity: 45 }]
      },
      {
        id: 'trf-002',
        reference: 'INT/2026/0002',
        source_location_id: 'loc-001',
        destination_location_id: 'loc-002',
        status: 'Ready',
        scheduled_date: '2026-09-29',
        notes: 'Rebalancing stock Rack A to B',
        created_by: 'u-002',
        created_at: new Date().toISOString(),
        items: [{ id: 'ti-002', product_id: 'prod-004', quantity: 10 }]
      }
    ];

    this.adjustments = [
      {
        id: 'adj-001',
        reference: 'ADJ/2026/0001',
        product_id: 'prod-001',
        location_id: 'loc-001',
        recorded_quantity: 153.00,
        counted_quantity: 150.00,
        difference: -3.00,
        reason: 'Damaged steel bars scrapped during audit',
        status: 'Done',
        created_by: 'u-002',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString()
      }
    ];

    this.stock_ledger = [
      {
        id: 'ldg-001',
        reference: 'REC/2026/0001',
        movement_type: 'Receipt',
        product_id: 'prod-001',
        source_location_id: 'loc-005',
        destination_location_id: 'loc-001',
        quantity_changed: 100.00,
        user_id: 'u-002',
        timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
        notes: 'Received 100kg Steel Rods from Apex Steel'
      },
      {
        id: 'ldg-002',
        reference: 'INT/2026/0001',
        movement_type: 'Internal Transfer',
        product_id: 'prod-001',
        source_location_id: 'loc-001',
        destination_location_id: 'loc-003',
        quantity_changed: 45.00,
        user_id: 'u-003',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        notes: 'Transferred 45kg Steel Rods to Production Rack 1'
      },
      {
        id: 'ldg-003',
        reference: 'DEL/2026/0001',
        movement_type: 'Delivery',
        product_id: 'prod-002',
        source_location_id: 'loc-001',
        destination_location_id: 'loc-006',
        quantity_changed: 10.00,
        user_id: 'u-002',
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
        notes: 'Delivered 10 Wooden Ergonomic Chairs to Global Logistics'
      },
      {
        id: 'ldg-004',
        reference: 'ADJ/2026/0001',
        movement_type: 'Adjustment',
        product_id: 'prod-001',
        source_location_id: 'loc-001',
        destination_location_id: 'loc-001',
        quantity_changed: -3.00,
        user_id: 'u-002',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        notes: 'Adjusted -3kg Steel Rods (damaged items)'
      }
    ];
  }
}

const db = new Database();
module.exports = db;
