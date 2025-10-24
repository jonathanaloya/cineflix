// MongoDB Schema Documentation for CineFlix

// User Collection
const userSchema = {
  _id: "ObjectId",
  email: "String (unique, required)",
  password: "String (hashed, required)",
  name: "String (required)",
  subscription: {
    type: "String (enum: ['free', 'basic', 'premium'], default: 'free')",
    expiresAt: "Date",
    flutterwaveRef: "String"
  },
  preferredLanguage: "String (enum: ['english', 'ateso', 'lusoga', 'lumasaba', 'luganda'], default: 'english')",
  downloadedMovies: ["ObjectId (ref: Movie)"],
  createdAt: "Date",
  updatedAt: "Date"
};

// Movie Collection
const movieSchema = {
  _id: "ObjectId",
  title: "String (required)",
  description: "String (required)",
  genre: ["String"],
  releaseYear: "Number",
  duration: "Number (minutes)",
  rating: "Number (0-10)",
  poster: "String (image URL)",
  trailer: "String (video URL)",
  
  // Multi-language support
  languages: [{
    code: "String (enum: ['english', 'ateso', 'lusoga', 'lumasaba', 'luganda'], required)",
    videoUrl: "String (required)",
    subtitles: "String (subtitle file URL)",
    audioTrack: "String (audio file URL)"
  }],
  
  // Access control
  subscriptionRequired: "String (enum: ['free', 'basic', 'premium'], default: 'free')",
  
  // File information
  fileSize: "Number (MB)",
  quality: "String (enum: ['720p', '1080p', '4K'], default: '1080p')",
  
  // Analytics
  downloadCount: "Number (default: 0)",
  viewCount: "Number (default: 0)",
  
  createdAt: "Date",
  updatedAt: "Date"
};

// Sample Data Structure

// Sample User
const sampleUser = {
  _id: "507f1f77bcf86cd799439011",
  email: "user@example.com",
  password: "$2a$12$hashedpassword",
  name: "John Doe",
  subscription: {
    type: "basic",
    expiresAt: new Date("2024-12-31"),
    flutterwaveRef: "FLW-MOCK-123456789"
  },
  preferredLanguage: "luganda",
  downloadedMovies: ["507f1f77bcf86cd799439012"],
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-15")
};

// Sample Movie
const sampleMovie = {
  _id: "507f1f77bcf86cd799439012",
  title: "The Great Adventure",
  description: "An epic adventure story set in the heart of Uganda",
  genre: ["Adventure", "Drama"],
  releaseYear: 2024,
  duration: 120,
  rating: 8.5,
  poster: "/uploads/posters/adventure-poster.jpg",
  trailer: "/uploads/trailers/adventure-trailer.mp4",
  
  languages: [
    {
      code: "english",
      videoUrl: "/uploads/movies/adventure-english.mp4",
      subtitles: "/uploads/subtitles/adventure-english.srt",
      audioTrack: "/uploads/audio/adventure-english.mp3"
    },
    {
      code: "luganda",
      videoUrl: "/uploads/movies/adventure-luganda.mp4",
      subtitles: "/uploads/subtitles/adventure-luganda.srt",
      audioTrack: "/uploads/audio/adventure-luganda.mp3"
    },
    {
      code: "ateso",
      videoUrl: "/uploads/movies/adventure-ateso.mp4",
      subtitles: "/uploads/subtitles/adventure-ateso.srt",
      audioTrack: "/uploads/audio/adventure-ateso.mp3"
    }
  ],
  
  subscriptionRequired: "basic",
  fileSize: 2048, // 2GB
  quality: "1080p",
  downloadCount: 150,
  viewCount: 1250,
  
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-15")
};

// Indexes for Performance
const indexes = {
  users: [
    { email: 1 }, // Unique index for login
    { "subscription.type": 1 }, // Filter by subscription
    { preferredLanguage: 1 } // Filter by language preference
  ],
  movies: [
    { title: "text" }, // Text search
    { genre: 1 }, // Filter by genre
    { "languages.code": 1 }, // Filter by language
    { subscriptionRequired: 1 }, // Filter by subscription requirement
    { rating: -1 }, // Sort by rating
    { viewCount: -1 }, // Sort by popularity
    { createdAt: -1 } // Sort by newest
  ]
};

module.exports = {
  userSchema,
  movieSchema,
  sampleUser,
  sampleMovie,
  indexes
};