const ProfileRepository = require('../repositories/profile.repository');
const ProfileService = new (require('../services/profile.service'))(ProfileRepository);

module.exports = async (fastify) => {
  fastify.get('/profile/me', { preHandler: [fastify.authenticate] }, async (req) => {
    return ProfileService.getMyProfile(fastify, req.user.id, req);
  });

  fastify.get('/profile/:userId', { preHandler: [fastify.authenticate] }, async (req) => {
    return ProfileService.getUserProfile(fastify, req.params.userId, req);
  });
};
