// src/Home/LoginPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db/dexie';
import JobLogin from './JobLogin';

const LoginPage = () => {
  const navigate = useNavigate();

  const onLogin = async (email, password) => {
    const user = await db.table('users').where({ email, role: 'job' }).first();
    if (!user) {
      alert('User not found');
      return;
    }
    if (user.password !== password) {
      alert('Incorrect password');
      return;
    }
    navigate('/job-dashboard');
  };

  const onSignup = async (email, password) => {
    const existingUser = await db.table('users').where({ email, role: 'job' }).first();
    if (existingUser) {
      alert('User already exists');
      return;
    }
    await db.table('users').add({ email, password, role: 'job' });
    alert('Sign up successful!');
    navigate('/job-dashboard');
  };

  return <JobLogin onLogin={onLogin} onSignup={onSignup} />;
};

export default LoginPage;
