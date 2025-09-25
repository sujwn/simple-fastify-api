const fp = require('fastify-plugin');

module.exports = fp(async (fastify) => {
  // Basic JWT authentication
  fastify.decorate('authenticate', async function (req, reply) {
    try {
      await req.jwtVerify(); // populates req.user
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  // Example role check: Admin only
  fastify.decorate('isAdmin', async function (req, reply) {
    try {
      await req.jwtVerify();
      if (req.user.role !== 'admin') {
        reply.code(403).send({ error: 'Forbidden: Admins only' });
      }
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  // Example: optional authentication (e.g., public route but with user context if token exists)
  fastify.decorate('optionalAuth', async function (req) {
    try {
      await req.jwtVerify();
    } catch {
      req.user = null; // token missing/invalid → no user
    }
  });
});
