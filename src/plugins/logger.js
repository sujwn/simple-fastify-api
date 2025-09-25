const fp = require('fastify-plugin');
const pino = require('pino');

module.exports = fp(async (fastify) => {
  const isProd = fastify.config.nodeEnv === 'production';

  const logger = pino({
    level: fastify.config.log.level || 'info',
    transport: !isProd
      ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      } : undefined
  });

  fastify.decorate('logger', logger);
});