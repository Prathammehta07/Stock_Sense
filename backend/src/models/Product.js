const db = require('../config/database');

class Product {
  static getAll() {
    return db.products.map(p => {
      const category = db.categories.find(c => c.id === p.category_id);
      const stockList = db.stock.filter(s => s.product_id === p.id);
      const totalStock = stockList.reduce((acc, curr) => acc + curr.quantity, 0);
      const isLowStock = totalStock <= (p.min_reorder_level || 0);

      return {
        ...p,
        category_name: category ? category.name : 'Uncategorized',
        total_stock: totalStock,
        stock_by_location: stockList.map(s => {
          const loc = db.locations.find(l => l.id === s.location_id);
          return {
            location_id: s.location_id,
            location_name: loc ? loc.name : 'Unknown Location',
            quantity: s.quantity
          };
        }),
        is_low_stock: isLowStock
      };
    });
  }

  static findById(id) {
    const products = this.getAll();
    return products.find(p => p.id === id);
  }

  static create(productData) {
    const newProduct = {
      id: `prod-${Date.now()}`,
      sku: productData.sku,
      name: productData.name,
      category_id: productData.category_id || 'cat-001',
      uom: productData.uom || 'Units',
      min_reorder_level: Number(productData.min_reorder_level || 10),
      max_reorder_level: Number(productData.max_reorder_level || 500),
      cost_price: Number(productData.cost_price || 0),
      selling_price: Number(productData.selling_price || 0),
      created_at: new Date().toISOString()
    };
    db.products.push(newProduct);

    if (productData.initial_stock && productData.location_id) {
      db.stock.push({
        id: `stk-${Date.now()}`,
        product_id: newProduct.id,
        location_id: productData.location_id,
        quantity: Number(productData.initial_stock)
      });
    }

    return this.findById(newProduct.id);
  }

  static update(id, updateData) {
    const idx = db.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      db.products[idx] = { ...db.products[idx], ...updateData };
      return this.findById(id);
    }
    return null;
  }
}

module.exports = Product;
