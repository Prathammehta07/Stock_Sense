# StockSense Software Requirements Specification (SRS)

## 1. Introduction
StockSense is a modular Inventory Management System (IMS) designed to digitize and streamline stock operations for enterprise users, replacing manual registers and spreadsheets.

## 2. Target Users & Persona Roles
- **Inventory Managers:** Responsible for approving receipts, managing outgoing deliveries, authorizing stock adjustments, setting reorder levels, and viewing stock valuation reports.
- **Warehouse Staff:** Responsible for picking/packing items, relocating stock between racks (Internal Transfers), logging physical inventory counts, and validating dock receipts.

## 3. Functional Requirements

### 3.1 Authentication & Profile
- User Signup, Login with JWT token management.
- Password recovery via OTP simulation.
- User profile page with role indicator and logout capability.

### 3.2 Dashboard & Reporting
- KPI Cards: Total Products in Stock, Low Stock Count, Pending Receipts, Pending Deliveries, Scheduled Internal Transfers.
- Dynamic Filters: Filter activity by Document Type (`Receipt`, `Delivery`, `Internal`, `Adjustment`), Status (`Draft`, `Waiting`, `Ready`, `Done`, `Canceled`), Warehouse/Location, and Category.
- Low-stock warning banner for items falling below safety threshold.

### 3.3 Product Management
- Full CRUD operations for Products with fields: Name, SKU/Code, Category, Unit of Measure (UoM), Min/Max Reorder levels, Unit Cost, Selling Price.
- Stock availability breakdown grouped by location.

### 3.4 Operations Workflow
- **Receipts (Incoming):** Vendor name, line items, demanded vs received quantities. Clicking "Validate" transitions status to `Done` and automatically increases physical stock in the selected location.
- **Delivery Orders (Outgoing):** Customer name, line items. Pick & Pack stages with "Validate" button to automatically decrease physical stock.
- **Internal Transfers:** Relocate stock from Source Location to Destination Location. Clicking "Validate" updates both location balances and registers ledger entry.
- **Stock Adjustments:** Compare recorded vs counted physical stock. Automatically computes variance and updates stock level upon submit.

### 3.5 Stock Ledger / Move History
- Searchable and filterable double-entry inventory ledger.
- Displays Reference, Document Type, Product, Source Location, Destination Location, Quantity Delta, Timestamp, and User.

### 3.6 Multi-Warehouse & Location Management
- Hierarchy: Warehouse -> Location / Rack / Bin.
- Filter operations by location.

## 4. Non-Functional Requirements
- **Performance:** Response time < 200ms for API calls.
- **Usability:** Responsive, high-contrast dark/light mode dashboard interface with intuitive navigation.
- **Integrity:** Ledger entries are append-only to prevent unauthorized stock tampering.
