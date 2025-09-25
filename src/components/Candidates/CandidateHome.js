// src/components/Candidate/CandidateHome.js
import React, { useState, useEffect } from "react";
import { db } from "../../db/dexie";

const CandidateHome = ({ candidateId }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all active jobs from Dexie
  useEffect(() => {
    const fetchJobs = async () => {
      const jobs = await db.jobs.where({ status: "active" }).toArray();
      const jobsWithAppliedFlag = jobs.map((job) => ({
        ...job,
        applied: job.appliedCandidates?.includes(candidateId) || false,
      }));
      setAllJobs(jobsWithAppliedFlag);
      setLoading(false);
    };
    fetchJobs();
  }, [candidateId]);

  // Handle Apply button click
  const handleApply = async (job) => {
    if (job.applied) return; // already applied, ignore

    try {
      const updatedApplied = job.appliedCandidates
        ? [...job.appliedCandidates, candidateId]
        : [candidateId];

      // Update Dexie
      await db.jobs.update(job.id, { appliedCandidates: updatedApplied });

      // Optimistic state update
      setAllJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? { ...j, applied: true, appliedCandidates: updatedApplied }
            : j
        )
      );
    } catch (err) {
      console.error("Failed to apply:", err);
    }
  };

  // Separate available and applied jobs
  const availableJobs = allJobs.filter((job) => !job.applied);
  const appliedJobs = allJobs.filter((job) => job.applied);

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div>
      <h2>Jobs You Can Apply</h2>
      {availableJobs.length === 0 && <p>No available jobs at the moment.</p>}
      {availableJobs.map((job) => (
        <div
          key={job.id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            margin: "1rem 0",
            borderRadius: "6px",
          }}
        >
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <button
            onClick={() => handleApply(job)}
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Apply
          </button>
        </div>
      ))}

      <h2>Jobs You've Applied</h2>
      {appliedJobs.length === 0 && <p>You haven't applied to any jobs yet.</p>}
      {appliedJobs.map((job) => (
        <div
          key={job.id}
          style={{
            border: "1px solid #00f",
            padding: "1rem",
            margin: "1rem 0",
            borderRadius: "6px",
          }}
        >
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <AssessmentButton job={job} candidateId={candidateId} />
        </div>
      ))}
    </div>
  );
};

// Assessment Button
const AssessmentButton = ({ job, candidateId }) => {
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const checkAssessment = async () => {
      const assessment = await db.assessments
        .where({ jobId: job.id, candidateId })
        .first();
      setExists(!!assessment);
    };
    checkAssessment();
  }, [job.id, candidateId]);

  if (!exists) return <p>No assessment assigned yet</p>;

  return (
    <button
      onClick={() => (window.location.href = `/assignments/${job.id}`)}
      style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
    >
      Start Assessment
    </button>
  );
};

export default CandidateHome;
