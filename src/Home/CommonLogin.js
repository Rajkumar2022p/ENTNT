// src/Home/LoginPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db/dexie';
import JobLogin from './JobLogin';

const LoginPage = () => {
  const navigate = useNavigate();

  const onLogin = async (email, password) => {
    const user = await db.table('users').where({ email, role: 'job' }).first();
    if (!user) return 'User not found. Please sign up first.';
    if (user.password !== password) return 'Incorrect password.';
    navigate(`/job-dashboard/${user.id}`);
    return null;
  };

  const onSignup = async (email, password) => {
    const existingUser = await db.table('users').where({ email, role: 'job' }).first();
    if (existingUser) return 'User already exists. Please sign in.';
    const id = await db.table('users').add({ email, password, role: 'job' });
    navigate(`/job-dashboard/${id}`);
    return null;
  };

  return <JobLogin onLogin={onLogin} onSignup={onSignup} />;
};

export default LoginPage;
