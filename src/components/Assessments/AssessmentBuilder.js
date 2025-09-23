import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { AssessmentSchema } from '../../validations/assessmentschema';
import { db } from '../../db/dexie';
import './AssessmentBuilder.css';

const defaultQuestion = () => ({
  id: uuid(),
  type: 'mcq',
  question: '',
  options: ['', '', '', ''],
  correctAnswer: '',
  marks: 1,
  negativeMarks: 0,
  perQuestionTimer: 60,
});

const AssessmentBuilder = ({ jobId }) => {
  const [title, setTitle] = useState('');
  const [durationInMinutes, setDuration] = useState(30);
  const [questions, setQuestions] = useState([defaultQuestion()]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, defaultQuestion()]);
    setCurrentIndex(questions.length); // show newly added question
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleSubmit = async () => {
    const assessmentData = { title, durationInMinutes, questions };
    const validation = AssessmentSchema.safeParse(assessmentData);

    if (!validation.success) {
      setError('Validation failed. Please check fields.');
      console.error(validation.error.format());
      return;
    }

    try {
      await db.assessments.add({ ...assessmentData, jobId });
      setSuccessMsg('Assessment saved successfully!');
      setError(null);
    } catch (err) {
      console.error('DB error:', err);
      setError('Error saving to database.');
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="assessment-builder">
      <h2>Create / Edit Assessment</h2>
      <input
        type="text"
        placeholder="Assessment Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Duration (minutes)"
        value={durationInMinutes}
        onChange={(e) => setDuration(Number(e.target.value))}
      />

      <div className="builder-container">
        {/* Current Question */}
        <div className="questions-form">
          {currentQuestion && (
            <div className="question-card">
              <h4>Question {currentIndex + 1}</h4>
              <select
                value={currentQuestion.type}
                onChange={(e) =>
                  handleQuestionChange(currentIndex, 'type', e.target.value)
                }
              >
                <option value="mcq">MCQ</option>
                <option value="msq">MSQ</option>
                <option value="long">Long Answer</option>
                <option value="integer">Integer</option>
                <option value="numerical">Numerical</option>
              </select>

              <input
                type="text"
                placeholder="Enter question"
                value={currentQuestion.question}
                onChange={(e) =>
                  handleQuestionChange(currentIndex, 'question', e.target.value)
                }
              />

              {(currentQuestion.type === 'mcq' ||
                currentQuestion.type === 'msq') && (
                <div className="options">
                  <p>Options:</p>
                  {currentQuestion.options.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(currentIndex, i, e.target.value)
                      }
                    />
                  ))}
                </div>
              )}

              <input
                type="text"
                placeholder="Correct Answer"
                value={currentQuestion.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(currentIndex, 'correctAnswer', e.target.value)
                }
              />

              {/* Last three fields with headings */}
              <div className="question-meta">
                <label>Marks</label>
                <input
                  type="number"
                  value={currentQuestion.marks}
                  onChange={(e) =>
                    handleQuestionChange(currentIndex, 'marks', Number(e.target.value))
                  }
                />

                <label>Negative Marks</label>
                <input
                  type="number"
                  value={currentQuestion.negativeMarks}
                  onChange={(e) =>
                    handleQuestionChange(
                      currentIndex,
                      'negativeMarks',
                      Number(e.target.value)
                    )
                  }
                />

                <label>Timer (seconds)</label>
                <input
                  type="number"
                  value={currentQuestion.perQuestionTimer}
                  onChange={(e) =>
                    handleQuestionChange(
                      currentIndex,
                      'perQuestionTimer',
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <button
                className="remove-btn"
                onClick={() => removeQuestion(currentIndex)}
              >
                Remove Question
              </button>
            </div>
          )}
        </div>

        {/* Question Numbers Panel */}
        <div className="questions-panel">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              className={`question-number-btn ${
                currentIndex === idx ? 'active' : ''
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              {idx + 1}
            </button>
          ))}
          <button onClick={addQuestion} style={{ marginTop: '1rem' }}>
            +
          </button>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleSubmit}>Save Assessment</button>
      </div>

      {error && <p className="error-msg">{error}</p>}
      {successMsg && <p className="success-msg">{successMsg}</p>}
    </div>
  );
};

export default AssessmentBuilder;
