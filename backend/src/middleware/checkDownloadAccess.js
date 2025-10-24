const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    // Admin users have unlimited access
    if (user.role === 'admin') {
      req.user = user;
      return next();
    }
    
    // Downloads require subscription (not free)
    if (user.subscription.type === 'free') {
      return res.status(403).json({ 
        message: 'Downloads require a subscription. Please upgrade to Basic or Premium plan.',
        requiresSubscription: true,
        feature: 'download'
      });
    }
    
    // Check if subscription is still active
    if (user.subscription.expiresAt && user.subscription.expiresAt < new Date()) {
      return res.status(403).json({ 
        message: 'Subscription expired. Please renew to continue downloading.',
        requiresSubscription: true 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};