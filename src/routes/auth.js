const AuthRepository = require('../repositories/auth.repository');
const ProfileRepository = require('../repositories/profile.repository');
const AuthService = new (require('../services/auth.service'))(AuthRepository, ProfileRepository);

module.exports = async (fastify) => {
  fastify.post('/auth/register', async (req) => {
    return AuthService.register(fastify, req.body, req);
  });

  fastify.post('/auth/login', async (req) => {
    return AuthService.login(fastify, req.body, req);
  });

  fastify.post('/auth/refresh', async (req) => {
    return AuthService.refresh(fastify, req.body.refreshToken, req);
  });
};
