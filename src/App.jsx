import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import Home from './components/Home';
import Favorites from './components/Favorites';
import './App.css';

function App() {
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    // FOOLPROOF SYNC: Checks local storage every 500ms
    const syncFavorites = setInterval(() => {
      const favs = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavCount(favs.length);
    }, 500);

    return () => clearInterval(syncFavorites);
  }, []);

  return (
    <div className="app-container">
      
      {/* Premium Cinematic Navigation Bar */}
      <header className="app-header">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          <span className="text-red">Cine</span>-Stream
        </Link>
        
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Home
          </NavLink>
          
          <NavLink to="/favorites" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Favorites <span className="fav-count">❤️ {favCount}</span>
          </NavLink>
        </nav>
      </header>

      {/* Routes Configuration */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>

      {/* =========================================
          GLOBAL ENTERPRISE FOOTER
          (Visible on all pages)
          ========================================= */}
      <footer className="app-footer">
        <div className="footer-content">
          
          <div className="footer-section">
            <h4 className="footer-heading"><span>|</span> About CineStream</h4>
            <p>Discover your next favorite movie.</p>
            <p>Powered by TMDB API.</p>
            <p>Built with React.</p>
            <div className="social-links">
              <span className="social-icon">🐦</span>
              <span className="social-icon">🐙</span>
              <span className="social-icon">💼</span>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading"><span>|</span> Features</h4>
            <ul className="footer-list">
              <li><strong>⇄ Infinite Scroll</strong><br/>Seamless browsing experience</li>
              <li><strong>🔍 Debounced Search</strong><br/>Optimized API calls</li>
              <li><strong>✨ AI Mood Matcher</strong><br/>Find movies for your mood</li>
              <li><strong>❤️ Favorites</strong><br/>Save and access your favorites</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading"><span>|</span> How to Use</h4>
            <ul className="footer-steps">
              <li><span className="step-num">1</span> Search for movies using the search box</li>
              <li><span className="step-num">2</span> Or try Mood Matcher for AI recommendations</li>
              <li><span className="step-num">3</span> Click the heart icon to add to favorites</li>
              <li><span className="step-num">4</span> Visit Favorites page to see your saved movies</li>
            </ul>
          </div>

        </div>
        
        <div className="footer-bottom">
          <p>Made with ❤️ by CineStream Team &nbsp; | &nbsp; Powered by TMDB API</p>
        </div>
      </footer>
      
    </div>
  );
}

export default App;
