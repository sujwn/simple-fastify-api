const { hashPassword, comparePassword } = require('../utils/hash');

class AuthService {
  constructor(authRepo, profileRepo) {
    this.authRepo = authRepo;
    this.profileRepo = profileRepo;
  }

  async register(fastify, { username, password, fullname, gender, dob }, req) {
    req.log.info({ username }, 'Register attempt');

    const existing = await this.authRepo.findByUsername(fastify.mongo, username);
    if (existing) throw { status: 400, message: 'Username already exists' };

    const hashedPassword = await hashPassword(password, fastify.config.bcrypt.saltRounds);
    const user = await this.authRepo.createUser(fastify.mongo, { username, password: hashedPassword });
    await this.profileRepo.createProfile(fastify.mongo, { userId: user.insertedId, fullname, gender, dob });

    return { id: user.insertedId, username };
  }

  async login(fastify, { username, password }, req) {
    req.log.info({ username }, 'Login attempt');

    const user = await this.authRepo.findByUsername(fastify.mongo, username);
    if (!user) throw { status: 401, message: 'Invalid credentials' };

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw { status: 401, message: 'Invalid credentials' };

    const accessToken = fastify.jwt.sign(
      { id: user._id, username: user.username },
      { expiresIn: fastify.config.jwt.expiresIn }
    );

    const refreshToken = fastify.jwt.sign(
      { id: user._id, username: user.username },
      { secret: fastify.config.jwt.refreshSecret, expiresIn: fastify.config.jwt.refreshExpiresIn }
    );

    await this.authRepo.updateLastLogin(fastify.mongo, user._id);

    return { accessToken, refreshToken };
  }

  async refresh(fastify, refreshToken, req) {
    req.log.info('Refreshing token');

    try {
      const decoded = fastify.jwt.verify(refreshToken, { secret: fastify.config.jwt.refreshSecret });
      const accessToken = fastify.jwt.sign(
        { id: decoded.id, username: decoded.username },
        { expiresIn: fastify.config.jwt.expiresIn }
      );
      return { accessToken };
    } catch (err) {
      throw { status: 401, message: 'Invalid refresh token' };
    }
  }
}

module.exports = AuthService;
