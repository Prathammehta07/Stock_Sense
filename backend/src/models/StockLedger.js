const db = require('../config/database');

class StockLedger {
  static getAll(filters = {}) {
    let logs = db.stock_ledger.map(l => {
      const prod = db.products.find(p => p.id === l.product_id);
      const srcLoc = db.locations.find(loc => loc.id === l.source_location_id);
      const destLoc = db.locations.find(loc => loc.id === l.destination_location_id);
      const user = db.users.find(u => u.id === l.user_id);

      return {
        ...l,
        product_name: prod ? prod.name : 'Unknown Product',
        product_sku: prod ? prod.sku : 'N/A',
        product_uom: prod ? prod.uom : 'Units',
        source_location_name: srcLoc ? srcLoc.name : (l.source_location_id || 'External Supplier'),
        destination_location_name: destLoc ? destLoc.name : (l.destination_location_id || 'Customer / Scrap'),
        user_name: user ? user.name : 'System'
      };
    });

    if (filters.movement_type) {
      logs = logs.filter(l => l.movement_type.toLowerCase() === filters.movement_type.toLowerCase());
    }
    if (filters.product_id) {
      logs = logs.filter(l => l.product_id === filters.product_id);
    }

    // Sort descending by timestamp
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  static addEntry(entry) {
    const newEntry = {
      id: `ldg-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      reference: entry.reference,
      movement_type: entry.movement_type,
      product_id: entry.product_id,
      source_location_id: entry.source_location_id || null,
      destination_location_id: entry.destination_location_id || null,
      quantity_changed: Number(entry.quantity_changed),
      user_id: entry.user_id || 'u-002',
      timestamp: new Date().toISOString(),
      notes: entry.notes || ''
    };
    db.stock_ledger.unshift(newEntry);
    return newEntry;
  }
}

module.exports = StockLedger;
