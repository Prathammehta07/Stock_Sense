# StockSense Database Documentation

This folder contains the complete SQL database schema (`schema.sql`) and sample seed data (`seed.sql`) for StockSense.

---

## 🗄️ Database Architecture

StockSense utilizes a relational model designed around double-entry inventory principles:

1. **`users`**: System users, authentication credentials, and access roles (`Admin`, `Inventory Manager`, `Warehouse Staff`).
2. **`categories`**: Classification for inventory items (e.g. Raw Materials, Electronics, Finished Goods).
3. **`warehouses` & `locations`**: Two-tiered location model supporting warehouses and physical sub-locations (Racks, Bins, Docks, Vendor bays).
4. **`products`**: Item details including SKU, UoM, reordering min/max levels, unit cost, and selling price.
5. **`stock`**: Real-time snapshot of product quantities at specific physical locations.
6. **`receipts` & `receipt_items`**: Incoming goods workflows from vendors.
7. **`deliveries` & `delivery_items`**: Outgoing customer shipping operations.
8. **`transfers` & `transfer_items`**: Relocation of stock across internal locations.
9. **`adjustments`**: Reconciliation records between recorded stock and physical counts.
10. **`stock_ledger`**: Immutable audit trail logging every stock increment/decrement.

---

## 🛠️ How to Import into PostgreSQL / MySQL / SQLite

### SQLite:
```bash
sqlite3 stocksense.db < schema.sql
sqlite3 stocksense.db < seed.sql
```

### PostgreSQL:
```bash
psql -U postgres -d stocksense -f schema.sql
psql -U postgres -d stocksense -f seed.sql
```

### MySQL:
```bash
mysql -u root -p stocksense < schema.sql
mysql -u root -p stocksense < seed.sql
```
