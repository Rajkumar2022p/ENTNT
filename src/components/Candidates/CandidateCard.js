import React from 'react';
import './CandidateCard.css';

const CandidateCard = ({ job }) => {
  return (
    <div className="candidate-card">
      <h2>{job.title}</h2>
      <p>{job.description}</p>
      <h3>Assignments</h3>
      {job.assignments.length > 0 ? (
        <ul>
          {job.assignments.map((ass) => (
            <li key={ass.id}>
              <strong>{ass.title}</strong> | Deadline: {ass.deadline} | Time: {ass.time}
              {ass.prerequisites.length > 0 && (
                <div>Prerequisites: {ass.prerequisites.join(', ')}</div>
              )}
              <button className="start-assessment-btn">Start Assessment</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assignments yet.</p>
      )}
    </div>
  );
};

export default CandidateCard;
