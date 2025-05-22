import React from 'react';

interface MovieCardProps {
  title: string;
  imageUrl?: string;
  // Add other movie details like image, etc.
}

const MovieCard: React.FC<MovieCardProps> = ({ title, imageUrl }) => {
  return (
    <div className="movie-card">
      <div className="movie-image-placeholder">
        {imageUrl ? (
          <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span>No Image Available</span>
        )}
        <div className="options-button">...</div>
      </div>
      <div className="movie-title">{title}</div>
    </div>
  );
};

export default MovieCard; 