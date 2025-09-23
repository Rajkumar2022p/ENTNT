// src/components/Jobs/JobDashboard.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import JobsBoard from './JobsBoard';
// import CandidateScoreboard from './CandidateScoreboard';
// import ArchiveBoard from './ArchiveBoard';
import JobPriorityBoard from './JobPriorityBoard'; // <-- import correctly

const JobDashboard = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState('jobs'); // default to "Your Jobs"

  const renderContent = () => {
    switch (selectedTab) {
      case 'jobs':
        return <JobsBoard recruiterId={Number(id)} />;
      // case 'scoreboard':
      //   return <CandidateScoreboard recruiterId={Number(id)} />;
      // case 'archive':
      //   return <ArchiveBoard recruiterId={Number(id)} />;
      case 'priority':
        return <JobPriorityBoard recruiterId={Number(id)} />; // render Job Priority
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '220px',
          background: '#1e1e1e',
          color: '#fff',
          padding: '1rem',
          transition: 'all 0.3s ease',
        }}
      >
        <h3 style={{ marginBottom: '2rem' }}>Dashboard</h3>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <li style={{ cursor: 'pointer' }} onClick={() => setSelectedTab('jobs')}>
            📋 Your Jobs
          </li>
          <li
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedTab('scoreboard')}
          >
            📊 Candidates ScoreBoard
          </li>
          <li style={{ cursor: 'pointer' }} onClick={() => setSelectedTab('archive')}>
            🗃️ Archive/Unarchive
          </li>
          <li style={{ cursor: 'pointer' }} onClick={() => setSelectedTab('priority')}>
            🔀 Job Priority
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h2>Recruiter Dashboard (ID: {id})</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default JobDashboard;
