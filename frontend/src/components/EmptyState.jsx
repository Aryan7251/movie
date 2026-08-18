import React from 'react';
import { SearchX } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ message = "No movies found." }) => (
  <div className="empty-state">
    <SearchX size={48} className="empty-icon" />
    <p>{message}</p>
  </div>
);
export default EmptyState;