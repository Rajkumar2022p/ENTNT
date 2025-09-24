// src/components/Candidate/CandidateDashboard.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";

// Empty placeholder components
const CandidateHome = () => <div>Home</div>;
const CandidateAssessments = () => <div>Assessments</div>;
const CandidateStatusBoard = () => <div>Status</div>;
const CandidateSuggestions = () => <div>Suggestions</div>;
const ResumeUpload = () => <div>Resume Upload</div>;

const CandidateDashboard = () => {
  const { id } = useParams(); // get candidateId from URL
  const [selectedTab, setSelectedTab] = useState("home");

  const renderTab = () => {
    switch (selectedTab) {
      case "home":
        return <CandidateHome />;
      case "assessments":
        return <CandidateAssessments />;
      case "status":
        return <CandidateStatusBoard />;
      case "suggestions":
        return <CandidateSuggestions />;
      default:
        return <p>Select a section</p>;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "250px", background: "#2e2e2e", color: "#fff", padding: "1rem" }}>
        <div style={{ textAlign: "center" }}>
          <img src="/avatar.png" alt="Avatar" style={{ width: "80px", borderRadius: "50%" }} />
          <h3 style={{ margin: "0.5rem 0" }}>Candidate Name</h3>
          <ResumeUpload />
        </div>
        <hr />
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li onClick={() => setSelectedTab("home")} style={{ cursor: "pointer", margin: "1rem 0" }}>🏠 Home</li>
          <li onClick={() => setSelectedTab("assessments")} style={{ cursor: "pointer", margin: "1rem 0" }}>📝 Assessments</li>
          <li onClick={() => setSelectedTab("status")} style={{ cursor: "pointer", margin: "1rem 0" }}>📊 Status</li>
          <li onClick={() => setSelectedTab("suggestions")} style={{ cursor: "pointer", margin: "1rem 0" }}>💬 Suggestions</li>
        </ul>
      </div>

      <div style={{ flex: 1, padding: "2rem" }}>
        {renderTab()}
      </div>
    </div>
  );
};

export default CandidateDashboard;
