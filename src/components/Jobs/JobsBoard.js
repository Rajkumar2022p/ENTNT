import React, { useState, useEffect } from "react";
import JobFormModal from "./JobFormModal";
import JobPriorityBoard from "./JobPriorityBoard";
import { useNavigate } from "react-router-dom";

const pageSize = 5;

const JobsBoard = ({ recruiterId }) => {
  const navigate = useNavigate();

  // Jobs state: persist to localStorage
  const [recruiterJobs, setRecruiterJobs] = useState(() => {
    const saved = localStorage.getItem("recruiterJobs");
    return saved ? JSON.parse(saved) : [];
  });

  const [filters, setFilters] = useState({ title: "", status: "" });
  const [page, setPage] = useState(1);

  // Save to localStorage whenever jobs change
  useEffect(() => {
    localStorage.setItem("recruiterJobs", JSON.stringify(recruiterJobs));
  }, [recruiterJobs]);

  const applyFilters = () => {
    let filtered = recruiterJobs;

    if (filters.title)
      filtered = filtered.filter((j) =>
        j.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    if (filters.status)
      filtered = filtered.filter((j) => j.status === filters.status);

    return filtered.slice((page - 1) * pageSize, page * pageSize);
  };

  const jobs = applyFilters();

  const addJob = (newJobsArray) => {
    if (!Array.isArray(newJobsArray)) newJobsArray = [newJobsArray];

    const jobsWithMeta = newJobsArray.map((job) => ({
      ...job,
      recruiterId,
      id: job.id || Date.now(),
      status: "active",
      deadline: job.deadline ? new Date(job.deadline).toISOString() : null,
    }));

    setRecruiterJobs((prev) => [...prev, ...jobsWithMeta]);
  };

  const toggleArchive = (job) => {
    const updatedJob = {
      ...job,
      status: job.status === "active" ? "archived" : "active",
    };
    setRecruiterJobs((prev) =>
      prev.map((j) => (j.id === job.id ? updatedJob : j))
    );
  };

  const calculateRemainingDays = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const diff = (new Date(deadline) - today) / (1000 * 60 * 60 * 24);
    return Math.ceil(diff);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Your Jobs</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Search title"
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
          <JobFormModal onAddJob={addJob} />
        </div>
      </div>

      {jobs.length === 0 ? (
        <p>No jobs to show.</p>
      ) : (
        <div>
          {jobs.map((job) => {
            const remainingDays = calculateRemainingDays(job.deadline);
            return (
              <div
                key={job.id}
                style={{
                  padding: "1rem",
                  margin: "1rem 0",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  background: "#fefefe",
                }}
              >
                <h3>{job.title} | {job.status}</h3>
                <p>{job.description}</p>
                <div>
                  <strong>Deadline:</strong>{" "}
                  <input
                    type="date"
                    value={job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : ""}
                    onChange={(e) => {
                      const updatedJob = { ...job, deadline: new Date(e.target.value).toISOString() };
                      setRecruiterJobs((prev) =>
                        prev.map((j) => (j.id === job.id ? updatedJob : j))
                      );
                    }}
                  />{" "}
                  {remainingDays != null && remainingDays >= 0 && (
                    <span>| {remainingDays === 0 ? "Due today!" : `${remainingDays} day(s) left`}</span>
                  )}
                </div>

                <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                  <button onClick={() => navigate(`/assignments/${job.id}`)}>Create/Edit Assignment</button>
                  <button onClick={() => toggleArchive(job)}>
                    {job.status === "active" ? "Archive" : "Unarchive"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      {/* JobPriorityBoard handles priority entirely */}
      
    </div>
  );
};

export default JobsBoard;
