// src/components/common/GlobalLoader.js
import React from 'react';
import './Loader.css';

const Loader = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
