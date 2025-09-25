const { ObjectId } = require('mongodb');

class AuthRepository {
  static async findByUsername(db, username) {
    return db.collection('users').findOne({ username });
  }

  static async createUser(db, user) {
    return db.collection('users').insertOne({ ...user, lastLogin: null });
  }

  static async updateLastLogin(db, userId) {
    return db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { lastLogin: new Date() } }
    );
  }
}

module.exports = AuthRepository;
