# StockSense API Documentation

Base URL: `/api`

## Authentication Routes (`/api/auth`)
- `POST /api/auth/login`: Authenticates user with `{ email, password }`. Returns `{ token, user }`.
- `POST /api/auth/signup`: Registers a new user with `{ name, email, password, role }`.
- `POST /api/auth/forgot-password`: Generates OTP code for password reset `{ email }`.
- `POST /api/auth/verify-otp`: Verifies OTP code `{ email, otp_code, new_password }`.

## Dashboard Routes (`/api/dashboard`)
- `GET /api/dashboard/stats`: Returns KPI totals (products, low stock, pending receipts, pending deliveries, internal transfers) and recent inventory move logs.

## Product Routes (`/api/products`)
- `GET /api/products`: Returns list of products with location-wise stock quantities.
- `POST /api/products`: Creates a new product `{ sku, name, category_id, uom, min_reorder_level, initial_stock, location_id }`.
- `PUT /api/products/:id`: Updates an existing product details.
- `DELETE /api/products/:id`: Removes a product.

## Operation Routes

### Receipts (`/api/receipts`)
- `GET /api/receipts`: Lists all receipts.
- `POST /api/receipts`: Creates a receipt `{ vendor_name, destination_location_id, items: [{ product_id, quantity_demanded, unit_price }] }`.
- `POST /api/receipts/:id/validate`: Validates receipt, increases destination location stock, logs movement in Stock Ledger.

### Deliveries (`/api/deliveries`)
- `GET /api/deliveries`: Lists all delivery orders.
- `POST /api/deliveries`: Creates a delivery `{ customer_name, source_location_id, items: [{ product_id, quantity_demanded }] }`.
- `POST /api/deliveries/:id/validate`: Validates delivery order, decreases source location stock, logs movement in Stock Ledger.

### Transfers (`/api/transfers`)
- `GET /api/transfers`: Lists all internal transfers.
- `POST /api/transfers`: Creates internal transfer `{ source_location_id, destination_location_id, items: [{ product_id, quantity }] }`.
- `POST /api/transfers/:id/validate`: Executes internal transfer, updates both location stocks, logs movement in Stock Ledger.

### Adjustments (`/api/adjustments`)
- `GET /api/adjustments`: Lists stock count adjustments.
- `POST /api/adjustments`: Submits physical count `{ product_id, location_id, counted_quantity, reason }`. Automatically adjusts stock and logs variance in Stock Ledger.

## Warehouses & Locations (`/api/warehouses`)
- `GET /api/warehouses`: Returns list of warehouses with nested locations.
- `POST /api/warehouses`: Creates a new warehouse.
- `POST /api/warehouses/:id/locations`: Adds a location to a warehouse.

## Move History (`/api/move-history`)
- `GET /api/move-history`: Returns Stock Ledger records with filtering parameters `?product_id=&movement_type=&location_id=`.
