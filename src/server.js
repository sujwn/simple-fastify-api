const fastify = require('fastify')({ logger: true });

fastify.register(require('./plugins/config'));
fastify.register(require('./plugins/logger'));
fastify.register(require('./plugins/db'));
fastify.register(require('./plugins/auth'));
fastify.register(require('./plugins/autoload'));

fastify.setErrorHandler((error, req, reply) => {
  req.log.error(error);

  const statusCode = error.status || error.statusCode || 500;
  reply.status(statusCode).send({
    error: error.message || 'Something went wrong'
  });
});

const start = async () => {
  try {
    await fastify.ready();
    await fastify.listen({ port: fastify.config.port, host: '0.0.0.0' });
  } catch (error) {
    fastify.logger.error(error);
    process.exit(1);
  }
};

start();