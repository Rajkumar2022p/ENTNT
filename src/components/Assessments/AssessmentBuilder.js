// src/components/Assessments/AssessmentBuilder.js
import React, { useState } from 'react';

const AssessmentBuilder = ({ onTitleChange, onDescChange }) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>Assessment Info</h3>
      <input
        type="text"
        placeholder="Enter Assessment Title"
        onChange={(e) => onTitleChange(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
      />
      <textarea
        placeholder="Enter Description"
        onChange={(e) => onDescChange(e.target.value)}
        style={{ width: '100%', height: '80px', padding: '0.5rem' }}
      />
    </div>
  );
};

export default AssessmentBuilder;
