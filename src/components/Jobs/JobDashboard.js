// src/components/Jobs/JobDashboard.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JobsBoard from "./JobsBoard";
import JobPriorityBoard from "./JobPriorityBoard"; // classic priority
import JobPriorityBoardKanban from "./KanbanBoard"; // Kanban version
// Removed import CandidateScoreBoard
import { db } from "../../db/dexie";

const JobDashboard = () => {
  const { id } = useParams(); // recruiter ID
  const [selectedTab, setSelectedTab] = useState("jobs");
  const [recruiterJobs, setRecruiterJobs] = useState([]);

  // Fetch recruiter jobs from Dexie
  const fetchRecruiterJobs = async () => {
    const jobs = await db.jobs.where({ recruiterId: Number(id) }).toArray();
    const jobsWithDates = jobs.map((j) => ({
      ...j,
      deadline: j.deadline ? new Date(j.deadline) : null,
    }));
    setRecruiterJobs(jobsWithDates);
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, [id]);

  // Centralized update function for optimistic updates
  const updateJobs = (updatedList) => {
    setRecruiterJobs(updatedList);
    updatedList.forEach(async (job) => {
      try {
        await db.jobs.update(job.id, job);
      } catch (err) {
        console.error("Dexie update failed for job", job.id, err);
      }
    });
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "jobs":
        return (
          <JobsBoard
            recruiterId={Number(id)}
            recruiterJobs={recruiterJobs}
            setRecruiterJobs={updateJobs}
          />
        );

      case "priority":
        return (
          <JobPriorityBoard
            recruiterJobs={recruiterJobs}
            setRecruiterJobs={updateJobs}
          />
        );

      case "kanban":
        return (
          <JobPriorityBoardKanban
            recruiterJobs={recruiterJobs}
            setRecruiterJobs={updateJobs}
          />
        );

      case "candidates":
        return <div>Candidate Scores</div>; // empty placeholder

      default:
        return <p>Select a section</p>;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "#1e1e1e",
          color: "#fff",
          padding: "1rem",
        }}
      >
        <h3>Dashboard</h3>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <li style={{ cursor: "pointer" }} onClick={() => setSelectedTab("jobs")}>
            📋 Your Jobs
          </li>
          <li style={{ cursor: "pointer" }} onClick={() => setSelectedTab("priority")}>
            🔀 Job Priority
          </li>
          <li style={{ cursor: "pointer" }} onClick={() => setSelectedTab("kanban")}>
            🗂 Kanban Board
          </li>
          <li style={{ cursor: "pointer" }} onClick={() => setSelectedTab("candidates")}>
            🎯 Candidate ScoreBoard
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "2rem" }}>
        <h2>Recruiter Dashboard (ID: {id})</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default JobDashboard;
