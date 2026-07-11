import React from 'react';

const FilterTabs = ({
  searchQuery,
  activeTab,
  setActiveTab,
  selectedGenre,
  setSelectedGenre,
  sortBy,
  setSortBy
}) => {
  if (searchQuery) return null;

  return (
    <>
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'popular' ? 'active' : ''}`} onClick={() => setActiveTab('popular')}>🔥 Popular</button>
        <button className={`tab-btn ${activeTab === 'trending' ? 'active' : ''}`} onClick={() => setActiveTab('trending')}>📈 Trending</button>
        <button className={`tab-btn ${activeTab === 'top_rated' ? 'active' : ''}`} onClick={() => setActiveTab('top_rated')}>⭐ Top Rated</button>
        <button className={`tab-btn ${activeTab === 'recently_viewed' ? 'active' : ''}`} onClick={() => setActiveTab('recently_viewed')}>🕒 Recently</button>
      </div>

      {activeTab === 'popular' && (
        <div className="filters-container">
          <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="filter-dropdown">
            <option value="">All Genres</option>
            <option value="28">Action</option>
            <option value="35">Comedy</option>
            <option value="18">Drama</option>
            <option value="27">Horror</option>
            <option value="16">Animation</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-dropdown">
            <option value="popularity.desc">Sort By: Popularity</option>
            <option value="vote_average.desc">Sort By: ⭐ Rating</option>
            <option value="primary_release_date.desc">Sort By: 📅 Latest</option>
            <option value="original_title.asc">Sort By: A-Z</option>
          </select>
        </div>
      )}
    </>
  );
};

export default FilterTabs;