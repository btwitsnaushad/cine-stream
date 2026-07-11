import './Home.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import MovieModal from './MovieModal';
import SearchSection from './SearchSection';
import FilterTabs from './FilterTabs';
import MovieGrid from './MovieGrid';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  
  const [moodQuery, setMoodQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [toast, setToast] = useState(null);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeTab, setActiveTab] = useState('popular'); 
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [searchHistory, setSearchHistory] = useState(JSON.parse(localStorage.getItem('searchHistory')) || []);
  const [isListening, setIsListening] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copied, setCopied] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);

  const loaderRef = useRef(null);
  const searchInputRef = useRef(null); 

  // Initialize local storage data and network listeners on component mount
  useEffect(() => {
    const savedFavs = JSON.parse(localStorage.getItem('favorites')) || [];
    const savedRecents = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    setFavorites(savedFavs);
    setRecentlyViewed(savedRecents);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Global keyboard shortcut ('/') to focus the search input
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Update application theme based on user selection
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Implement debouncing for search input to minimize API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      const trimmedQuery = searchQuery.trim();
      
      if (trimmedQuery.length > 2 && !searchHistory.includes(trimmedQuery)) {
        const newHistory = [trimmedQuery, ...searchHistory].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination when search parameters change
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, activeTab, selectedGenre, sortBy]);

  // Centralized function to fetch movies from TMDB API
  const fetchMovies = useCallback(async () => {
    if (activeTab === 'recently_viewed') {
      setMovies(recentlyViewed);
      setIsLoading(false);
      return;
    }

    if (page === 1) setIsLoading(true);
    setError(false);
    
    try {
      const apiKey = import.meta.env.VITE_TMDB_KEY;
      let endpoint = 'movie/popular';
      let extraParams = '';

      if (debouncedQuery.trim() !== '') {
        endpoint = 'search/movie';
        extraParams = `&query=${debouncedQuery}`;
      } else if (activeTab === 'trending') {
        endpoint = 'trending/movie/day';
      } else if (activeTab === 'top_rated') {
        endpoint = 'movie/top_rated';
      } else if (activeTab === 'popular') {
        endpoint = 'discover/movie';
        extraParams = `&sort_by=${sortBy}${selectedGenre ? `&with_genres=${selectedGenre}` : ''}`;
      }

      const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&page=${page}${extraParams}`;
      const response = await axios.get(url);

      if (page === 1) {
        setMovies(response.data.results);
      } else {
        setMovies((prev) => {
          const newMovies = response.data.results.filter(newMovie => !prev.some(m => m.id === newMovie.id));
          return [...prev, ...newMovies];
        });
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, page, activeTab, selectedGenre, sortBy, recentlyViewed]);

  // Trigger movie fetch on dependency updates
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Intersection Observer for Infinite Scrolling mechanism
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading && !error && !selectedMovie && activeTab !== 'recently_viewed') {
        setPage((prev) => prev + 1);
      }
    });
    
    if (loaderRef.current) observer.observe(loaderRef.current);
    
    return () => { if (loaderRef.current) observer.disconnect(); };
  }, [isLoading, error, selectedMovie, activeTab]);

  // Handle adding and removing movies from Favorites
  const toggleFavorite = (movie, e) => {
    if (e) e.stopPropagation();
    
    let updatedFavs = [...favorites];
    const isFav = updatedFavs.some((fav) => fav.id === movie.id);
    
    if (isFav) {
      updatedFavs = updatedFavs.filter((fav) => fav.id !== movie.id);
      setToast('❌ Removed from Favorites');
    } else {
      updatedFavs.push(movie);
      setToast('❤️ Added to Favorites');
    }
    
    setFavorites(updatedFavs);
    localStorage.setItem('favorites', JSON.stringify(updatedFavs));

    // Dispatch custom event to instantly update the favorites counter in Navbar
    window.dispatchEvent(new Event('favoritesUpdated'));

    setTimeout(() => setToast(null), 2000);
  };

  // Open modal and fetch similar movies on movie card click
  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);
    setCopied(false);
    
    let updatedRecents = [movie, ...recentlyViewed.filter(m => m.id !== movie.id)].slice(0, 20);
    setRecentlyViewed(updatedRecents);
    localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecents));

    try {
      const apiKey = import.meta.env.VITE_TMDB_KEY;
      const url = `https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=${apiKey}`;
      const res = await axios.get(url);
      setSimilarMovies(res.data.results.slice(0, 5)); 
    } catch (err) {
      console.error('Failed to fetch similar movies');
    }
  };

  // Integrate Google Gemini AI for mood-based movie suggestions
  const handleAiSearch = async (e) => {
    e.preventDefault();
    if (!moodQuery.trim()) return;
    setIsAiLoading(true);
    
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `Suggest ONE single movie title based on this mood: "${moodQuery}". Return ONLY the exact movie title as a plaintext string. Do not include quotes, explanations, years, or any other text. Just the title.`;
      
      const result = await model.generateContent(prompt);
      setSearchQuery(result.response.text().trim());
      setMoodQuery('');
    } catch (err) {
      console.error('AI Integration Error:', err);
      alert('Failed to generate AI suggestion.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Initialize Speech Recognition for Voice Search functionality
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => setSearchQuery(event.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // Handle sharing movie URL to clipboard
  const handleShare = () => {
    const url = `https://www.themoviedb.org/movie/${selectedMovie.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Loading Progress Bar & Offline Banner */}
      {(isLoading || isAiLoading) && <div className="progress-bar"></div>}
      {isOffline && <div className="offline-banner">⚠ No Internet Connection. Check your network.</div>}

      {/* Hero Section: Search and AI Mood Matcher */}
      <SearchSection 
        moodQuery={moodQuery}
        setMoodQuery={setMoodQuery}
        handleAiSearch={handleAiSearch}
        isAiLoading={isAiLoading}
        searchInputRef={searchInputRef}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isListening={isListening}
        startVoiceSearch={startVoiceSearch}
        isLoading={isLoading}
        searchHistory={searchHistory}
      />

      {/* Filter Options and Category Tabs */}
      <FilterTabs 
        searchQuery={searchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Main Movie Content Grid with Infinite Scrolling */}
      <MovieGrid 
        isLoading={isLoading}
        error={error}
        page={page}
        movies={movies}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        handleMovieClick={handleMovieClick}
        activeTab={activeTab}
        loaderRef={loaderRef}
        fetchMovies={fetchMovies}
        clearSearch={() => setSearchQuery('')} 
      />

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          isFavorite={favorites.some((f) => f.id === selectedMovie.id)} 
          onToggleFavorite={toggleFavorite} 
          onShare={handleShare} 
          copied={copied} 
          similarMovies={similarMovies} 
          onMovieClick={handleMovieClick} 
        />
      )}

      {/* Floating Action Button for Scroll to Top */}
      {showScrollTop && (
        <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>⬆</button>
      )}

      {/* Global Toast Notification */}
      {toast && <div className="toast-notification">{toast}</div>}
    </div>
  );
};

export default Home;