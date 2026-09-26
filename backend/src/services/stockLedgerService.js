const StockLedger = require('../models/StockLedger');

class StockLedgerService {
  static recordMovement({ reference, movementType, productId, sourceLocationId, destinationLocationId, quantityChanged, userId, notes }) {
    return StockLedger.addEntry({
      reference,
      movement_type: movementType,
      product_id: productId,
      source_location_id: sourceLocationId,
      destination_location_id: destinationLocationId,
      quantity_changed: quantityChanged,
      user_id: userId,
      notes
    });
  }

  static getHistory(filters) {
    return StockLedger.getAll(filters);
  }
}

module.exports = StockLedgerService;
