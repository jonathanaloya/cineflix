const express = require('express');
const auth = require('../middleware/auth');
const {
  getPlans,
  createSubscription,
  verifyPayment,
  cancelSubscription
} = require('../controllers/subscriptionController');

const router = express.Router();

router.get('/plans', getPlans);
router.post('/create', auth, createSubscription);
router.post('/verify', auth, verifyPayment);
router.post('/cancel', auth, cancelSubscription);



module.exports = router;