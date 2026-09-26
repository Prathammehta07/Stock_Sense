const db = require('../config/database');

class Stock {
  static getAll() {
    return db.stock.map(s => {
      const product = db.products.find(p => p.id === s.product_id);
      const location = db.locations.find(l => l.id === s.location_id);
      return {
        ...s,
        product_name: product ? product.name : 'Unknown Product',
        product_sku: product ? product.sku : 'N/A',
        product_uom: product ? product.uom : 'Units',
        location_name: location ? location.name : 'Unknown Location'
      };
    });
  }

  static getQuantity(productId, locationId) {
    const record = db.stock.find(s => s.product_id === productId && s.location_id === locationId);
    return record ? record.quantity : 0;
  }

  static updateQuantity(productId, locationId, delta) {
    let record = db.stock.find(s => s.product_id === productId && s.location_id === locationId);
    if (record) {
      record.quantity += Number(delta);
    } else {
      record = {
        id: `stk-${Date.now()}`,
        product_id: productId,
        location_id: locationId,
        quantity: Number(delta)
      };
      db.stock.push(record);
    }
    return record;
  }

  static setQuantity(productId, locationId, exactQty) {
    let record = db.stock.find(s => s.product_id === productId && s.location_id === locationId);
    if (record) {
      record.quantity = Number(exactQty);
    } else {
      record = {
        id: `stk-${Date.now()}`,
        product_id: productId,
        location_id: locationId,
        quantity: Number(exactQty)
      };
      db.stock.push(record);
    }
    return record;
  }
}

module.exports = Stock;
