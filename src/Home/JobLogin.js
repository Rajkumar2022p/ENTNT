// src/Home/JobLogin.js
import React, { useState } from 'react';

const JobLogin = ({ onLogin, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    if (onLogin) onLogin(email, password);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (onSignup) onSignup(email, password);
  };

  return (
    <div style={loginPageStyle}>
      <form style={formStyle}>
        <h2>Job / Recruiter Login</h2>
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
        <div style={buttonGroupStyle}>
          <button type="submit" onClick={handleSignIn}>Sign In</button>
          <button type="button" onClick={handleSignUp}>Sign Up</button>
        </div>
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

const buttonGroupStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
};

export default JobLogin;
