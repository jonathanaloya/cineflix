import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cachedGet } from '../utils/api';
import MovieCard from './MovieCard';

const CategorySection = ({ title, category, language }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, [category, language]);

  const fetchMovies = async () => {
    try {
      const params = new URLSearchParams();
      if (language) params.append('language', language);
      params.append('limit', '12');

      const response = await cachedGet(`/api/movies/category/${category}?${params}`);
      setMovies(response.data);
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading {title}...</div>;
  if (movies.length === 0) return null;

  return (
    <section className="category-section">
      <div className="section-header">
        <h2>{title}</h2>
        <Link to={`/category/${category}`} className="view-all">View All</Link>
      </div>
      <div className="movies-row">
        {movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;