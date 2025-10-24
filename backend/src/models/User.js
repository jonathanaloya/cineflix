const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  mobile: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscription: {
    type: { type: String, enum: ['free', 'basic', 'premium'], default: 'free' },
    expiresAt: Date,
    flutterwaveRef: String
  },
  preferredLanguage: { 
    type: String, 
    enum: ['english', 'ateso', 'lusoga', 'lumasaba', 'luganda'], 
    default: 'english' 
  },
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  downloadedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  dailyStreams: {
    date: { type: Date, default: Date.now },
    count: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);