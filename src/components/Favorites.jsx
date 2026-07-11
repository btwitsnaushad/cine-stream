import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import './Home.css'; 

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Retrieve saved favorites from local storage on component mount
    const savedFavs = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavs);
  }, []);

  const toggleFavorite = (movie, e) => {
    if (e) e.stopPropagation();
    
    // Remove the selected movie from state and update local storage
    const updatedFavs = favorites.filter((fav) => fav.id !== movie.id);
    setFavorites(updatedFavs);
    localStorage.setItem('favorites', JSON.stringify(updatedFavs));

    // Dispatch custom event to instantly update the favorites counter in Navbar
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return (
    /* Main container with max-width for center alignment and optimal spacing */
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', minHeight: '80vh' }}>
      
      {/* Premium Heading Section with Flexbox to prevent text overlap */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
        <h1 style={{ color: '#f8fafc', margin: 0, lineHeight: '1' }}>My Favorites</h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem', margin: 0, fontWeight: '500' }}>Your saved movies</p>
      </div>

      {favorites.length === 0 ? (
        /* Premium Empty State UI */
        <div className="empty-state">
          <div className="empty-state-icon">❤️</div>
          <h2>No favorite movies yet</h2>
          <p>Start adding your favorites to see them here.</p>
        </div>
      ) : (
        /* Favorites Grid layout */
        <div className="movie-grid">
          {favorites.map((movie, index) => (
            <MovieCard 
              key={`${movie.id}-${index}`} 
              movie={movie} 
              isFavorite={true} 
              onToggleFavorite={toggleFavorite} 
              onClick={() => {}} // Pass empty function to disable modal opening on Favorites page
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;