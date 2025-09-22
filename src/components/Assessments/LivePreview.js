// src/components/Assessments/LivePreview.js
import React from 'react';

const LivePreview = ({ title, description, questions }) => {
  return (
    <div>
      <h3>Live Preview</h3>
      <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
        <h4>{title || 'Untitled Quiz'}</h4>
        <p>{description || 'No description provided.'}</p>
        <ol>
          {questions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default LivePreview;
