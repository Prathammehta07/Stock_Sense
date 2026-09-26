const Product = require('../models/Product');

class NotificationService {
  static getAlerts() {
    const products = Product.getAll();
    const lowStock = products.filter(p => p.is_low_stock);
    
    return lowStock.map(p => ({
      id: `alert-${p.id}`,
      type: 'WARNING',
      title: 'Low Stock Alert',
      message: `${p.name} (${p.sku}) is below minimum reorder level! Current total: ${p.total_stock} ${p.uom}, Threshold: ${p.min_reorder_level} ${p.uom}`,
      timestamp: new Date().toISOString(),
      product_id: p.id
    }));
  }
}

module.exports = NotificationService;
