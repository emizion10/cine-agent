import React, { useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedMovies, setDisplayedMovies] = useState(8); // Start with 8 movies (2 rows of 4)

  // In a real app, you'd fetch movies based on search term or recommendations
  const allRecommendedMovies = [
    'Inception', 'The Matrix', 'Interstellar', 'Parasite',
    'Nomadland', 'Dune', 'Blade Runner 2049', 'Arrival',
    'Mad Max: Fury Road', 'The Martian', 'Ex Machina', 'Arrival',
    'Moonlight', 'La La Land', 'Get Out', 'Shape of Water',
    'Black Panther', 'Spider-Man: Into the Spider-Verse',
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log('Searching for:', term, 'from HomePage');
    // Reset displayed count on search
    setDisplayedMovies(8);
  };

  const handleLoadMore = () => {
    setDisplayedMovies(prevCount => prevCount + 8); // Load 8 more movies
  };

  const filteredMovies = allRecommendedMovies.filter(movie =>
    movie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const moviesToDisplay = filteredMovies.slice(0, displayedMovies);

  return (
    <div className="home-page">
      <Header />
      <div className="search-section">
        <SearchBar onSearch={handleSearch} />
      </div>
      <section className="curated-picks">
        <h2>AI-Curated Picks for You</h2>
        <p>Based on your simulated viewing history and preferences, CineAgent recommends these films.</p>
        <div className="movie-list-grid">
          {moviesToDisplay.map((movieTitle) => (
            <MovieCard key={movieTitle} title={movieTitle} />
          ))}
        </div>
        {displayedMovies < filteredMovies.length && (
          <div className="load-more-container">
            <button onClick={handleLoadMore} className="load-more-button">
              Load More
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage; 