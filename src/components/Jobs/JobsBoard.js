import React, { useState } from "react";
import JobFormModal from "./JobFormModal";
import { useNavigate } from "react-router-dom";
import { db } from "../../db/dexie";
import { candidates } from "../../store/seed";

const pageSize = 5;

const JobsBoard = ({ recruiterId, recruiterJobs, setRecruiterJobs }) => {
  const [filters, setFilters] = useState({ title: "", status: "", tags: [] });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const applyFilters = () => {
    let filtered = recruiterJobs.filter((j) => j.recruiterId === recruiterId);

    if (filters.title) filtered = filtered.filter((j) =>
      j.title.toLowerCase().includes(filters.title.toLowerCase())
    );

    if (filters.status) filtered = filtered.filter((j) => j.status === filters.status);

    if (filters.tags.length > 0) filtered = filtered.filter((j) =>
      filters.tags.every((tag) => j.tags?.includes(tag))
    );

    filtered.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
    return filtered.slice((page - 1) * pageSize, page * pageSize);
  };

  const jobs = applyFilters();

  const addJob = async ({ title, location, description, deadline }) => {
    const newJob = {
      id: Date.now(),
      title,
      location,
      description,
      recruiterId,
      status: "active",
      priority: recruiterJobs.length,
      deadline: deadline ? new Date(deadline).toISOString() : null,
    };

    setRecruiterJobs([...recruiterJobs, newJob]);
    try {
      await db.jobs.add(newJob);
    } catch {
      setRecruiterJobs(recruiterJobs);
    }
  };

  const toggleArchive = async (job) => {
    const updatedJob = { ...job, status: job.status === "active" ? "archived" : "active" };
    setRecruiterJobs(recruiterJobs.map((j) => (j.id === job.id ? updatedJob : j)));
    try {
      await db.jobs.update(job.id, { status: updatedJob.status });
    } catch {
      setRecruiterJobs(recruiterJobs);
    }
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
                
                {/* Separate Deadline Field */}
                <div>
                  <strong>Deadline:</strong>{" "}
                  <input
                    type="date"
                    value={job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : ""}
                    onChange={async (e) => {
                      const updatedJob = { ...job, deadline: new Date(e.target.value).toISOString() };
                      setRecruiterJobs(recruiterJobs.map(j => j.id === job.id ? updatedJob : j));
                      await db.jobs.update(job.id, { deadline: updatedJob.deadline });
                    }}
                  />{" "}
                  {remainingDays != null && remainingDays >= 0 && (
                    <span>| {remainingDays === 0 ? "Due today!" : `${remainingDays} day(s) left`}</span>
                  )}
                </div>

                <ul>
                  {candidates.filter((c) => c.jobId === job.id).map((c) => (
                    <li key={c.id}>{c.name}</li>
                  ))}
                </ul>

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
    </div>
  );
};

export default JobsBoard;
