const app = require('./app');
const env = require('./config/environment');
const logger = require('./utils/logger');

const PORT = env.port;

app.listen(PORT, () => {
  logger.info(`⚡ StockSense Backend Server running on port ${PORT}`);
  logger.info(`Environment: ${env.nodeEnv}`);
});
