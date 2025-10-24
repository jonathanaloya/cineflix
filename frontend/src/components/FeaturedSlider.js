import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FeaturedSlider = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchFeaturedMovies();
  }, []);

  useEffect(() => {
    if (featuredMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % featuredMovies.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredMovies]);

  const fetchFeaturedMovies = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/movies/featured`);
      setFeaturedMovies(response.data);
    } catch (error) {
      console.error('Error fetching featured movies:', error);
    }
  };

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentSlide];

  return (
    <div className="featured-slider">
      <div className="slide" style={{ backgroundImage: `url(${process.env.REACT_APP_API_URL}/${currentMovie.poster})` }}>
        <div className="slide-overlay">
          <div className="slide-content">
            <h1>{currentMovie.title}</h1>
            <p>{currentMovie.description}</p>
            <div className="slide-meta">
              <span>★ {currentMovie.rating}</span>
              <span>{currentMovie.releaseYear}</span>
              <span>{currentMovie.duration} min</span>
            </div>
            <div className="slide-actions">
              <Link to={`/movie/${currentMovie._id}`} className="play-btn">
                ▶ Watch Now
              </Link>
              <button className="info-btn">More Info</button>
            </div>
          </div>
        </div>
      </div>
      <div className="slider-dots">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSlider;