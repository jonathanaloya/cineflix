import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const MovieCard = ({ movie }) => {
  const { user } = useAuth();
  
  const getLanguageName = (code) => {
    const languages = {
      english: 'English',
      ateso: 'Ateso',
      lusoga: 'Lusoga',
      lumasaba: 'Lumasaba',
      luganda: 'Luganda'
    };
    return languages[code] || code;
  };
  
  const handleQuickDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please log in to download movies.');
      return;
    }
    
    if (user.role !== 'admin' && user.subscription?.type === 'free') {
      alert('Downloads require a subscription. Please upgrade to Basic or Premium plan.');
      return;
    }
    
    try {
      const primaryLanguage = movie.primaryLanguage || 'english';
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/movies/${movie._id}/download/${primaryLanguage}`);
      const link = document.createElement('a');
      link.href = response.data.downloadUrl;
      link.download = `${movie.title}_${primaryLanguage}.mp4`;
      link.click();
    } catch (error) {
      if (error.response?.status === 403) {
        alert('Subscription required to download movies.');
      } else {
        alert('Download failed. Please try again.');
      }
    }
  };

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie._id}`}>
        <div className="movie-poster">
          <LazyLoadImage
            src={getOptimizedImageUrl(movie.poster, 300)}
            alt={movie.title}
            effect="blur"
            placeholderSrc="/placeholder.jpg"
            width="100%"
            height="300px"
          />
          <div className="movie-overlay">
            <div className="play-button">▶</div>
            <button 
              className="download-button" 
              onClick={handleQuickDownload}
              title={!user ? 'Login required' : (user.role !== 'admin' && user.subscription?.type === 'free') ? 'Subscription required' : 'Download movie'}
            >
              ⬇
            </button>
          </div>
        </div>
      </Link>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="movie-meta">
          <span className="year">{movie.releaseYear}</span>
          <span className="rating">★ {movie.rating}</span>
          <span className="language">{getLanguageName(movie.primaryLanguage)}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;