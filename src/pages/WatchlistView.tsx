import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import MovieDetailModal from '../components/MovieDetailModal';
import { getWatchlist } from '../services/watchlistService';
import { type Movie } from '../services/movieService';

const WatchlistView: React.FC = () => {
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const movies = await getWatchlist();
        setWatchlistMovies(movies);
      } catch (err: unknown) {
        let errorMessage = 'An unknown error occurred';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        console.error('Failed to fetch watchlist:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  const handleCardClick = (movieId: number) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
    // Refresh watchlist after closing modal in case a movie was removed
    const fetchWatchlist = async () => {
        try {
          const movies = await getWatchlist();
          setWatchlistMovies(movies);
        } catch (err) {
          console.error('Failed to refresh watchlist:', err);
        }
      };
      fetchWatchlist();
  };

  // Although the remove logic is in the modal, having a placeholder here might be useful later
  const handleToggleWatchlist = async () => {
      // This function is needed by MovieCard but actual removal will be handled by modal
      // For now, just refetch the list to reflect changes from modal
       const fetchWatchlist = async () => {
          try {
            const movies = await getWatchlist();
            setWatchlistMovies(movies);
          } catch (err) {
            console.error('Failed to refresh watchlist:', err);
          }
        };
        fetchWatchlist();
  };

  return (
    <div className="watchlist-view">
      <Header />
      <section className="watchlist-content">
        <h2>My Watchlist</h2>
        {loading && <p>Loading watchlist...</p>}
        {error && <p className="error-message">Error: {error}</p>}
        {!loading && watchlistMovies.length === 0 && !error && <p>Your watchlist is empty.</p>}
        <div className="movie-list-grid"> {/* Reuse the same grid class */}
          {watchlistMovies.map((movie) => (
             <MovieCard 
                key={movie.id} 
                movieId={movie.id} 
                title={movie.title} 
                imageUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined} 
                rating={movie.vote_average} 
                onCardClick={handleCardClick}
                isInWatchlist={true} // Always true in watchlist view
                onToggleWatchlist={handleToggleWatchlist} // Pass toggle handler
              />
          ))}
        </div>
      </section>
       <MovieDetailModal 
        movieId={selectedMovieId} 
        onClose={handleCloseModal}
        // Modal will handle its own watchlist status and toggling
      />
    </div>
  );
};

export default WatchlistView; 