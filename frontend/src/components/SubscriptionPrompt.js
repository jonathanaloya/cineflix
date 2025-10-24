import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SubscriptionPrompt = ({ feature = 'this feature', onClose }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="subscription-prompt">
        <div className="prompt-content">
          <h3>Login Required</h3>
          <p>Please log in to access {feature}.</p>
          <div className="prompt-actions">
            <Link to="/login" className="btn-primary">Login</Link>
            <Link to="/register" className="btn-secondary">Register</Link>
            {onClose && <button onClick={onClose} className="btn-close">Close</button>}
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin' && user.subscription?.type === 'free') {
    return (
      <div className="subscription-prompt">
        <div className="prompt-content">
          <h3>Subscription Required</h3>
          <p>{feature} requires a subscription. Upgrade to Basic or Premium plan.</p>
          <div className="subscription-benefits">
            <h4>Basic Plan Benefits:</h4>
            <ul>
              <li>Download up to 5 movies</li>
              <li>HD quality streaming</li>
              <li>All language support</li>
            </ul>
            <h4>Premium Plan Benefits:</h4>
            <ul>
              <li>Unlimited downloads</li>
              <li>4K quality streaming</li>
              <li>Early access to new releases</li>
            </ul>
          </div>
          <div className="prompt-actions">
            <Link to="/subscription" className="btn-primary">Upgrade Now</Link>
            {onClose && <button onClick={onClose} className="btn-close">Close</button>}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SubscriptionPrompt;