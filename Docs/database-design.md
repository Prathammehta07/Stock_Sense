# StockSense Database Design & Entity Relationship

## Core Architecture Principles

1. **Location-Centric Inventory**
   - Stock is never stored globally on a product record alone; it is tracked per `(product_id, location_id)` pair in the `stock` table.
   - External movement source/destination locations are tracked using special virtual location types (`Vendor`, `Customer`, `Inventory Loss`).

2. **Double-Entry Ledger Accounting**
   - Every physical stock change creates a record in `stock_ledger`.
   - Incoming Receipt: `Vendor Bay` -> `Main Store` (+Qty at Main Store)
   - Outgoing Delivery: `Main Store` -> `Customer Dock` (-Qty at Main Store)
   - Internal Transfer: `Rack A` -> `Rack B` (-Qty at Rack A, +Qty at Rack B)
   - Stock Adjustment: `Main Store` -> `Inventory Loss` (Variance recorded)

## Entity Relationship Overview

```
 [Users] ───────< [Receipts] ───────< [Receipt Items] ──────> [Products]
    │                 │                                          │
    │                 └──> [Locations] <─── [Stock] <────────────┤
    │                         │                                  │
    ├───────────< [Deliveries] ───────< [Delivery Items] ────────┤
    │                         │                                  │
    ├───────────< [Transfers] ────────< [Transfer Items] ────────┤
    │                         │                                  │
    └───────────< [Adjustments] ─────────────────────────────────┤
                              │                                  │
                              └───< [Stock Ledger] ──────────────┘
```
