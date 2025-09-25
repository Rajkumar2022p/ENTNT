// src/components/Candidate/CandidateDashboard.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CandidateHome from "./CandidateHome";
import CandidateAssessments from "./CandidateAssessments";
import ResumeUpload from "./ResumeUpload";
import CandidateSuggestions from "./CandidateSuggestions"; // <-- import suggestions
import { db } from "../../db/dexie";

const CandidateDashboard = () => {
  const { id: candidateId } = useParams();
  const [selectedTab, setSelectedTab] = useState("home");
  const [allJobs, setAllJobs] = useState([]);

  // Fetch all jobs and mark if candidate applied
  useEffect(() => {
    const fetchJobs = async () => {
      const jobsFromDB = await db.jobs.toArray();
      const updated = jobsFromDB.map((job) => ({
        ...job,
        applied: job.appliedCandidates?.includes(Number(candidateId)),
      }));
      setAllJobs(updated);
    };
    fetchJobs();
  }, [candidateId]);

  const renderTab = () => {
    switch (selectedTab) {
      case "home":
        return <CandidateHome allJobs={allJobs} candidateId={Number(candidateId)} />;
      case "assessments":
        return <CandidateAssessments candidateId={Number(candidateId)} />;
      case "resume":
        return <ResumeUpload candidateId={Number(candidateId)} />;
      case "suggestions":
        return <CandidateSuggestions candidateId={Number(candidateId)} />; // <-- suggestions tab
      default:
        return <p>Select a section</p>;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", background: "#2e2e2e", color: "#fff", padding: "1rem" }}>
        <div style={{ textAlign: "center" }}>
          <img src="/avatar.png" alt="Avatar" style={{ width: "80px", borderRadius: "50%" }} />
          <h3 style={{ margin: "0.5rem 0" }}>Candidate #{candidateId}</h3>
        </div>
        <hr />
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li onClick={() => setSelectedTab("home")} style={{ cursor: "pointer", margin: "1rem 0" }}>
            🏠 Home
          </li>
          <li onClick={() => setSelectedTab("assessments")} style={{ cursor: "pointer", margin: "1rem 0" }}>
            📝 Assessments
          </li>
          <li onClick={() => setSelectedTab("resume")} style={{ cursor: "pointer", margin: "1rem 0" }}>
            📄 Resume Upload
          </li>
          <li onClick={() => setSelectedTab("suggestions")} style={{ cursor: "pointer", margin: "1rem 0" }}>
            💡 Suggestions
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "2rem" }}>
        {renderTab()}
      </div>
    </div>
  );
};

export default CandidateDashboard;
