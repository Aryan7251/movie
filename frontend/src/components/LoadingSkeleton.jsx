import React from 'react';
import './LoadingSkeleton.css';

export const MovieCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-poster pulse"></div>
    <div className="skeleton-text title pulse"></div>
    <div className="skeleton-text meta pulse"></div>
  </div>
);

const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
};
export default LoadingSkeleton;