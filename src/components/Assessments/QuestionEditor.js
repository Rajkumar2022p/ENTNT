// src/components/Assessments/QuestionEditor.js
import React, { useState } from 'react';

const QuestionEditor = ({ onAddQuestion }) => {
  const [question, setQuestion] = useState('');

  const handleAdd = () => {
    if (question.trim()) {
      onAddQuestion(question);
      setQuestion('');
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>Add Questions</h3>
      <input
        type="text"
        placeholder="Type your question here"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />
      <button onClick={handleAdd}>Add Question</button>
    </div>
  );
};

export default QuestionEditor;
