import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FeaturedSlider from '../components/FeaturedSlider';
import CategorySection from '../components/CategorySection';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <FeaturedSlider />
      
      <div className="content-sections">
        <CategorySection title="Latest Movies" category="movies" />
        <CategorySection title="TV Series" category="series" />
        <CategorySection title="Anime" category="anime" />
        <CategorySection title="Korean Movies & Series" category="korean" />
        <CategorySection title="Chinese Movies & Series" category="chinese" />
        <CategorySection title="Indian Movies & Series" category="indian" />
        
        {/* Translated Movies Section */}
        <CategorySection title="Translated Movies" category="translated" />
        <CategorySection title="Ateso Movies" category="translated" language="ateso" />
        <CategorySection title="Lusoga Movies" category="translated" language="lusoga" />
        <CategorySection title="Lumasaba Movies" category="translated" language="lumasaba" />
        <CategorySection title="Luganda Movies" category="translated" language="luganda" />
      </div>

      {!user && (
        <div className="cta-section">
          <h2>Ready to start watching?</h2>
          <Link to="/register" className="cta-btn">Sign Up Now</Link>
        </div>
      )}
    </div>
  );
};

export default Home;