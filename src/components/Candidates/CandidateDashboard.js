import React, { useState, useEffect } from 'react';
import CandidateCard from './CandidateCard';
import './CandidateDashboard.css';

// Mock candidate data
const initialCandidateJobs = [
  {
    jobId: 1,
    title: 'Frontend Developer',
    description: 'React & JS',
    assignments: [
      { id: 101, title: 'React Basics', deadline: '2025-09-25', time: '2h', prerequisites: ['React Docs.pdf'] },
      { id: 102, title: 'JS Advanced', deadline: '2025-09-28', time: '3h', prerequisites: [] },
    ],
  },
  {
    jobId: 2,
    title: 'Backend Developer',
    description: 'Node.js & Express',
    assignments: [
      { id: 201, title: 'Express Routing', deadline: '2025-09-27', time: '2h', prerequisites: [] },
    ],
  },
];

const CandidateDashboard = () => {
  const [candidateJobs, setCandidateJobs] = useState([]);

  useEffect(() => {
    // Fetch jobs assigned to candidate (for now we use mock data)
    setCandidateJobs(initialCandidateJobs);
  }, []);

  return (
    <div className="candidate-dashboard-container">
      <h1>My Jobs & Assignments</h1>
      <div className="candidate-jobs-container">
        {candidateJobs.length > 0 ? (
          candidateJobs.map((job) => (
            <CandidateCard key={job.jobId} job={job} />
          ))
        ) : (
          <p>No jobs assigned yet.</p>
        )}
      </div>

      <div className="new-job-posting">
        <h2>New Job Postings</h2>
        <p>Currently no new job postings.</p>
      </div>
    </div>
  );
};

export default CandidateDashboard;
