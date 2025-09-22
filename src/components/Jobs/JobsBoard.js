// src/components/Jobs/JobsBoard.js
import React from "react";
import { jobs } from "../../store/seed";
import { candidates } from "../../store/seed";

const JobsBoard = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Jobs</h2>
      {jobs.map((job) => (
        <div
          key={job.id}
          style={{
            marginBottom: "1.5rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h3>{job.title}</h3>
          <p>{job.description}</p>

          <h4>Candidates for this job:</h4>
          <ul>
            {candidates
              .filter((c) => c.jobId === job.id)
              .map((c) => (
                <li key={c.id}>{c.name}</li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default JobsBoard;
