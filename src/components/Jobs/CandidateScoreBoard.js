import React, { useEffect, useState } from "react";
import { db } from "../../db/dexie";
import "./CandidateScoreBoard.css";

const CandidateScoreBoard = ({ recruiterId }) => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      // Get all jobs for this recruiter
      const jobs = await db.jobs.where({ recruiterId: Number(recruiterId) }).toArray();
      const jobIds = jobs.map((j) => j.id);

      // Get all candidates
      const allCandidates = await db.users.where({ role: "candidate" }).toArray();

      // Get all assessments for recruiter's jobs
      const assessments = await db.assessments
        .where("jobId")
        .anyOf(jobIds)
        .toArray();

      const updated = allCandidates.map((c) => {
        const assessment = assessments.find((a) => a.candidateId === c.id);
        const applied = Boolean(assessment);
        return {
          ...c,
          applied,
          score: assessment?.score ?? null,
          status: !applied
            ? "Not Applied"
            : assessment?.submittedAnswers
            ? "Completed"
            : "Yet to Give",
          resume: c.resume ?? "#", // Assume resume link stored in user.resume
        };
      });

      setCandidates(updated);
    };

    fetchCandidates();
  }, [recruiterId]);

  return (
    <div className="csb-container">
      <h2>Candidate Score Board</h2>
      {candidates.length === 0 ? (
        <p>No candidates found.</p>
      ) : (
        <div className="csb-table-wrapper">
          <table className="csb-table">
            <thead>
              <tr>
                <th>Name / Email</th>
                <th>Resume</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.id}>
                  <td>{c.name || c.email}</td>
                  <td>
                    {c.resume ? (
                      <a
                        href={c.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="csb-resume-link"
                      >
                        View PDF
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{c.applied ? "✅" : "❌"}</td>
                  <td
                    className={
                      c.status === "Completed"
                        ? "csb-status-completed"
                        : c.status === "Yet to Give"
                        ? "csb-status-yettogive"
                        : "csb-status-notapplied"
                    }
                  >
                    {c.status}
                  </td>
                  <td>{c.score !== null ? c.score : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CandidateScoreBoard;
