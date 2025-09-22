// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Home/HomePage';
import JobLogin from './Home/JobLogin';
import CandidateLogin from './Home/CandidateLogin';
import Layout from './components/common/Layout';

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
        <Route
          path="/JobLogin"
          element={
            <Layout>
              <JobLogin />
            </Layout>
          }
        />
        <Route
          path="/CandidateLogin"
          element={
            <Layout>
              <CandidateLogin />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
