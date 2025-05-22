import React from 'react';
import StarRating from './StarRating';

interface MovieCardProps {
  title: string;
  imageUrl?: string;
  movieId: number;
  rating: number;
  onCardClick: (movieId: number) => void;
  // Add other movie details like image, etc.
}

const MovieCard: React.FC<MovieCardProps> = ({ title, imageUrl, movieId, rating, onCardClick }) => {
  return (
    <div className="movie-card" onClick={() => onCardClick(movieId)}>
      <div className="movie-image-placeholder">
        {imageUrl ? (
          <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span>No Image Available</span>
        )}
        <div className="options-button">...</div>
      </div>
      <div className="movie-title">{title}</div>
      <StarRating rating={rating} />
    </div>
  );
};

export default MovieCard; 