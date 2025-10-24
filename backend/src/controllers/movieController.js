const Movie = require('../models/Movie');
const User = require('../models/User');
const { cache } = require('../utils/cache');

const getAllMovies = async (req, res) => {
  try {
    const { category, language, genre, search, type } = req.query;
    const cacheKey = `movies:${JSON.stringify(req.query)}`;
    
    // Check cache first
    const cachedMovies = await cache.get(cacheKey);
    if (cachedMovies) {
      return res.json(cachedMovies);
    }
    
    let query = {};
    if (category) query.category = category;
    if (type) query.type = type;
    if (genre) query.genre = { $in: [genre] };
    if (language) query.primaryLanguage = language;
    if (search) query.title = { $regex: search, $options: 'i' };
    
    const movies = await Movie.find(query)
      .select('title description poster rating releaseYear duration category primaryLanguage subscriptionRequired')
      .sort({ createdAt: -1 })
      .lean();
    
    // Cache for 10 minutes
    await cache.set(cacheKey, movies, 600);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMoviesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { language, limit = 20 } = req.query;
    
    let query = { category };
    if (language) query.primaryLanguage = language;
    
    const movies = await Movie.find(query)
      .sort({ featured: -1, viewCount: -1 })
      .limit(parseInt(limit));
    
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedMovies = async (req, res) => {
  try {
    const cacheKey = 'featured:movies';
    
    // Check cache first
    const cachedMovies = await cache.get(cacheKey);
    if (cachedMovies) {
      return res.json(cachedMovies);
    }
    
    // First try to get featured movies
    let movies = await Movie.find({ featured: true })
      .select('title description poster rating releaseYear duration category primaryLanguage')
      .sort({ viewCount: -1 })
      .limit(10)
      .lean();
    
    // If no featured movies, get recent movies
    if (movies.length === 0) {
      movies = await Movie.find({})
        .select('title description poster rating releaseYear duration category primaryLanguage')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
    }
    
    // Cache for 30 minutes
    await cache.set(cacheKey, movies, 1800);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const streamMovie = async (req, res) => {
  try {
    const { id, language } = req.params;
    const movie = await Movie.findById(id);
    
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    
    const languageVersion = movie.languages.find(lang => lang.code === language);
    if (!languageVersion) return res.status(404).json({ message: 'Language version not found' });
    
    // Update daily stream count for free users (not admin)
    if (req.user.role !== 'admin' && req.user.subscription.type === 'free') {
      req.user.dailyStreams.count += 1;
      await req.user.save();
    }
    
    // Increment view count
    movie.viewCount += 1;
    await movie.save();
    
    res.json({ streamUrl: languageVersion.videoUrl, subtitles: languageVersion.subtitles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadMovie = async (req, res) => {
  try {
    const { id, language } = req.params;
    const movie = await Movie.findById(id);
    
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    
    const languageVersion = movie.languages.find(lang => lang.code === language);
    if (!languageVersion) return res.status(404).json({ message: 'Language version not found' });
    
    // Add to user's downloaded movies if not already there
    if (!req.user.downloadedMovies.includes(id)) {
      req.user.downloadedMovies.push(id);
      await req.user.save();
    }
    
    // Increment download count
    movie.downloadCount += 1;
    await movie.save();
    
    res.json({ 
      downloadUrl: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/${languageVersion.videoUrl}`,
      fileSize: movie.fileSize,
      filename: `${movie.title}_${language}.mp4`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadMovie = async (req, res) => {
  try {
    const { title, description, genre, category, type, primaryLanguage, releaseYear, duration, rating, subscriptionRequired, languages, featured } = req.body;
    
    const movie = new Movie({
      title,
      description,
      genre: JSON.parse(genre),
      category,
      type,
      primaryLanguage,
      releaseYear,
      duration,
      rating,
      subscriptionRequired,
      featured: featured === 'true',
      poster: req.files.poster ? req.files.poster[0].path : null,
      trailer: req.files.trailer ? req.files.trailer[0].path : null,
      languages: JSON.parse(languages)
    });
    
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMovies,
  getMoviesByCategory,
  getFeaturedMovies,
  getMovieById,
  streamMovie,
  downloadMovie,
  uploadMovie
};