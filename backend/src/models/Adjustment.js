const db = require('../config/database');
const generateReference = require('../utils/generateReference');

class Adjustment {
  static getAll() {
    return db.adjustments.map(a => {
      const prod = db.products.find(p => p.id === a.product_id);
      const loc = db.locations.find(l => l.id === a.location_id);
      return {
        ...a,
        product_name: prod ? prod.name : 'Unknown Product',
        product_sku: prod ? prod.sku : 'N/A',
        location_name: loc ? loc.name : 'Unknown Location'
      };
    });
  }

  static findById(id) {
    const list = this.getAll();
    return list.find(a => a.id === id);
  }

  static create(data) {
    const reference = generateReference('ADJ', db.adjustments.length);
    const recordedQty = Number(data.recorded_quantity || 0);
    const countedQty = Number(data.counted_quantity || 0);
    const diff = countedQty - recordedQty;

    const newAdj = {
      id: `adj-${Date.now()}`,
      reference,
      product_id: data.product_id,
      location_id: data.location_id,
      recorded_quantity: recordedQty,
      counted_quantity: countedQty,
      difference: diff,
      reason: data.reason || 'Inventory count reconciliation',
      status: 'Done',
      created_by: data.created_by || 'u-002',
      created_at: new Date().toISOString()
    };
    db.adjustments.unshift(newAdj);
    return this.findById(newAdj.id);
  }
}

module.exports = Adjustment;
