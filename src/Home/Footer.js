// src/components/common/Footer.js
import React from 'react';
import './Footer.css';

export const JobFooter = () => (
  <footer className="footer">
    <h4>Quick Links - Job / Recruiter</h4>
    <ul>
      <li>Create Job</li>
      <li>Manage Assignments</li>
      <li>View Candidates</li>
      <li>Reports</li>
    </ul>
  </footer>
);

export const CandidateFooter = () => (
  <footer className="footer">
    <h4>Quick Links - Candidate</h4>
    <ul>
      <li>Assignments</li>
      <li>Profile</li>
      <li>Progress</li>
      <li>Support</li>
    </ul>
  </footer>
);
