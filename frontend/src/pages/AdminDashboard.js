import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FileUploadTips from '../components/FileUploadTips';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    category: '',
    primaryLanguage: '',
    releaseYear: '',
    duration: '',
    rating: '',
    subscriptionRequired: 'free'
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, moviesRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dashboard`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/movies`)
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setMovies(moviesRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/admin/users/${userId}/status`, { isActive: !isActive });
      fetchDashboardData();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const deleteMovie = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/movies/${movieId}`);
        fetchDashboardData();
      } catch (error) {
        alert('Failed to delete movie');
      }
    }
  };

  const handleMovieFormChange = (e) => {
    setMovieForm({
      ...movieForm,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setMovieForm({
      ...movieForm,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleMovieUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(movieForm).forEach(key => {
        if (key !== 'poster' && key !== 'video') {
          formData.append(key, movieForm[key]);
        }
      });
      
      // Add files
      if (movieForm.poster) formData.append('poster', movieForm.poster);
      if (movieForm.video) {
        // Create languages array with the uploaded video
        const languages = JSON.stringify([{
          code: movieForm.primaryLanguage,
          videoUrl: `/uploads/movies/${movieForm.video.name}`,
          subtitles: '',
          audioTrack: ''
        }]);
        formData.append('languages', languages);
        formData.append('videos', movieForm.video);
      }
      
      // Add other required fields
      formData.append('type', 'movie');
      formData.append('genre', JSON.stringify(['General']));
      
      await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/movies`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 300000, // 5 minutes
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      alert('Movie uploaded successfully!');
      setActiveTab('movies');
      setMovieForm({
        title: '',
        description: '',
        category: '',
        primaryLanguage: '',
        releaseYear: '',
        duration: '',
        rating: '',
        subscriptionRequired: 'free'
      });
      fetchDashboardData();
    } catch (error) {
      alert('Failed to upload movie: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (user?.role !== 'admin') {
    return <div className="error">Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <nav className="admin-nav">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={activeTab === 'movies' ? 'active' : ''} 
            onClick={() => setActiveTab('movies')}
          >
            Movies
          </button>
        </nav>
      </div>

      {activeTab === 'dashboard' && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Movies</h3>
            <p>{stats.totalMovies}</p>
          </div>
          <div className="stat-card">
            <h3>Active Subscriptions</h3>
            <p>{stats.activeSubscriptions}</p>
          </div>
          <div className="stat-card">
            <h3>Total Views</h3>
            <p>{stats.totalViews}</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-management">
          <h2>User Management</h2>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subscription</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.subscription.type}</td>
                    <td>{user.isActive ? 'Active' : 'Banned'}</td>
                    <td>
                      <button 
                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                        className={user.isActive ? 'ban-btn' : 'activate-btn'}
                      >
                        {user.isActive ? 'Ban' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'movies' && (
        <div className="movies-management">
          <div className="movies-header">
            <h2>Movie Management</h2>
            <button 
              onClick={() => setActiveTab('upload')} 
              className="upload-btn"
            >
              + Add Movie
            </button>
          </div>
          <div className="movies-grid">
            {movies.map(movie => (
              <div key={movie._id} className="admin-movie-card">
                <img src={movie.poster} alt={movie.title} />
                <div className="movie-details">
                  <h3>{movie.title}</h3>
                  <p>Category: {movie.category}</p>
                  <p>Language: {movie.primaryLanguage}</p>
                  <p>Views: {movie.viewCount}</p>
                  <div className="movie-actions">
                    <button onClick={() => deleteMovie(movie._id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="movie-upload">
          <h2>Upload New Movie</h2>
          <FileUploadTips />
          <form onSubmit={handleMovieUpload} className="upload-form">
            <div className="form-row">
              <input
                type="text"
                name="title"
                placeholder="Movie Title"
                value={movieForm.title}
                onChange={handleMovieFormChange}
                required
              />
              <select
                name="category"
                value={movieForm.category}
                onChange={handleMovieFormChange}
                required
              >
                <option value="">Select Category</option>
                <option value="movies">Movies</option>
                <option value="series">TV Series</option>
                <option value="anime">Anime</option>
                <option value="korean">Korean</option>
                <option value="chinese">Chinese</option>
                <option value="indian">Indian</option>
                <option value="translated">Translated</option>
              </select>
            </div>
            
            <div className="form-row">
              <select
                name="primaryLanguage"
                value={movieForm.primaryLanguage}
                onChange={handleMovieFormChange}
                required
              >
                <option value="">Primary Language</option>
                <option value="english">English</option>
                <option value="ateso">Ateso</option>
                <option value="lusoga">Lusoga</option>
                <option value="lumasaba">Lumasaba</option>
                <option value="luganda">Luganda</option>
              </select>
              <select
                name="subscriptionRequired"
                value={movieForm.subscriptionRequired}
                onChange={handleMovieFormChange}
              >
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            
            <textarea
              name="description"
              placeholder="Movie Description"
              value={movieForm.description}
              onChange={handleMovieFormChange}
              required
            />
            
            <div className="form-row">
              <input
                type="number"
                name="releaseYear"
                placeholder="Release Year"
                value={movieForm.releaseYear}
                onChange={handleMovieFormChange}
              />
              <input
                type="number"
                name="duration"
                placeholder="Duration (minutes)"
                value={movieForm.duration}
                onChange={handleMovieFormChange}
              />
              <input
                type="number"
                name="rating"
                placeholder="Rating (0-10)"
                min="0"
                max="10"
                step="0.1"
                value={movieForm.rating}
                onChange={handleMovieFormChange}
              />
            </div>
            
            <div className="file-uploads">
              <div className="file-group">
                <label>Poster Image:</label>
                <input
                  type="file"
                  name="poster"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="file-group">
                <label>Movie Video:</label>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" disabled={uploading} className="submit-btn">
                {uploading ? `Uploading... ${uploadProgress}%` : 'Upload Movie'}
              </button>
              {uploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{uploadProgress}% uploaded</span>
                </div>
              )}
              <button 
                type="button" 
                onClick={() => setActiveTab('movies')} 
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;