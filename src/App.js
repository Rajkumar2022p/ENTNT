// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Home/HomePage';
import JobLogin from './Home/JobLogin';
import CandidateLogin from './Home/CandidateLogin';
import Layout from './components/common/Layout';
import JobDashboard from './components/Jobs/JobDashboard';
import LoginPage from './Home/CommonLogin';
import AssessmentBuilder from './components/Assessments/AssessmentBuilder';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        // App.js
<Route path="/JobLogin" element={<LoginPage />} />

        
        <Route
          path="/CandidateLogin"
          element={
            <Layout>
              <CandidateLogin />
            </Layout>
          }
        />
        <Route
  path="/job-dashboard/:id"
  element={
    <Layout>
      <JobDashboard />
    </Layout>
  }
/>
<Route path="/assignments/:jobId" element={<AssessmentBuilder />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
