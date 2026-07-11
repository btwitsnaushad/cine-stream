import React from 'react';

// Standard TMDB Genre Mapping to convert IDs to Names
const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

const MovieModal = ({ movie, onClose, isFavorite, onToggleFavorite, onShare, copied, similarMovies, onMovieClick }) => {

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://placehold.co/500x750/18181b/ffffff?text=No+Poster';
  
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : 'Unknown';
  const language = movie.original_language ? movie.original_language.toUpperCase() : 'EN';

  const genreNames = movie.genre_ids 
    ? movie.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean).join(' • ')
    : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* NEW: Close Button with ESC Hint */}
        <div className="close-container">
          <button className="modal-close-btn" onClick={onClose} title="Close">✕</button>
          <span className="esc-hint">ESC</span>
        </div>

        <div className="modal-body">
          
          {/* Poster Area */}
          <div className="modal-poster-container">
            <img src={posterUrl} alt={movie.title} className="modal-poster" />
          </div>

          {/* Content Area */}
          <div className="modal-info">
            <h2 className="modal-title">{movie.title || movie.name}</h2>
            
            {/* Meta Tags - Redesigned like the mock */}
            <div className="modal-meta">
              <div className="modal-badge rating-badge">
                <span className="star-icon">★</span> {rating} <span className="rating-max">/10</span>
              </div>
              <div className="modal-badge">🗓️ {releaseYear}</div>
              <div className="modal-badge">🌐 {language}</div>
            </div>

            {/* Genres */}
            {genreNames && (
              <div className="modal-genres">
                🎭 {genreNames}
              </div>
            )}

            {/* Description */}
            <div className="modal-desc-container">
              <p className="modal-desc">{movie.overview || "No description available for this movie."}</p>
            </div>

            {/* Buttons - Redesigned like the mock */}
            <div className="modal-actions">
              <button 
                className={`modal-btn fav-btn ${isFavorite ? 'active' : ''}`}
                onClick={(e) => onToggleFavorite(movie, e)}
              >
                {isFavorite ? '💜 Remove Favorite' : '🤍 Add to Favorites'}
              </button>
              
              <button className="modal-btn share-btn" onClick={onShare}>
                {copied ? '✅ Copied!' : '🔗 Share Link'}
              </button>
            </div>

            {/* Similar Movies */}
            {similarMovies && similarMovies.length > 0 && (
              <div className="similar-movies-section">
                <h3>Similar Movies</h3>
                <div className="similar-movies-list">
                  {similarMovies.map(sim => (
                    <div key={sim.id} className="similar-movie-card" onClick={() => onMovieClick(sim)}>
                      <img 
                        src={sim.poster_path ? `https://image.tmdb.org/t/p/w200${sim.poster_path}` : 'https://placehold.co/200x300/18181b/ffffff?text=No+Poster'} 
                        alt={sim.title || sim.name} 
                      />
                      <div className="similar-movie-info">
                        <p>{sim.title || sim.name}</p>
                        {/* Purple Star for Similar Movies */}
                        <span><span className="purple-star">★</span> {sim.vote_average ? sim.vote_average.toFixed(1) : 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;