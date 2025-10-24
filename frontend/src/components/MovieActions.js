import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const MovieActions = ({ movie, onSubscriptionRequired }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);

  const handleStream = async (language) => {
    if (!user) {
      alert('Please login to watch movies');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/movies/${movie._id}/stream/${language}`);
      // Handle streaming logic here
      console.log('Stream URL:', response.data.streamUrl);
    } catch (error) {
      if (error.response?.data?.requiresSubscription) {
        onSubscriptionRequired();
      } else {
        alert(error.response?.data?.message || 'Failed to stream movie');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (language) => {
    if (!user) {
      alert('Please login to download movies');
      return;
    }

    if (user.subscription.type === 'free') {
      alert('Subscription required to download movies');
      return;
    }

    try {
      const response = await axios.post(`/api/movies/${movie._id}/download/${language}`);
      const link = document.createElement('a');
      link.href = response.data.downloadUrl;
      link.download = `${movie.title}_${language}.mp4`;
      link.click();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to download movie');
    }
  };

  const toggleWatchlist = async () => {
    try {
      if (inWatchlist) {
        await axios.delete(`/api/auth/watchlist/${movie._id}`);
        setInWatchlist(false);
      } else {
        await axios.post(`/api/auth/watchlist/${movie._id}`);
        setInWatchlist(true);
      }
    } catch (error) {
      alert('Failed to update watchlist');
    }
  };

  const toggleFavorites = async () => {
    try {
      if (inFavorites) {
        await axios.delete(`/api/auth/favorites/${movie._id}`);
        setInFavorites(false);
      } else {
        await axios.post(`/api/auth/favorites/${movie._id}`);
        setInFavorites(true);
      }
    } catch (error) {
      alert('Failed to update favorites');
    }
  };

  const isSubscriptionRequired = movie.subscriptionRequired !== 'free';

  return (
    <div className="movie-actions">
      <div className="primary-actions">
        <button 
          onClick={() => handleStream(movie.primaryLanguage)} 
          className="play-btn"
          disabled={loading}
        >
          {loading ? 'Loading...' : '▶ Play'}
        </button>
        
        <button 
          onClick={() => handleDownload(movie.primaryLanguage)} 
          className="download-btn"
          disabled={user?.subscription.type === 'free'}
        >
          ⬇ Download
        </button>
      </div>

      {isSubscriptionRequired && user?.subscription.type === 'free' && (
        <div className="subscription-badge">
          Subscription Required
        </div>
      )}

      <div className="secondary-actions">
        <button onClick={toggleWatchlist} className="action-btn">
          {inWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
        </button>
        
        <button onClick={toggleFavorites} className="action-btn">
          {inFavorites ? '❤ Favorited' : '♡ Favorite'}
        </button>
      </div>
    </div>
  );
};

export default MovieActions;