module.exports = async (fastify) => {
  fastify.get('/', async (req) => {
    fastify.logger.info(`GET / success`);
    return {
      message: 'Success'
    }
  });
};
