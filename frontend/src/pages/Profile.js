import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <div>Please log in to view your profile</div>;

  const languages = {
    english: 'English',
    ateso: 'Ateso',
    lusoga: 'Lusoga',
    lumasaba: 'Lumasaba',
    luganda: 'Luganda'
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      
      <div className="profile-section">
        <h3>Account Information</h3>
        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Preferred Language:</strong> {languages[user.preferredLanguage]}</p>
          <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="profile-section">
        <h3>Subscription Details</h3>
        <div className="subscription-info">
          <p><strong>Plan:</strong> {user.subscription.type.toUpperCase()}</p>
          {user.subscription.expiresAt && (
            <p><strong>Expires:</strong> {new Date(user.subscription.expiresAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      <div className="profile-section">
        <h3>Downloaded Movies</h3>
        <div className="downloaded-movies">
          {user.downloadedMovies?.length > 0 ? (
            <p>You have {user.downloadedMovies.length} downloaded movies</p>
          ) : (
            <p>No downloaded movies yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;