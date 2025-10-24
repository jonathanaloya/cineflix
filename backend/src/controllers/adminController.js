const Movie = require('../models/Movie');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const activeSubscriptions = await User.countDocuments({ 
      'subscription.type': { $ne: 'free' },
      'subscription.expiresAt': { $gt: new Date() }
    });
    const totalViews = await Movie.aggregate([
      { $group: { _id: null, total: { $sum: '$viewCount' } } }
    ]);
    
    res.json({
      totalUsers,
      totalMovies,
      activeSubscriptions,
      totalViews: totalViews[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    await User.findByIdAndUpdate(req.params.id, { isActive });
    res.json({ message: `User ${isActive ? 'activated' : 'banned'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllMoviesAdmin = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMovie = async (req, res) => {
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

const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllMoviesAdmin,
  createMovie,
  updateMovie,
  deleteMovie
};