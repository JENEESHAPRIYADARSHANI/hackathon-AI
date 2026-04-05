require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('express-async-errors');
const expressWs = require('express-ws');
const logger = require('./utils/logger');

logger.info('🚀 Starting Smart Service Request Platform Backend');

// Environment validation
logger.info('🔧 Environment Configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI ? 'Configured' : 'Missing',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Configured' : 'Missing',
  FRONTEND_URL: process.env.FRONTEND_URL
});

const app = express();
expressWs(app);

// Middleware
logger.info('🔧 Setting up middleware...');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

logger.info('📡 Setting up routes...');
// Routes
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  logger.debug('🏥 Health check requested');
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('❌ Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// MongoDB Connection
logger.info('🗄️ Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-service-platform')
  .then(() => {
    logger.info('✅ MongoDB connected successfully');
  })
  .catch(err => {
    logger.warn('⚠️ MongoDB connection warning:', err.message);
    logger.warn('⚠️ Running in limited mode without database persistence');
    logger.warn('⚠️ Please install MongoDB or update MONGODB_URI for full functionality');
    // Don't exit, allow graceful degradation
  });

const PORT = process.env.PORT || 5000;
logger.info(`🌐 Starting server on port ${PORT}...`);

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📡 API endpoints available at http://localhost:${PORT}/api`);
  logger.info(`🏥 Health check at http://localhost:${PORT}/api/health`);
});

// Handle server errors
server.on('error', (err) => {
  logger.error('❌ Server error:', err);
  process.exit(1);
});

// Handle unhandled exceptions
process.on('unhandledRejection', (err) => {
  logger.error('❌ Unhandled rejection:', err);
});

process.on('uncaughtException', (err) => {
  logger.error('❌ Uncaught exception:', err);
  process.exit(1);
});
