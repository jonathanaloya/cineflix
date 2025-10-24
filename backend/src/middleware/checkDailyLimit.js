const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user.role === 'admin' || user.subscription.type !== 'free') {
      return next(); // Admin users and subscribed users have no limits
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const userStreamDate = new Date(user.dailyStreams.date);
    userStreamDate.setHours(0, 0, 0, 0);
    
    // Reset count if it's a new day
    if (userStreamDate.getTime() !== today.getTime()) {
      user.dailyStreams = { date: new Date(), count: 0 };
      await user.save();
    }
    
    // Check daily limit for free users
    if (user.dailyStreams.count >= 1) {
      return res.status(403).json({ 
        message: 'Daily streaming limit reached. Please subscribe to continue watching.',
        requiresSubscription: true 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};