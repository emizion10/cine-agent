import React, { useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';

const HomePage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchTerm, setSearchTerm] = useState('');
  const recommendedMovies = ['Inception', 'The Matrix', 'Interstellar'];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log('Searching for:', term, 'from HomePage');
    // Implement movie filtering/fetching based on term here
  };

  return (
    <div className="home-page">
      <Header />
      <SearchBar onSearch={handleSearch} />
      <section className="curated-picks">
        <h2>AI-Curated Picks for You</h2>
        <p>Based on your simulated viewing history and preferences, CineAgent recommends these films.</p>
        <div className="movie-list">
          {recommendedMovies.map((movieTitle) => (
            <MovieCard key={movieTitle} title={movieTitle} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage; 