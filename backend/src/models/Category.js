const db = require('../config/database');

class Category {
  static getAll() {
    return db.categories;
  }

  static findById(id) {
    return db.categories.find(c => c.id === id);
  }

  static create(catData) {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: catData.name,
      description: catData.description || ''
    };
    db.categories.push(newCat);
    return newCat;
  }
}

module.exports = Category;
