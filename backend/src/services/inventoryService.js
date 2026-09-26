const Product = require('../models/Product');
const Stock = require('../models/Stock');
const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');
const Transfer = require('../models/Transfer');
const Adjustment = require('../models/Adjustment');
const StockLedgerService = require('./stockLedgerService');

class InventoryService {
  static getDashboardStats() {
    const products = Product.getAll();
    const receipts = Receipt.getAll();
    const deliveries = Delivery.getAll();
    const transfers = Transfer.getAll();
    const adjustments = Adjustment.getAll();
    const ledger = StockLedgerService.getHistory();

    const lowStockItems = products.filter(p => p.is_low_stock);
    const pendingReceipts = receipts.filter(r => r.status === 'Draft' || r.status === 'Waiting' || r.status === 'Ready');
    const pendingDeliveries = deliveries.filter(d => d.status === 'Draft' || d.status === 'Waiting' || d.status === 'Ready');
    const scheduledTransfers = transfers.filter(t => t.status === 'Draft' || t.status === 'Waiting' || t.status === 'Ready');

    return {
      kpis: {
        total_products: products.length,
        low_stock_count: lowStockItems.length,
        pending_receipts_count: pendingReceipts.length,
        pending_deliveries_count: pendingDeliveries.length,
        scheduled_transfers_count: scheduledTransfers.length
      },
      low_stock_items: lowStockItems,
      recent_movements: ledger.slice(0, 10),
      summary_by_status: {
        receipts: {
          draft: receipts.filter(r => r.status === 'Draft').length,
          waiting: receipts.filter(r => r.status === 'Waiting').length,
          ready: receipts.filter(r => r.status === 'Ready').length,
          done: receipts.filter(r => r.status === 'Done').length,
          canceled: receipts.filter(r => r.status === 'Canceled').length
        },
        deliveries: {
          draft: deliveries.filter(d => d.status === 'Draft').length,
          waiting: deliveries.filter(d => d.status === 'Waiting').length,
          ready: deliveries.filter(d => d.status === 'Ready').length,
          done: deliveries.filter(d => d.status === 'Done').length,
          canceled: deliveries.filter(d => d.status === 'Canceled').length
        }
      }
    };
  }

  static validateReceipt(receiptId, userId) {
    const receipt = Receipt.findById(receiptId);
    if (!receipt) throw new Error('Receipt not found');
    if (receipt.status === 'Done') throw new Error('Receipt is already validated and completed');

    receipt.items.forEach(item => {
      // Increase destination location stock
      Stock.updateQuantity(item.product_id, receipt.destination_location_id, item.quantity_demanded);
      
      // Update item quantity received
      item.quantity_received = item.quantity_demanded;

      // Log movement in Stock Ledger
      StockLedgerService.recordMovement({
        reference: receipt.reference,
        movementType: 'Receipt',
        productId: item.product_id,
        sourceLocationId: 'loc-005', // Vendor receiving bay
        destinationLocationId: receipt.destination_location_id,
        quantityChanged: item.quantity_demanded,
        userId: userId || receipt.created_by,
        notes: `Received ${item.quantity_demanded} units from vendor ${receipt.vendor_name}`
      });
    });

    return Receipt.updateStatus(receiptId, 'Done');
  }

  static validateDelivery(deliveryId, userId) {
    const delivery = Delivery.findById(deliveryId);
    if (!delivery) throw new Error('Delivery order not found');
    if (delivery.status === 'Done') throw new Error('Delivery order is already completed');

    // Verify sufficient stock first
    delivery.items.forEach(item => {
      const currentQty = Stock.getQuantity(item.product_id, delivery.source_location_id);
      if (currentQty < item.quantity_demanded) {
        throw new Error(`Insufficient stock for product ID ${item.product_id} at source location. Available: ${currentQty}, Demanded: ${item.quantity_demanded}`);
      }
    });

    delivery.items.forEach(item => {
      // Decrease source location stock
      Stock.updateQuantity(item.product_id, delivery.source_location_id, -item.quantity_demanded);

      item.quantity_delivered = item.quantity_demanded;

      // Log movement in Stock Ledger
      StockLedgerService.recordMovement({
        reference: delivery.reference,
        movementType: 'Delivery',
        productId: item.product_id,
        sourceLocationId: delivery.source_location_id,
        destinationLocationId: 'loc-006', // Customer shipping dock
        quantityChanged: item.quantity_demanded,
        userId: userId || delivery.created_by,
        notes: `Delivered ${item.quantity_demanded} units to customer ${delivery.customer_name}`
      });
    });

    return Delivery.updateStatus(deliveryId, 'Done');
  }

  static validateTransfer(transferId, userId) {
    const transfer = Transfer.findById(transferId);
    if (!transfer) throw new Error('Transfer order not found');
    if (transfer.status === 'Done') throw new Error('Transfer is already completed');

    transfer.items.forEach(item => {
      // Move stock: decrease source, increase destination
      Stock.updateQuantity(item.product_id, transfer.source_location_id, -item.quantity);
      Stock.updateQuantity(item.product_id, transfer.destination_location_id, item.quantity);

      // Log movement in Stock Ledger
      StockLedgerService.recordMovement({
        reference: transfer.reference,
        movementType: 'Internal Transfer',
        productId: item.product_id,
        sourceLocationId: transfer.source_location_id,
        destinationLocationId: transfer.destination_location_id,
        quantityChanged: item.quantity,
        userId: userId || transfer.created_by,
        notes: `Transferred ${item.quantity} units between locations`
      });
    });

    return Transfer.updateStatus(transferId, 'Done');
  }

  static submitAdjustment(adjData, userId) {
    const currentQty = Stock.getQuantity(adjData.product_id, adjData.location_id);
    const adjustment = Adjustment.create({
      ...adjData,
      recorded_quantity: currentQty,
      created_by: userId
    });

    // Update stock level to exact counted quantity
    Stock.setQuantity(adjData.product_id, adjData.location_id, adjData.counted_quantity);

    // Log variance in Stock Ledger
    StockLedgerService.recordMovement({
      reference: adjustment.reference,
      movementType: 'Adjustment',
      productId: adjData.product_id,
      sourceLocationId: adjData.location_id,
      destinationLocationId: adjData.location_id,
      quantityChanged: adjustment.difference,
      userId: userId,
      notes: `Stock count adjustment: ${adjustment.difference > 0 ? '+' : ''}${adjustment.difference}. Reason: ${adjData.reason || 'Audit'}`
    });

    return adjustment;
  }
}

module.exports = InventoryService;
