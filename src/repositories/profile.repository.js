class ProfileRepository {
  static async createProfile(db, profile) {
    return db.collection('profiles').insertOne(profile);
  }

  static async findByUserId(db, userId) {
    return db.collection('profiles').findOne({ userId });
  }
}

module.exports = ProfileRepository;
