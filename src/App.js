import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Home/HomePage';
import JobLogin from './Home/JobLogin';
import CandidateLogin from './Home/CandidateLogin';
import JobsBoard from './components/Jobs/JobsBoard';
import CandidateDashboard from './components/Candidates/CandidateDashboard';

function App() {
  const [role, setRole] = useState(null); // "job" or "candidate"

  return (
    <BrowserRouter>
      <Routes>
        {!role && (
          <Route
            path="/"
            element={
              <HomePage
                onJobLogin={() => setRole('job')}
                onCandidateLogin={() => setRole('candidate')}
              />
            }
          />
        )}

        {role === 'job' && (
          <>
            <Route path="/login" element={<JobLogin onLogin={() => setRole('job')} />} />
            <Route path="/jobs" element={<JobsBoard />} />
          </>
        )}

        {role === 'candidate' && (
          <>
            <Route path="/login" element={<CandidateLogin onLogin={() => setRole('candidate')} />} />
            <Route path="/dashboard" element={<CandidateDashboard />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
