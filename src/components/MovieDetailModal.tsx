import React, { useEffect, useState } from 'react';
import { getMovieDetails } from '../services/movieService';
import StarRating from './StarRating';
import { 
  addToWatchlist, 
  removeFromWatchlist, 
  WatchStatus, 
  updateWatchlistStatus, 
  type WatchlistMovie,
  getWatchlist 
} from '../services/watchlistService';
import { useAuth } from '../context/AuthContext';
import StatusSelector from './StatusSelector';

interface MovieDetailModalProps {
  movieId: number | null;
  onClose: () => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movieId, onClose }) => {
  const { isAuthenticated, token } = useAuth();
  const [movie, setMovie] = useState<WatchlistMovie | null>(null);
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
        if (isAuthenticated) {
          const watchlist = await getWatchlist();
          const watchlistEntry = watchlist.find(item => item.id === movieId);
          if (watchlistEntry) {
            setMovie({
              ...movieData,
              watchlistStatus: watchlistEntry.watchlistStatus,
              watchlistId: watchlistEntry.watchlistId
            });
            setIsMovieInWatchlist(true);
          } else {
            setMovie({
              ...movieData,
              watchlistStatus: WatchStatus.PENDING,
              watchlistId: 0
            });
            setIsMovieInWatchlist(false);
          }
        } else {
          setMovie({
            ...movieData,
            watchlistStatus: WatchStatus.PENDING,
            watchlistId: 0
          });
          setIsMovieInWatchlist(false);
        }
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
  }, [movieId, isAuthenticated, token]);

  const handleToggleWatchlist = async () => {
    if (!isAuthenticated || !token) {
      console.warn('User not authenticated or token missing, cannot toggle watchlist.');
      return;
    }

    if (!movie) return;

    try {
      if (isMovieInWatchlist) {
        await removeFromWatchlist(movie.id);
        setIsMovieInWatchlist(false);
        console.log(`Removed ${movie.title} from watchlist`);
      } else {
        await addToWatchlist(movie, WatchStatus.PENDING);
        setIsMovieInWatchlist(true);
        console.log(`Added ${movie.title} to watchlist`);
      }
    } catch (error) {
      console.error('Failed to toggle watchlist:', error);
    }
  };

  const handleStatusChange = async (newStatus: WatchStatus) => {
    if (!movie) return;
    
    try {
      await updateWatchlistStatus(movie.id, newStatus);
      setMovie(prev => prev ? { ...prev, watchlistStatus: newStatus } : null);
    } catch (error) {
      console.error('Failed to update watchlist status:', error);
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
            <div className="modal-actions">
              <button 
                className={`modal-button ${isMovieInWatchlist ? 'in-watchlist' : ''}`} 
                onClick={handleToggleWatchlist}
                disabled={loading || !isAuthenticated || !token}
              >
                {isMovieInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
              {isMovieInWatchlist && (
                <StatusSelector
                  value={movie.watchlistStatus}
                  onChange={handleStatusChange}
                  disabled={loading || !isAuthenticated || !token}
                />
              )}
            </div>
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