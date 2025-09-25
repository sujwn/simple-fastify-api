class ProfileService {
  constructor(profileRepo) {
    this.profileRepo = profileRepo;
  }

  async getMyProfile(fastify, userId, req) {
    req.log.info({ userId }, 'Fetching my profile');
    const profile = await this.profileRepo.findByUserId(fastify.mongo, userId);
    if (!profile) throw { status: 404, message: 'Profile not found' };
    return profile;
  }

  async getUserProfile(fastify, userId, req) {
    req.log.info({ userId }, 'Fetching user profile');
    const profile = await this.profileRepo.findByUserId(fastify.mongo, userId);
    if (!profile) throw { status: 404, message: 'Profile not found' };
    return profile;
  }
}

module.exports = ProfileService;
