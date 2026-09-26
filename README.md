# StockSense - Modular Inventory Management System (IMS)

StockSense is an enterprise-grade, modular Inventory Management System designed to digitize and streamline stock-related operations across warehouses and locations. It replaces manual registers, Excel spreadsheets, and fragmented tracking systems with a centralized, real-time, easy-to-use platform.

---

## 🌟 Key Features

1. **Dashboard & Real-time KPIs**
   - Live counters for Total Stock, Low Stock alerts, Pending Receipts, Pending Deliveries, and Scheduled Internal Transfers.
   - Dynamic filters by document type, status, warehouse/location, and product category.

2. **Product Management**
   - Comprehensive product catalog with SKU, Category, Unit of Measure (UoM), initial stock, and reordering rules.
   - Stock availability breakdown by warehouse location (Main Store, Production Floor, Rack A/B, etc.).

3. **Operations Management**
   - **Receipts (Incoming Goods):** Process vendor receipts, add line items, input quantities, and validate to automatically increase stock.
   - **Delivery Orders (Outgoing Goods):** Manage customer shipments through Pick -> Pack -> Validate stages to decrease stock.
   - **Internal Transfers:** Relocate stock between internal locations (e.g., Main Store → Production Rack, Rack A → Rack B) with automated ledger updates.
   - **Inventory Adjustments:** Reconcile physical inventory counts against system records with instant automatic variance adjustments.

4. **Move History & Stock Ledger**
   - Immutable double-entry inventory ledger logging every item movement, timestamp, user, reference document, and source/destination locations.

5. **Multi-Warehouse & Multi-Location Support**
   - Configure multiple warehouses, zones, racks, and shelving bins.

6. **Low Stock Alerts & Smart Filters**
   - Automatic triggers for items below reordering rules.

---

## 📁 Repository Folder Structure

```
stocksense/
├── frontend/             # React SPA (Vite + Modern CSS + React Router + Context API)
│   ├── public/           # Static assets & logos
│   └── src/              # Components, Layouts, Pages, Context, Services, Routes, Utils
├── backend/              # Node.js + Express REST API Backend
│   └── src/              # Controllers, Models, Routes, Middleware, Services, Utils
├── database/             # SQL Schemas and realistic Seed Data
│   ├── schema.sql
│   ├── seed.sql
│   └── README.md
├── docs/                 # Documentation (Requirements, API Docs, DB Design)
├── .gitignore
├── README.md
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository and navigate to root folder
cd stocksense

# Install all dependencies for root, frontend, and backend
npm run install:all
```

### Running Locally

```bash
# Run both Frontend and Backend concurrently
npm run dev

# Or run frontend individually
npm run start:frontend

# Or run backend individually
npm run start:backend
```

---

## 📡 API Endpoints Summary

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/forgot-password` - Trigger OTP for password reset
- `GET /api/dashboard/stats` - Fetch dashboard KPIs and dynamic filter summary
- `GET /api/products` - List all products with stock availability per location
- `POST /api/receipts` - Create & validate incoming vendor receipts
- `POST /api/deliveries` - Process outgoing delivery orders
- `POST /api/transfers` - Execute internal warehouse transfers
- `POST /api/adjustments` - Perform physical inventory stock count adjustments
- `GET /api/move-history` - Query full Stock Ledger move history

---

## 📄 License
MIT License. Built for enterprise inventory management.
