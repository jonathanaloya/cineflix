import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import StreamingStatus from '../components/StreamingStatus';

const MovieDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [streamUrl, setStreamUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const languages = {
    english: 'English',
    ateso: 'Ateso',
    lusoga: 'Lusoga',
    lumasaba: 'Lumasaba',
    luganda: 'Luganda'
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/movies/${id}`);
      setMovie(response.data);
      
      // Set default language to user's preferred or first available
      const availableLanguages = response.data.languages.map(l => l.code);
      const defaultLang = user?.preferredLanguage && availableLanguages.includes(user.preferredLanguage) 
        ? user.preferredLanguage 
        : availableLanguages[0];
      setSelectedLanguage(defaultLang);
    } catch (error) {
      setError('Movie not found');
    } finally {
      setLoading(false);
    }
  };

  const handleStream = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/movies/${id}/stream/${selectedLanguage}`);
      setStreamUrl(response.data.streamUrl);
      setError(''); // Clear any previous errors
    } catch (error) {
      if (error.response?.status === 403) {
        const message = error.response.data.message;
        if (error.response.data.requiresSubscription) {
          setError('Daily streaming limit reached (1 movie per day for free users). Please subscribe to continue watching.');
        } else {
          setError(message || 'Subscription upgrade required to watch this movie');
        }
      } else {
        setError('Failed to load stream');
      }
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/movies/${id}/download/${selectedLanguage}`);
      const link = document.createElement('a');
      link.href = response.data.downloadUrl;
      link.download = `${movie.title}_${selectedLanguage}.mp4`;
      link.click();
      setError(''); // Clear any previous errors
    } catch (error) {
      if (error.response?.status === 403) {
        const message = error.response.data.message;
        if (error.response.data.requiresSubscription) {
          setError('Downloads require a subscription. Please upgrade to Basic or Premium plan to download movies.');
        } else {
          setError(message || 'Subscription upgrade required to download this movie');
        }
      } else if (error.response?.status === 401) {
        setError('Please log in to download movies.');
      } else {
        setError('Failed to download movie');
      }
    }
  };

  if (loading) return <div className="loading">Loading movie...</div>;
  if (error && !movie) return <div className="error">{error}</div>;

  return (
    <div className="movie-detail">
      <div className="movie-header">
        <img src={`${process.env.REACT_APP_API_URL}/${movie.poster}`} alt={movie.title} className="movie-poster" />
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p>{movie.description}</p>
          <div className="movie-meta">
            <span>Rating: {movie.rating}/10</span>
            <span>Duration: {movie.duration} minutes</span>
            <span>Year: {movie.releaseYear}</span>
            <span>Quality: {movie.quality}</span>
          </div>
          <div className="genres">
            {movie.genre.map(g => (
              <span key={g} className="genre-tag">{g}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="language-selector">
        <h3>Select Language:</h3>
        <div className="language-buttons">
          {movie.languages.map(lang => (
            <button
              key={lang.code}
              className={`lang-btn ${selectedLanguage === lang.code ? 'active' : ''}`}
              onClick={() => setSelectedLanguage(lang.code)}
            >
              {languages[lang.code]}
            </button>
          ))}
        </div>
      </div>

      {streamUrl && (
        <div className="video-player">
          <ReactPlayer
            url={streamUrl}
            controls
            width="100%"
            height="500px"
          />
        </div>
      )}

      <StreamingStatus />

      <div className="action-buttons">
        {user ? (
          <>
            <button onClick={handleStream} className="stream-btn">
              Stream Now
            </button>
            <button onClick={handleDownload} className="download-btn">
              Download ({movie.fileSize}MB)
              {user.role !== 'admin' && user.subscription?.type === 'free' && (
                <span className="subscription-required"> (Subscription Required)</span>
              )}
            </button>
          </>
        ) : (
          <div className="login-prompt">
            <p>Please log in to watch or download this movie</p>
            <button onClick={handleDownload} className="download-btn guest-download">
              Download ({movie.fileSize}MB) - Login Required
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default MovieDetail;