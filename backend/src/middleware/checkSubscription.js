const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const movie = req.movie || await require('../models/Movie').findById(req.params.id);
    
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    
    // Admin users have unlimited access
    if (user.role === 'admin') {
      req.user = user;
      req.movie = movie;
      return next();
    }
    
    // Check if user's subscription level allows access
    const subscriptionLevels = { free: 0, basic: 1, premium: 2 };
    const requiredLevel = subscriptionLevels[movie.subscriptionRequired];
    const userLevel = subscriptionLevels[user.subscription.type];
    
    if (userLevel < requiredLevel) {
      return res.status(403).json({ 
        message: 'Subscription upgrade required',
        requiredSubscription: movie.subscriptionRequired 
      });
    }
    
    // Check if subscription is still active
    if (user.subscription.type !== 'free' && user.subscription.expiresAt < new Date()) {
      return res.status(403).json({ message: 'Subscription expired' });
    }
    
    req.user = user;
    req.movie = movie;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};