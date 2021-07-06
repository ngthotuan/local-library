const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  username: { type: String, required: true },
  fullname: { type: String, required: true },
  role: {
    type: Number,
    enum: [
      0, // Regular user: read-only access
      1, // Editor: read, create and update access
      2, // Admin: read, create, update, delete access
    ],
    default: 0,
  },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Virtual for User's URL.
UserSchema.virtual('url').get(function () {
  return '/user/' + this._id;
});

// Instance method for hashing user-typed password.
UserSchema.methods.setPassword = function (password) {
  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  this.password = hash;
};

// Instance method for comparing user-typed password against hashed-password on db.
UserSchema.methods.validatePassword = function (password) {
  // Match password
  return bcrypt.compareSync(password, this.password);
};

// Export model
module.exports = mongoose.model('User', UserSchema);
