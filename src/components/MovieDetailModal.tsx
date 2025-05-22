import React, { useEffect, useState } from 'react';
import { getMovieDetails, type Movie } from '../services/movieService';
import StarRating from './StarRating';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../services/watchlistService';

interface MovieDetailModalProps {
  movieId: number | null;
  onClose: () => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMovieInWatchlist, setIsMovieInWatchlist] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (movieId === null) {
        setMovie(null);
        setIsMovieInWatchlist(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const movieData = await getMovieDetails(movieId);
        setMovie(movieData);
        const inWatchlist = await isInWatchlist(movieId);
        setIsMovieInWatchlist(inWatchlist);
      } catch (err: unknown) {
        let errorMessage = 'An unknown error occurred';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        console.error('Failed to fetch movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movieId]);

  const handleToggleWatchlist = async () => {
    if (!movie) return;

    try {
      if (isMovieInWatchlist) {
        await removeFromWatchlist(movie.id);
        setIsMovieInWatchlist(false);
        console.log(`Removed ${movie.title} from watchlist`);
      } else {
        await addToWatchlist(movie);
        setIsMovieInWatchlist(true);
        console.log(`Added ${movie.title} to watchlist`);
      }
    } catch (error) {
      console.error('Failed to toggle watchlist:', error);
    }
  };

  if (movieId === null) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        {loading && <p>Loading movie details...</p>}
        {error && <p className="error-message">Error: {error}</p>}
        {movie && (
          <div className="movie-details">
            <h2>{movie.title}</h2>
            <button 
              className={`watchlist-button modal-button ${isMovieInWatchlist ? 'in-watchlist' : ''}`} 
              onClick={handleToggleWatchlist}
              disabled={loading}
            >
              {isMovieInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
            {movie.poster_path && (
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="movie-detail-poster" />
            )}
            <div className="modal-rating">
              <p><strong>Rating:</strong></p>
              <StarRating rating={movie.vote_average} />
            </div>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p>{movie.overview}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailModal; 