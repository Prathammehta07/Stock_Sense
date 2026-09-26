const db = require('../config/database');

class Warehouse {
  static getAll() {
    return db.warehouses.map(wh => {
      const locations = db.locations.filter(l => l.warehouse_id === wh.id);
      return {
        ...wh,
        locations
      };
    });
  }

  static findById(id) {
    const whs = this.getAll();
    return whs.find(w => w.id === id);
  }

  static create(whData) {
    const newWh = {
      id: `wh-${Date.now()}`,
      code: whData.code,
      name: whData.name,
      address: whData.address || ''
    };
    db.warehouses.push(newWh);
    return newWh;
  }
}

module.exports = Warehouse;
