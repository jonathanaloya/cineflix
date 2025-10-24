const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const checkSubscription = require('../middleware/checkSubscription');
const checkDailyLimit = require('../middleware/checkDailyLimit');
const checkDownloadAccess = require('../middleware/checkDownloadAccess');
const {
  getAllMovies,
  getMoviesByCategory,
  getFeaturedMovies,
  getMovieById,
  streamMovie,
  downloadMovie,
  uploadMovie
} = require('../controllers/movieController');

const router = express.Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/movies/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.get('/', getAllMovies);
router.get('/category/:category', getMoviesByCategory);
router.get('/featured', getFeaturedMovies);
router.get('/:id', getMovieById);
router.get('/:id/stream/:language', auth, checkDailyLimit, checkSubscription, streamMovie);
router.post('/:id/download/:language', auth, checkDownloadAccess, downloadMovie);
router.post('/upload', upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'videos', maxCount: 10 }
]), uploadMovie);

module.exports = router;