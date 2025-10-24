import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const CategoryPage = () => {
  const { category } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    language: '',
    search: ''
  });

  const categoryTitles = {
    movies: 'Movies',
    series: 'TV Series',
    anime: 'Anime',
    korean: 'Korean Movies & Series',
    chinese: 'Chinese Movies & Series',
    indian: 'Indian Movies & Series',
    translated: 'Translated Movies'
  };

  const languages = [
    { code: 'english', name: 'English' },
    { code: 'ateso', name: 'Ateso' },
    { code: 'lusoga', name: 'Lusoga' },
    { code: 'lumasaba', name: 'Lumasaba' },
    { code: 'luganda', name: 'Luganda' }
  ];

  useEffect(() => {
    fetchMovies();
  }, [category, filters]);

  const fetchMovies = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.language) params.append('language', filters.language);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`/api/movies/category/${category}?${params}`);
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="category-page">
      <div className="page-header">
        <h1>{categoryTitles[category] || 'Movies'}</h1>
        
        <div className="filters">
          <select 
            value={filters.language} 
            onChange={(e) => handleFilterChange('language', e.target.value)}
          >
            <option value="">All Languages</option>
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search movies..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      <div className="movies-grid">
        {movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>

      {movies.length === 0 && (
        <div className="no-movies">
          <p>No movies found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;