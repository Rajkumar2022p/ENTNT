// src/components/Candidate/CandidateHome.js
import React, { useState, useEffect } from "react";
import { db } from "../../db/dexie";

const CandidateHome = ({ allJobs: initialJobs, candidateId }) => {
  const [allJobs, setAllJobs] = useState(initialJobs);

  // Optimistic apply function
  const handleApply = async (job) => {
    try {
      // Update Dexie: add candidateId to appliedCandidates
      const updatedApplied = job.appliedCandidates ? [...job.appliedCandidates, candidateId] : [candidateId];
      await db.table("jobs").update(job.id, { appliedCandidates: updatedApplied });

      // Optimistic state update
      setAllJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, applied: true, appliedCandidates: updatedApplied } : j))
      );
    } catch (err) {
      console.error("Failed to apply:", err);
    }
  };

  // Check if candidate has assessment for the job
  const hasAssessment = async (jobId) => {
    const assessment = await db.table("assessments").where({ jobId, candidateId }).first();
    return !!assessment;
  };

  const appliedJobs = allJobs.filter((job) => job.applied);
  const availableJobs = allJobs.filter((job) => !job.applied);

  return (
    <div>
      <h2>Jobs You Can Apply</h2>
      {availableJobs.map((job) => (
        <div key={job.id} style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p>Status: Not Applied</p>
          <button
            onClick={() => handleApply(job)}
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Apply
          </button>
        </div>
      ))}

      <h2>Jobs You've Applied</h2>
      {appliedJobs.map((job) => (
        <div key={job.id} style={{ border: "1px solid #00f", padding: "1rem", margin: "1rem 0" }}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p>Status: Applied</p>
          <AssessmentButton job={job} candidateId={candidateId} />
        </div>
      ))}
    </div>
  );
};

// Button to start assessment if exists
const AssessmentButton = ({ job, candidateId }) => {
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const checkAssessment = async () => {
      const assessment = await db.table("assessments").where({ jobId: job.id, candidateId }).first();
      setExists(!!assessment);
    };
    checkAssessment();
  }, [job.id, candidateId]);

  if (!exists) return <p>No assessment assigned yet</p>;

  return (
    <button
      onClick={() => {
        // Navigate to assessment page
        window.location.href = `/assignments/${job.id}`;
      }}
      style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
    >
      Start Assessment
    </button>
  );
};

export default CandidateHome;
