import React from 'react';

interface MovieCardProps {
  title: string;
  // Add other movie details like image, etc.
}

const MovieCard: React.FC<MovieCardProps> = ({ title }) => {
  return (
    <div className="movie-card">
      <div className="movie-image-placeholder">{/* Image goes here */}
        <div className="options-button">...</div>
      </div>
      <div className="movie-title">{title}</div>
    </div>
  );
};

export default MovieCard; 