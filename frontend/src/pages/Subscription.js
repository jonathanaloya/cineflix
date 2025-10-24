import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';



const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPlans();
    checkPaymentCallback();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/subscriptions/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const checkPaymentCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const tx_ref = urlParams.get('tx_ref');
    const planId = localStorage.getItem('selectedPlan');
    
    if (status === 'successful' && tx_ref && planId) {
      verifyPayment(tx_ref, planId);
    }
  };

  const verifyPayment = async (tx_ref, planId) => {
    try {
      await axios.post('/api/subscriptions/verify', { tx_ref, planId });
      localStorage.removeItem('selectedPlan');
      alert('Subscription activated successfully!');
      window.location.href = '/profile';
    } catch (error) {
      alert('Payment verification failed');
    }
  };

  const handlePlanSelect = async (plan) => {
    if (plan.id === 'free') return;
    setLoading(true);
    
    try {
      const response = await axios.post('/api/subscriptions/create', { planId: plan.id });
      localStorage.setItem('selectedPlan', plan.id);
      window.location.href = response.data.payment_link;
    } catch (error) {
      alert('Failed to create payment link');
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      await axios.post('/api/subscriptions/cancel');
      alert('Subscription cancelled successfully');
      window.location.reload();
    } catch (error) {
      alert('Failed to cancel subscription');
    }
  };

  return (
    <div className="subscription-page">
      <h1>Choose Your Plan</h1>
      
      {user && (
        <div className="current-plan">
          <h3>Current Plan: {user.subscription.type.toUpperCase()}</h3>
          {user.subscription.type !== 'free' && (
            <button onClick={cancelSubscription} className="cancel-btn">
              Cancel Subscription
            </button>
          )}
        </div>
      )}

      <div className="plans-container">
        <div className="plan-type">
          <h2>Weekly Plans</h2>
          <div className="plans-grid">
            {plans.filter(plan => plan.duration === 'week' || plan.id === 'free').map(plan => (
              <div 
                key={plan.id} 
                className={`plan-card ${user?.subscription.type === plan.id ? 'current' : ''}`}
              >
                <h3>{plan.name}</h3>
                <div className="price">
                  {plan.price === 0 ? 'Free' : `UGX ${plan.price.toLocaleString()}/${plan.duration}`}
                </div>
                <ul className="features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                {user?.subscription.type !== plan.id && (
                  <button 
                    onClick={() => handlePlanSelect(plan)}
                    className="select-plan-btn"
                    disabled={plan.id === 'free' || loading}
                  >
                    {plan.id === 'free' ? 'Current Plan' : loading ? 'Processing...' : 'Select Plan'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="plan-type">
          <h2>Monthly Plans</h2>
          <div className="plans-grid">
            {plans.filter(plan => plan.duration === 'month').map(plan => (
              <div 
                key={plan.id} 
                className={`plan-card ${user?.subscription.type === plan.id ? 'current' : ''}`}
              >
                <h3>{plan.name}</h3>
                <div className="price">
                  UGX {plan.price.toLocaleString()}/{plan.duration}
                </div>
                <ul className="features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                {user?.subscription.type !== plan.id && (
                  <button 
                    onClick={() => handlePlanSelect(plan)}
                    className="select-plan-btn"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Select Plan'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default Subscription;