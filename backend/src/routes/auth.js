const express = require('express');
const auth = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  addToWatchlist,
  removeFromWatchlist,
  addToFavorites,
  removeFromFavorites,
  getUserLists
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.post('/watchlist/:movieId', auth, addToWatchlist);
router.delete('/watchlist/:movieId', auth, removeFromWatchlist);
router.post('/favorites/:movieId', auth, addToFavorites);
router.delete('/favorites/:movieId', auth, removeFromFavorites);
router.get('/lists', auth, getUserLists);

module.exports = router;