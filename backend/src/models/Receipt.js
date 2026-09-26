const db = require('../config/database');
const generateReference = require('../utils/generateReference');

class Receipt {
  static getAll() {
    return db.receipts.map(r => {
      const destLoc = db.locations.find(l => l.id === r.destination_location_id);
      return {
        ...r,
        destination_location_name: destLoc ? destLoc.name : 'N/A',
        items: (r.items || []).map(item => {
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
    const receipts = this.getAll();
    return receipts.find(r => r.id === id);
  }

  static create(data) {
    const reference = generateReference('REC', db.receipts.length);
    const newReceipt = {
      id: `rec-${Date.now()}`,
      reference,
      vendor_name: data.vendor_name,
      destination_location_id: data.destination_location_id || 'loc-001',
      status: data.status || 'Draft',
      scheduled_date: data.scheduled_date || new Date().toISOString().split('T')[0],
      notes: data.notes || '',
      created_by: data.created_by || 'u-002',
      created_at: new Date().toISOString(),
      items: (data.items || []).map((item, i) => ({
        id: `ri-${Date.now()}-${i}`,
        product_id: item.product_id,
        quantity_demanded: Number(item.quantity_demanded),
        quantity_received: 0,
        unit_price: Number(item.unit_price || 0)
      }))
    };
    db.receipts.unshift(newReceipt);
    return this.findById(newReceipt.id);
  }

  static updateStatus(id, newStatus) {
    const rec = db.receipts.find(r => r.id === id);
    if (rec) {
      rec.status = newStatus;
    }
    return this.findById(id);
  }
}

module.exports = Receipt;
