const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { initRedis } = require('./utils/cache');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const subscriptionRoutes = require('./routes/subscriptions');
const adminRoutes = require('./routes/admin');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use('/uploads', express.static('uploads', {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminRoutes);

// Initialize cache system
initRedis();

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cineflix';
console.log('Connecting to MongoDB:', mongoUri.replace(/\/\/.*@/, '//***:***@'));

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    console.log('Database name:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});