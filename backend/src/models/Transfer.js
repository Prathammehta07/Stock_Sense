const db = require('../config/database');
const generateReference = require('../utils/generateReference');

class Transfer {
  static getAll() {
    return db.transfers.map(t => {
      const srcLoc = db.locations.find(l => l.id === t.source_location_id);
      const destLoc = db.locations.find(l => l.id === t.destination_location_id);
      return {
        ...t,
        source_location_name: srcLoc ? srcLoc.name : 'N/A',
        destination_location_name: destLoc ? destLoc.name : 'N/A',
        items: (t.items || []).map(item => {
          const prod = db.products.find(p => p.id === item.product_id);
          return {
            ...item,
            product_name: prod ? prod.name : 'Unknown Product',
            product_sku: prod ? prod.sku : 'N/A'
          };
        })
      };
    });
  }

  static findById(id) {
    const transfers = this.getAll();
    return transfers.find(t => t.id === id);
  }

  static create(data) {
    const reference = generateReference('INT', db.transfers.length);
    const newTransfer = {
      id: `trf-${Date.now()}`,
      reference,
      source_location_id: data.source_location_id,
      destination_location_id: data.destination_location_id,
      status: data.status || 'Draft',
      scheduled_date: data.scheduled_date || new Date().toISOString().split('T')[0],
      notes: data.notes || '',
      created_by: data.created_by || 'u-003',
      created_at: new Date().toISOString(),
      items: (data.items || []).map((item, i) => ({
        id: `ti-${Date.now()}-${i}`,
        product_id: item.product_id,
        quantity: Number(item.quantity)
      }))
    };
    db.transfers.unshift(newTransfer);
    return this.findById(newTransfer.id);
  }

  static updateStatus(id, newStatus) {
    const trf = db.transfers.find(t => t.id === id);
    if (trf) {
      trf.status = newStatus;
    }
    return this.findById(id);
  }
}

module.exports = Transfer;
