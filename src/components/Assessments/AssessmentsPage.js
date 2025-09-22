import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OnlineUsers from './Sidebar/OnlineUsers';
import Achievements from './Sidebar/Achievments';
import Reminders from './Sidebar/Reminders';

const AssignmentsPage = ({ onAssignmentCreated }) => {
  const { state } = useLocation();
  const job = state?.job;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);

  const addQuestion = (q) => setQuestions((prev) => [...prev, q]);

  const handleSubmit = () => {
    console.log('Assignment Created:', { job, title, description, questions });
    if (onAssignmentCreated) onAssignmentCreated(job.id);
    navigate('/'); // Back to JobsBoard
  };

  return (
    <div style={{ display: 'flex', padding: '2rem', gap: '2rem' }}>
      {/* Left: Assignment Builder */}
      <div style={{ flex: 3 }}>
        <h2>Create Assignment for: {job?.title}</h2>
        <p>{job?.description}</p>

        <input
          type="text"
          placeholder="Assignment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Assignment Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />

        <h3>Questions</h3>
        {questions.map((q, i) => (
          <div key={i} style={styles.questionCard}>
            Q{i + 1}: {q}
          </div>
        ))}
        <QuestionInput onAddQuestion={addQuestion} />

        <button style={styles.submitButton} onClick={handleSubmit}>
          Create Assignment
        </button>
      </div>

      {/* Right Sidebar */}
      <div style={{ flex: 1 }}>
        <UserCard />
        <OnlineUsers />
        <Achievements />
        <Reminders />
      </div>
    </div>
  );
};

export default AssignmentsPage;

// Question Input
const QuestionInput = ({ onAddQuestion }) => {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim()) {
      onAddQuestion(text.trim());
      setText('');
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <input
        type="text"
        placeholder="Enter question"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '80%', padding: '0.5rem' }}
      />
      <button onClick={handleAdd} style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}>
        Add
      </button>
    </div>
  );
};

// User Card
const UserCard = () => (
  <div style={{
    marginBottom: '1rem',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center'
  }}>
    <img
      src="https://via.placeholder.com/50"
      alt="user"
      style={{ borderRadius: '50%', marginBottom: '0.5rem' }}
    />
    <div>John Doe</div>
  </div>
);

const styles = {
  input: { display: 'block', width: '100%', padding: '0.5rem', marginBottom: '1rem' },
  textarea: { display: 'block', width: '100%', padding: '0.5rem', minHeight: '80px', marginBottom: '1rem' },
  submitButton: { marginTop: '1rem', padding: '0.5rem 1rem', background: 'green', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  questionCard: { padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' },
};
