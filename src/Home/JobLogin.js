
// src/Home/JobLogin.js
import React, { useState } from 'react';

const JobLogin = ({ onLogin, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!onLogin) return console.error('onLogin not passed!');
    const error = await onLogin(email, password);
    setErrorMessage(error || '');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!onSignup) return console.error('onSignup not passed!');
    const error = await onSignup(email, password);
    setErrorMessage(error || '');
  };

  return (
    <div style={loginPageStyle}>
      <form style={formStyle}>
        <h2>Job / Recruiter Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <div style={buttonGroupStyle}>
          <button type="submit" onClick={handleSignIn}>Sign In</button>
          <button type="button" onClick={handleSignUp}>Sign Up</button>
        </div>
      </form>
    </div>
  );
};

const loginPageStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a1a', color: '#fff' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem', background: '#222', padding: '2rem', borderRadius: '12px', width: '300px' };
const buttonGroupStyle = { display: 'flex', justifyContent: 'space-between', gap: '1rem' };

export default JobLogin;
