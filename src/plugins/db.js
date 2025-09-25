const fp = require('fastify-plugin');
const { MongoClient } = require('mongodb');

module.exports = fp(async (fastify) => {
  const uri = fastify.config.db.uri;
  const client = new MongoClient(uri);

  const maxRetries = 5;
  const retryDelay = 3000; // ms

  let attempts = 0;
  let connected = false;

  while (!connected && attempts < maxRetries) {
    try {
      attempts++;
      fastify.log.info(`Connecting to MongoDB (${attempts}/${maxRetries})...`);
      await client.connect();

      connected = true;
      fastify.log.info(`MongoDB connected: ${uri}`);

      const db = client.db();
      fastify.decorate('mongo', { client, db });
    } catch (err) {
      fastify.log.error({ err }, `Failed to connect to MongoDB (${attempts})`);
      if (attempts < maxRetries) {
        await new Promise((res) => setTimeout(res, retryDelay));
      } else {
        throw err; // fail after max retries
      }
    }
  }

  // Graceful shutdown
  fastify.addHook('onClose', async () => {
    fastify.log.info('🔌 Closing MongoDB connection');
    await client.close();
  });
});
