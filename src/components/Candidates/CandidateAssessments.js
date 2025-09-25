// src/components/Candidate/CandidateAssessments.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../db/dexie";

const CandidateAssessments = ({ candidateId }) => {
  const [jobAssessments, setJobAssessments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!candidateId) return;

      // 1. Fetch all jobs where candidate has applied
      const allJobs = await db.jobs.toArray();
      const appliedJobs = allJobs.filter((job) =>
        (job.appliedCandidates || []).includes(candidateId)
      );

      // 2. For each job, check if assessment exists
      const jobAssessmentInfo = await Promise.all(
        appliedJobs.map(async (job) => {
          const assessment = await db.assessments
            .where({ candidateId, jobId: job.id })
            .first();

          return {
            jobTitle: job.title,
            jobId: job.id,
            assessment,
          };
        })
      );

      setJobAssessments(jobAssessmentInfo);
    };

    fetchData();
  }, [candidateId]);

  const startAssessment = (assessmentId) => {
    navigate(`/assessment/${assessmentId}`);
  };

  return (
    <div>
      <h2>Your Assessments</h2>
      {jobAssessments.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {jobAssessments.map(({ jobId, jobTitle, assessment }) => (
            <div
              key={jobId}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                background: "#f9f9f9",
              }}
            >
              <h3>Job: {jobTitle}</h3>
              {assessment ? (
                <>
                  <p>Score: {assessment.score ?? "Not submitted"}</p>
                  <button
                    onClick={() => startAssessment(assessment.id)}
                    disabled={assessment.submittedAnswers?.length > 0}
                  >
                    {assessment.submittedAnswers?.length > 0
                      ? "Completed"
                      : "Start Assessment"}
                  </button>
                </>
              ) : (
                <p><strong>Assessment not yet created by recruiter.</strong></p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateAssessments;
