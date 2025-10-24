import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StreamingStatus from './StreamingStatus';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">CineFlix</Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/category/movies" className="nav-link">Movies</Link>
          <Link to="/category/series" className="nav-link">TV Series</Link>
          <Link to="/category/anime" className="nav-link">Anime</Link>
          <div className="dropdown">
            <span className="nav-link dropdown-toggle">Translated ▼</span>
            <div className="dropdown-menu">
              <Link to="/category/translated" className="dropdown-item">All Translated</Link>
              <Link to="/category/translated?language=ateso" className="dropdown-item">Ateso</Link>
              <Link to="/category/translated?language=lusoga" className="dropdown-item">Lusoga</Link>
              <Link to="/category/translated?language=lumasaba" className="dropdown-item">Lumasaba</Link>
              <Link to="/category/translated?language=luganda" className="dropdown-item">Luganda</Link>
            </div>
          </div>
          
          {user ? (
            <>
              <StreamingStatus />
              <Link to="/profile" className="nav-link">Profile</Link>
              <Link to="/subscription" className="nav-link">
                {user.subscription.type.toUpperCase()}
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link admin-link">Admin</Link>
              )}
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;