import React from 'react';
import { AlertCircle } from 'lucide-react';
import './ErrorState.css';

const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <div className="error-state">
    <AlertCircle size={48} className="error-icon" />
    <p>{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="retry-btn">Try Again</button>
    )}
  </div>
);
export default ErrorState;