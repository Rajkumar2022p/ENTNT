
// src/Home/CandidateLoginPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db/dexie';
import CandidateLogin from './CandidateLogin';

const CandidateLoginPage = () => {
  const navigate = useNavigate();

  const onLogin = async (email, password) => {
    const user = await db.table('users').where({ email, role: 'candidate' }).first();
    if (!user) return 'Candidate not found. Please sign up first.';
    if (user.password !== password) return 'Incorrect password.';
    navigate(`/candidate-dashboard/${user.id}`);
    return null;
  };

  const onSignup = async (email, password) => {
    const existingUser = await db.table('users').where({ email, role: 'candidate' }).first();
    if (existingUser) return 'Candidate already exists. Please sign in.';
    const id = await db.table('users').add({ email, password, role: 'candidate' });
    navigate(`/candidate-dashboard/${id}`);
    return null;
  };

  return <CandidateLogin onLogin={onLogin} onSignup={onSignup} />;
};

export default CandidateLoginPage;
