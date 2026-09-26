const db = require('../config/database');
const generateReference = require('../utils/generateReference');

class Delivery {
  static getAll() {
    return db.deliveries.map(d => {
      const srcLoc = db.locations.find(l => l.id === d.source_location_id);
      return {
        ...d,
        source_location_name: srcLoc ? srcLoc.name : 'N/A',
        items: (d.items || []).map(item => {
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
    const deliveries = this.getAll();
    return deliveries.find(d => d.id === id);
  }

  static create(data) {
    const reference = generateReference('DEL', db.deliveries.length);
    const newDelivery = {
      id: `del-${Date.now()}`,
      reference,
      customer_name: data.customer_name,
      source_location_id: data.source_location_id || 'loc-001',
      status: data.status || 'Draft',
      scheduled_date: data.scheduled_date || new Date().toISOString().split('T')[0],
      notes: data.notes || '',
      created_by: data.created_by || 'u-002',
      created_at: new Date().toISOString(),
      items: (data.items || []).map((item, i) => ({
        id: `di-${Date.now()}-${i}`,
        product_id: item.product_id,
        quantity_demanded: Number(item.quantity_demanded),
        quantity_delivered: 0
      }))
    };
    db.deliveries.unshift(newDelivery);
    return this.findById(newDelivery.id);
  }

  static updateStatus(id, newStatus) {
    const del = db.deliveries.find(d => d.id === id);
    if (del) {
      del.status = newStatus;
    }
    return this.findById(id);
  }
}

module.exports = Delivery;
