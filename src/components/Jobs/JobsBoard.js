// src/components/Jobs/JobsBoard.js
import React, { useEffect, useState } from "react";
import { db } from "../../db/dexie";
import { candidates } from "../../store/seed";
import JobFormModal from "./JobFormModal";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./Sortable"; // small wrapper for drag-and-drop

const pageSize = 5;

const JobsBoard = ({ recruiterId }) => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ title: "", status: "", tags: [] });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const sensors = useSensors(useSensor(PointerSensor));

  // Fetch jobs with filters, pagination
  const fetchJobs = async () => {
    let userJobs = await db.jobs.where({ recruiterId }).toArray();

    // Filters
    if (filters.title) {
      userJobs = userJobs.filter((j) =>
        j.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    if (filters.status) {
      userJobs = userJobs.filter((j) => j.status === filters.status);
    }
    if (filters.tags.length > 0) {
      userJobs = userJobs.filter((j) =>
        filters.tags.every((t) => j.tags?.includes(t))
      );
    }

    // Sort by priority
    userJobs.sort((a, b) => (a.priority || 0) - (b.priority || 0));

    // Pagination
    const paginatedJobs = userJobs.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    setJobs(paginatedJobs);
  };

  useEffect(() => {
    fetchJobs();
  }, [recruiterId, filters, page]);

  // Add job
  const addJob = async ({ title, location, description }) => {
    const id = await db.jobs.add({
      title,
      location,
      description,
      recruiterId,
      status: "active",
      priority: jobs.length,
    });
    const newJob = await db.jobs.get(id);
    setJobs((prev) => [...prev, newJob]);
  };

  // Archive/Unarchive
  const toggleArchive = async (job) => {
    const updatedJob = {
      ...job,
      status: job.status === "active" ? "archived" : "active",
    };
    setJobs((prev) => prev.map((j) => (j.id === job.id ? updatedJob : j))); // optimistic

    try {
      await db.jobs.update(job.id, { status: updatedJob.status });
    } catch (err) {
      // rollback
      setJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)));
      console.error("Failed to toggle archive:", err);
    }
  };

  // Drag-and-drop reorder
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = jobs.findIndex((j) => j.id === active.id);
    const newIndex = jobs.findIndex((j) => j.id === over.id);

    const newJobs = arrayMove(jobs, oldIndex, newIndex);
    setJobs(newJobs); // optimistic

    try {
      await Promise.all(
        newJobs.map((job, idx) => db.jobs.update(job.id, { priority: idx }))
      );
    } catch (err) {
      setJobs(jobs); // rollback
      console.error("Failed to reorder jobs:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2>Your Jobs</h2>

        {/* Filters */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Search title"
            value={filters.title}
            onChange={(e) =>
              setFilters({ ...filters, title: e.target.value })
            }
          />
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
          <JobFormModal onAddJob={addJob} />
        </div>
      </div>

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={jobs.map((j) => j.id)}
            strategy={verticalListSortingStrategy}
          >
            {jobs.map((job) => (
              <SortableItem key={job.id} id={job.id}>
                <div
                  style={{
                    marginBottom: "1.5rem",
                    padding: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    background: "#fff",
                  }}
                >
                  <h3>{job.title} | {job.status}</h3>
                  <p>{job.description}</p>

                  <h4>Candidates for this job:</h4>
                  <ul>
                    {candidates
                      .filter((c) => c.jobId === job.id)
                      .map((c) => (
                        <li key={c.id}>{c.name}</li>
                      ))}
                  </ul>

                  <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                    <button
                      onClick={() => navigate(`/assignments/${job.id}`)}
                    >
                      Create/Edit Assignment
                    </button>
                    <button onClick={() => toggleArchive(job)}>
                      {job.status === "active" ? "Archive" : "Unarchive"}
                    </button>
                  </div>
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      )}

      {/* Pagination */}
      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))}>
          Prev
        </button>
        <span> Page {page} </span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default JobsBoard;
