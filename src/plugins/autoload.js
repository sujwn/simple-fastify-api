const fp = require('fastify-plugin');
const path = require('path');
const AutoLoad = require('fastify-autoload');

module.exports = fp(async (fastify) => {
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, '../routes')
  })
});