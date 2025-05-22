import React, { useEffect, useState } from 'react';
import { getMovieDetails, type Movie } from '../services/movieService';
import StarRating from './StarRating';

interface MovieDetailModalProps {
  movieId: number | null;
  onClose: () => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (movieId === null) {
        setMovie(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const movieData = await getMovieDetails(movieId);
        setMovie(movieData);
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

  if (movieId === null) {
    return null; // Don't render if no movie is selected
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent clicks inside from closing modal */}
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        {loading && <p>Loading movie details...</p>}
        {error && <p className="error-message">Error: {error}</p>}
        {movie && (
          <div className="movie-details">
            <h2>{movie.title}</h2>
            {movie.poster_path && (
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="movie-detail-poster" />
            )}
            <div className="modal-rating">
              <p><strong>Rating:</strong></p>
              <StarRating rating={movie.vote_average} />
            </div>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p>{movie.overview}</p>
            {/* Add more details here as needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailModal; 