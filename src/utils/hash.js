const bcrypt = require('bcrypt');

async function hashPassword(password, saltRounds) {
  return bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePassword };
