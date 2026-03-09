import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Loading...", size = "medium", fullScreen = false }) => {
  return (
    <div className={`loading-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className={`loading-spinner ${size}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <div className="loading-message">{message}</div>
    </div>
  );
};

export default LoadingSpinner;
