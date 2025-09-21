import React, { useState } from "react";
import JobCard from "./JobCard";
import JobFormModal from "./JobFormModal";

const JobsBoard = () => {
  const [jobs, setJobs] = useState([]);

  const handleAddJob = (job) => {
    setJobs([...jobs, job]);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Jobs Board</h2>
      <JobFormModal onAddJob={handleAddJob} />
      {jobs.length === 0 ? (
        <p>No jobs yet</p>
      ) : (
        jobs.map((job, idx) => (
          <JobCard
            key={idx}
            title={job.title}
            location={job.location}
            description={job.description}
          />
        ))
      )}
    </div>
  );
};

export default JobsBoard;
