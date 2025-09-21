import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";
import JobFormModal from "./JobFormModal";

// Mirage API helpers
const fetchJobs = async () => {
  const res = await fetch("/api/jobs");
  const data = await res.json();
  return data.jobs;
};

const createJob = async (job) => {
  const res = await fetch("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  return res.json();
};

const deleteJob = async (id) => {
  await fetch(`/api/jobs/${id}`, {
    method: "DELETE",
  });
};

const JobsBoard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs().then((data) => setJobs(data));
  }, []);

  const handleAddJob = async (job) => {
    // Optimistic update
    setJobs((prev) => [...prev, job]);
    await createJob(job);
  };

  const handleDeleteJob = async (id) => {
    // Optimistic removal
    setJobs((prev) => prev.filter((job) => job.id !== id));
    await deleteJob(id);
  };

  return (
    <div className="container mt-4">
      <h2>Jobs</h2>
      <JobFormModal onAddJob={handleAddJob} />
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onDelete={handleDeleteJob} />
      ))}
    </div>
  );
};

export default JobsBoard;