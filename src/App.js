// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './Home/HomePage';
import LoginPage from './Home/CommonLogin';
import CandidateLogic from './Home/CandidateLogic';
import Layout from './components/common/Layout';
import JobDashboard from './components/Jobs/JobDashboard';
import AssessmentBuilder from './components/Assessments/AssessmentBuilder';
import CandidateDashboard from './components/Candidates/CandidateDashboard';
// import CandidateExam from './components/Candidates/CandidateExam';
import CandidateDummyExam from './components/Candidates/CandidatesdummyExam'; // <-- new dummy exam

// MirageJS server
import { makeServer } from './mirage/server';

if (process.env.NODE_ENV === 'development') {
  makeServer();
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />

        {/* Login Pages */}
        <Route
          path="/JobLogin"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/CandidateLogin"
          element={
            <Layout>
              <CandidateLogic />
            </Layout>
          }
        />

        {/* Dashboards */}
        <Route
          path="/job-dashboard/:id"
          element={
            <Layout>
              <JobDashboard />
            </Layout>
          }
        />
        <Route
          path="/candidate-dashboard/:id"
          element={
            <Layout>
              <CandidateDashboard />
            </Layout>
          }
        />

        {/* Assessments */}
        <Route
          path="/assignments/:jobId"
          element={
            <Layout>
              <AssessmentBuilder />
            </Layout>
          }
        />
        <Route
          path="/dummy"
          element={
            <Layout>
              <CandidateDummyExam /> {/* <-- replaced with dummy exam */}
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
