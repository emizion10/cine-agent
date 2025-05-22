import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import MovieDetailModal from '../components/MovieDetailModal';
import CircularProgress from '../components/CircularProgress';
import { getPopularMovies, searchMovies, type Movie, type PaginatedResponse } from '../services/movieService';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/watchlistService';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [watchlist, setWatchlist] = useState<number[]>([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const userWatchlist = await getWatchlist();
        setWatchlist(userWatchlist.map(movie => movie.id));
      } catch (err) {
        console.error('Failed to fetch watchlist:', err);
      }
    };
    fetchWatchlist();
  }, []);

  const fetchMovies = async (query: string = '', page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      let data: PaginatedResponse<Movie>;
      if (query) {
        data = await searchMovies(query, page);
      } else {
        data = await getPopularMovies();
      }
      
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies(prevMovies => [...prevMovies, ...data.results]);
      }
      setCurrentPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error('Failed to fetch movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(watchlist.length >= 0) {
      fetchMovies();
    }
  }, [watchlist.length]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    fetchMovies(term, 1);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchMovies(searchTerm, currentPage + 1);
    }
  };

  const handleCardClick = (movieId: number) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
  };

  const handleToggleWatchlist = useCallback(async (movieId: number) => {
    const movieToToggle = movies.find(movie => movie.id === movieId);
    if (!movieToToggle) return;

    try {
      if (watchlist.includes(movieId)) {
        await removeFromWatchlist(movieId);
        setWatchlist(prevWatchlist => prevWatchlist.filter(id => id !== movieId));
        console.log(`Removed ${movieToToggle.title} from watchlist`);
      } else {
        await addToWatchlist(movieToToggle);
        setWatchlist(prevWatchlist => [...prevWatchlist, movieId]);
        console.log(`Added ${movieToToggle.title} to watchlist`);
      }
    } catch (error) {
      console.error('Failed to toggle watchlist:', error);
    }
  }, [movies, watchlist]);

  return (
    <div className="home-page">
      <Header />
      <div className="search-section">
        <SearchBar onSearch={handleSearch} />
      </div>
      <section className="curated-picks">
        <h2>AI-Curated Picks for You</h2>
        {error && <p className="error-message">Error: {error}</p>}
        
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {!loading && movies.length === 0 && !error && <p>No movies found.</p>}
            <div className="movie-list-grid">
              {movies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movieId={movie.id} 
                  title={movie.title} 
                  imageUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined} 
                  rating={movie.vote_average} 
                  onCardClick={handleCardClick}
                  isInWatchlist={watchlist.includes(movie.id)}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              ))}
            </div>
            {movies.length > 0 && currentPage < totalPages && (
              <div className="load-more-container">
                <button onClick={handleLoadMore} className="load-more-button" disabled={loading}>
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </section>
      <MovieDetailModal 
        movieId={selectedMovieId} 
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default HomePage; 