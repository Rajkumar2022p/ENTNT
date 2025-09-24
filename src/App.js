// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './Home/HomePage';
import LoginPage from './Home/CommonLogin';
import CandidateLoginPage from './Home/CandidateLogic';
import JobDashboard from './components/Jobs/JobDashboard';
import AssessmentBuilder from './components/Assessments/AssessmentBuilder';
import CandidateDashboard from './components/Candidates/CandidateDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Login Pages */}
        <Route path="/JobLogin" element={<LoginPage />} />
        <Route path="/CandidateLogin" element={<CandidateLoginPage />} />

        {/* Dashboards */}
        <Route path="/job-dashboard/:id" element={<JobDashboard />} />
        <Route path="/candidate-dashboard/:id" element={<CandidateDashboard />} />

        {/* Assignments */}
        <Route path="/assignments/:jobId" element={<AssessmentBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
