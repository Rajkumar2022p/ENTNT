// src/components/Home/CandidateLogin.js
import React, { useState } from 'react';

const CandidateLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add real validation here, for now just call onLogin
    onLogin(); 
  };

  return (
    <div style={loginPageStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2>Candidate Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const loginPageStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: '#1a1a1a',
  color: '#fff',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  background: '#222',
  padding: '2rem',
  borderRadius: '12px',
  width: '300px',
};

export default CandidateLogin;
