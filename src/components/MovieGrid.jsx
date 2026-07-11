import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({
  isLoading,
  error,
  page,
  movies,
  favorites,
  toggleFavorite,
  handleMovieClick,
  activeTab,
  loaderRef,
  fetchMovies,
  clearSearch
}) => {
  // 1. Render Error State: Displays an error message and a retry button if the initial API fetch fails
  if (error && page === 1) {
    return (
      <div className="error-container">
        <h2>⚠️ Something went wrong.</h2>
        <button onClick={fetchMovies} className="retry-btn">Retry</button>
      </div>
    );
  }

  // 2. Render Initial Loading Skeletons: Displays placeholder skeleton cards while the first page is loading
  if (isLoading && page === 1) {
    return (
      <div className="movie-grid">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="movie-card skeleton-card">
            <div className="skeleton skeleton-img"></div>
            <div className="skeleton skeleton-text title"></div>
            <div className="skeleton skeleton-text short"></div>
          </div>
        ))}
      </div>
    );
  }

  // 3. Render Premium Empty State: Displays a centered UI message when no movies match the search query or filters
  if (!isLoading && !error && movies.length === 0) {
    return (
      <div className="empty-state" style={{ gridColumn: '1 / -1', marginTop: '40px', textAlign: 'center' }}>
        <div className="empty-state-icon">🎬</div>
        <h2>No movies found.</h2>
        <p>Try searching for a different movie title or keyword.</p>
        
        {/* Render Clear Search button if a search query exists */}
        {clearSearch && (
          <button 
            onClick={clearSearch} 
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '15px',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Clear Search
          </button>
        )}
      </div>
    );
  }

  // 4. Render Main Movie Grid: Displays the actual movie cards and the infinite scroll loader at the bottom
  return (
    <>
      {/* Grid containing all mapped movie cards */}
      <div className="movie-grid">
        {movies.map((movie, index) => (
          <MovieCard 
            key={`${movie.id}-${index}`} 
            movie={movie} 
            isFavorite={favorites.some((f) => f.id === movie.id)} 
            onToggleFavorite={toggleFavorite} 
            onClick={handleMovieClick} 
          />
        ))}
      </div>
      
      {/* Infinite Scroll Loader Target: Displays additional skeleton cards when fetching the next page */}
      <div ref={loaderRef} className="loader">
        {isLoading && page > 1 && activeTab !== 'recently_viewed' ? (
          <div className="infinite-loader-container">
            <div className="movie-grid infinite-skeletons">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="movie-card skeleton-card">
                  <div className="skeleton skeleton-img"></div>
                  <div className="skeleton skeleton-text title"></div>
                  <div className="skeleton skeleton-text short"></div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default MovieGrid;