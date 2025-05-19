const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String },
  phone: { type: String },
  name: { type: String }
});

module.exports = mongoose.model('User', userSchema);
