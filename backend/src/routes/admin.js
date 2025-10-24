const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllMoviesAdmin,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/adminController');

const router = express.Router();

// Admin middleware
const adminAuth = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/movies/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.get('/dashboard', auth, adminAuth, getDashboardStats);
router.get('/users', auth, adminAuth, getAllUsers);
router.patch('/users/:id/status', auth, adminAuth, updateUserStatus);
router.get('/movies', auth, adminAuth, getAllMoviesAdmin);
router.post('/movies', auth, adminAuth, upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'trailer', maxCount: 1 },
  { name: 'videos', maxCount: 10 }
]), createMovie);
router.put('/movies/:id', auth, adminAuth, updateMovie);
router.delete('/movies/:id', auth, adminAuth, deleteMovie);

module.exports = router;