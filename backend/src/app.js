const express = require('express');
const cors = require('cors');

const authMiddleware = require('./middleware/authMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const productRoutes = require('./routes/productRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const transferRoutes = require('./routes/transferRoutes');
const adjustmentRoutes = require('./routes/adjustmentRoutes');
const stockRoutes = require('./routes/stockRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const moveHistoryRoutes = require('./routes/moveHistoryRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Public Auth routes
app.use('/api/auth', authRoutes);

// Protected routes (uses authMiddleware)
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/receipts', authMiddleware, receiptRoutes);
app.use('/api/deliveries', authMiddleware, deliveryRoutes);
app.use('/api/transfers', authMiddleware, transferRoutes);
app.use('/api/adjustments', authMiddleware, adjustmentRoutes);
app.use('/api/stock', authMiddleware, stockRoutes);
app.use('/api/warehouses', authMiddleware, warehouseRoutes);
app.use('/api/move-history', authMiddleware, moveHistoryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'StockSense API operational' });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
