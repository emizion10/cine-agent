import React from 'react';

interface StarRatingProps {
  rating: number; // Rating out of 10 (assuming) based on themoviedb
  maxRating?: number; // Maximum rating value, default is 10
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 10 }) => {
  const starCount = 5; // Number of stars to display
  const filledStars = Math.round((rating / maxRating) * starCount);
  const stars = [];

  for (let i = 0; i < starCount; i++) {
    if (i < filledStars) {
      stars.push(<span key={i} className="star filled">&#9733;</span>); // Filled star (★)
    } else {
      stars.push(<span key={i} className="star empty">&#9734;</span>); // Empty star (☆)
    }
  }

  return (
    <div className="star-rating">
      {stars}
    </div>
  );
};

export default StarRating; 