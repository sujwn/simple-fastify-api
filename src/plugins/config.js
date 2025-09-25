const fp = require('fastify-plugin');
const config = require('../../config');

module.exports = fp(async (fastify) => {
  fastify.decorate('config', config);
});