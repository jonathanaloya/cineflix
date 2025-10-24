const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { email, mobile, password, name, preferredLanguage } = req.body;
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { mobile: mobile || null }]
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, mobile, password, name, preferredLanguage });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret');
    res.status(201).json({ token, user: { id: user._id, email, mobile, name, role: user.role, subscription: user.subscription } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;
    
    const user = await User.findOne({ 
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }]
    });
    
    if (!user || !(await user.comparePassword(password)) || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: user._id, email: user.email, mobile: user.mobile, name: user.name, role: user.role, subscription: user.subscription } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.watchlist.includes(req.params.movieId)) {
      user.watchlist.push(req.params.movieId);
      await user.save();
    }
    res.json({ message: 'Added to watchlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.watchlist = user.watchlist.filter(id => id.toString() !== req.params.movieId);
    await user.save();
    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.favorites.includes(req.params.movieId)) {
      user.favorites.push(req.params.movieId);
      await user.save();
    }
    res.json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.movieId);
    await user.save();
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserLists = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('watchlist')
      .populate('favorites');
    res.json({ watchlist: user.watchlist, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  addToWatchlist,
  removeFromWatchlist,
  addToFavorites,
  removeFromFavorites,
  getUserLists
};