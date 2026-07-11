import React from 'react';

const MovieCard = ({ movie, isFavorite, onToggleFavorite, onClick }) => {
  // Fix: Replaced via.placeholder.com with placehold.co to fix the ERR_CONNECTION_CLOSED issue
  // The dark background (#18181b) perfectly matches your app's theme
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://placehold.co/500x750/18181b/ffffff?text=No+Poster';

  // Format rating to 1 decimal place or show 'N/A'
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  
  // Extract just the year from the release date
  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : 'Unknown';

  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      
      <div className="movie-img-container">
        <img 
          src={posterUrl} 
          alt={movie.title || 'Movie Poster'} 
          className="movie-img" 
          loading="lazy" 
        />
        
        {/* Heart Button with perfect 36px styling from CSS */}
        <button 
          className={`fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => onToggleFavorite(movie, e)}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title" title={movie.title || movie.name}>
          {movie.title || movie.name}
        </h3>
        
        <div className="movie-meta">
          <div className="movie-rating">
            <span>⭐</span> {rating}
          </div>
          <div className="movie-year">
            {releaseYear}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default MovieCard;