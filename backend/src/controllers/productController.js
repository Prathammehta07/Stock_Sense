const Product = require('../models/Product');
const Category = require('../models/Category');

class ProductController {
  static getAll(req, res, next) {
    try {
      const products = Product.getAll();
      const categories = Category.getAll();
      res.json({ success: true, data: products, categories });
    } catch (err) {
      next(err);
    }
  }

  static getById(req, res, next) {
    try {
      const product = Product.findById(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  static create(req, res, next) {
    try {
      const product = Product.create(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  static update(req, res, next) {
    try {
      const updated = Product.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProductController;
