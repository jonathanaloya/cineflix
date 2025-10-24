const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: [String],
  category: { 
    type: String, 
    enum: ['movies', 'series', 'anime', 'korean', 'chinese', 'indian', 'translated'], 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['movie', 'series'], 
    default: 'movie' 
  },
  releaseYear: Number,
  duration: Number,
  rating: { type: Number, min: 0, max: 10 },
  poster: String,
  trailer: String,
  
  // Multi-language support
  languages: [{
    code: { 
      type: String, 
      enum: ['english', 'ateso', 'lusoga', 'lumasaba', 'luganda'],
      required: true 
    },
    videoUrl: { type: String, required: true },
    subtitles: String,
    audioTrack: String
  }],
  
  // Primary language for categorization
  primaryLanguage: {
    type: String,
    enum: ['english', 'ateso', 'lusoga', 'lumasaba', 'luganda'],
    required: true
  },
  
  // Access control
  subscriptionRequired: { 
    type: String, 
    enum: ['free', 'basic', 'premium'], 
    default: 'free' 
  },
  
  // File info
  fileSize: Number,
  quality: { type: String, enum: ['720p', '1080p', '4K'], default: '1080p' },
  
  // Series specific
  totalEpisodes: Number,
  currentEpisode: Number,
  
  downloadCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);