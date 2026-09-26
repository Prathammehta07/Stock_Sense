const db = require('../config/database');

class Location {
  static getAll() {
    return db.locations.map(loc => {
      const warehouse = db.warehouses.find(w => w.id === loc.warehouse_id);
      return {
        ...loc,
        warehouse_name: warehouse ? warehouse.name : 'N/A'
      };
    });
  }

  static findById(id) {
    return db.locations.find(l => l.id === id);
  }

  static create(locData) {
    const newLoc = {
      id: `loc-${Date.now()}`,
      warehouse_id: locData.warehouse_id,
      code: locData.code,
      name: locData.name,
      location_type: locData.location_type || 'Internal'
    };
    db.locations.push(newLoc);
    return newLoc;
  }
}

module.exports = Location;
