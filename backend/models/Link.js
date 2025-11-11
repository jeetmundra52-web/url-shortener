const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  alias: { type: String, required: true, unique: true, index: true },
  target: { type: String, required: true },
  customTitle: { type: String },
  passwordHash: { type: String, default: null }, // if password protected
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, default: null } // TTL index will remove docs when expireAt passes
});

// TTL index: delete doc when expireAt reached (only if expireAt is set)
LinkSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Link', LinkSchema);
