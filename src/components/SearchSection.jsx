import React from 'react';

const SearchSection = ({
  moodQuery,
  setMoodQuery,
  handleAiSearch,
  isAiLoading,
  searchInputRef,
  searchQuery,
  setSearchQuery,
  isListening,
  startVoiceSearch
}) => {
  return (
    <div className="search-ai-container">
      
      {/* Box 1: Normal Search Input Area */}
      <div className="search-box">
        <h3>Search Movies</h3>
        <div className="input-group">
          <span className="icon">🔍</span>
          <input 
            ref={searchInputRef}
            type="text" 
            /* Clean, concise placeholder for better UI */
            placeholder="Search movies..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          <button 
            type="button" 
            onClick={startVoiceSearch} 
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            title="Voice Search"
          >
            🎤
          </button>
        </div>
        <p className="subtext">Start typing to search movies (debounced - 500ms)</p>
      </div>

      {/* Box 2: AI Mood Matcher Input Area */}
      <div className="ai-box">
        <h3>✨ Mood Matcher (AI)</h3>
        <form onSubmit={handleAiSearch} className="input-group">
          <input 
            type="text" 
            /* Updated AI placeholder to provide clear examples */
            placeholder="Describe your mood (Happy, Sad, Action...)" 
            value={moodQuery} 
            onChange={(e) => setMoodQuery(e.target.value)} 
          />
          <button type="submit" className="red-btn" disabled={isAiLoading}>
            {isAiLoading ? 'Thinking...' : 'Suggest Movie ✨'}
          </button>
        </form>
        <p className="subtext">AI will suggest a movie that matches your mood</p>
      </div>

    </div>
  );
};

export default SearchSection;