const Flutterwave = require('flutterwave-node-v3');
const User = require('../models/User');

let flw;
if (process.env.FLW_PUBLIC_KEY && process.env.FLW_SECRET_KEY) {
  flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
}

const getPlans = (req, res) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      duration: 'forever',
      features: ['Limited movies', 'Standard quality', '1 language']
    },
    {
      id: 'basic-weekly',
      name: 'Basic Weekly',
      price: 5000,
      duration: 'week',
      features: ['More movies', 'HD quality', 'All languages', 'Download up to 5 movies']
    },
    {
      id: 'basic-monthly',
      name: 'Basic Monthly',
      price: 15000,
      duration: 'month',
      features: ['More movies', 'HD quality', 'All languages', 'Download up to 5 movies']
    },
    {
      id: 'premium-weekly',
      name: 'Premium Weekly',
      price: 8000,
      duration: 'week',
      features: ['All movies', '4K quality', 'All languages', 'Unlimited downloads', 'Early access']
    },
    {
      id: 'premium-monthly',
      name: 'Premium Monthly',
      price: 25000,
      duration: 'month',
      features: ['All movies', '4K quality', 'All languages', 'Unlimited downloads', 'Early access']
    }
  ];
  res.json(plans);
};

const createSubscription = async (req, res) => {
  try {
    if (!flw) {
      return res.status(500).json({ message: 'Payment service not configured' });
    }
    
    const { planId } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const planPrices = { 
      'basic-weekly': 5000, 
      'basic-monthly': 15000, 
      'premium-weekly': 8000, 
      'premium-monthly': 25000 
    };
    const amount = planPrices[planId];
    
    const payload = {
      tx_ref: `sub_${user._id}_${Date.now()}`,
      amount: amount,
      currency: 'UGX',
      redirect_url: `${process.env.FRONTEND_URL}/subscription/callback`,
      customer: {
        email: user.email,
        name: user.name
      },
      customizations: {
        title: `CineFlix ${planId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Plan`,
        description: `Subscription to CineFlix ${planId} plan`
      }
    };
    
    const response = await flw.StandardSubaccount.create(payload);
    
    res.json({ payment_link: response.data.link, tx_ref: payload.tx_ref });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    if (!flw) {
      return res.status(500).json({ message: 'Payment service not configured' });
    }
    
    const { tx_ref, planId } = req.body;
    const user = await User.findById(req.userId);
    
    const response = await flw.Transaction.verify({ id: tx_ref });
    
    if (response.data.status === 'successful') {
      const expiresAt = new Date();
      
      if (planId.includes('weekly')) {
        expiresAt.setDate(expiresAt.getDate() + 7);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }
      
      user.subscription = {
        type: planId,
        expiresAt: expiresAt,
        flutterwaveRef: tx_ref
      };
      await user.save();
      
      res.json({ message: 'Subscription activated successfully', user: user.subscription });
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    user.subscription = {
      type: 'free',
      expiresAt: null,
      flutterwaveRef: null
    };
    await user.save();
    
    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlans,
  createSubscription,
  verifyPayment,
  cancelSubscription
};