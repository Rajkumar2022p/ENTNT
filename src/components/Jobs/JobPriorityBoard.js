// src/components/Jobs/JobPriorityBoard.js
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { db } from "../../db/dexie";
import "./JobPriorityBoard.css";

const JobPriorityBoard = ({ recruiterJobs }) => {
  // Initial state: only active jobs from recruiterJobs prop
  const [jobs, setJobs] = useState(() =>
    recruiterJobs.filter((job) => job.isActive)
  );

  // Handle drag & drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updatedJobs = Array.from(jobs);
    const [movedJob] = updatedJobs.splice(result.source.index, 1);
    updatedJobs.splice(result.destination.index, 0, movedJob);
    setJobs(updatedJobs);
  };

  // Save priorities to Dexie
  const handleSave = async () => {
    try {
      for (let i = 0; i < jobs.length; i++) {
        await db.jobs.update(jobs[i].id, { priority: i + 1 });
      }
      alert("Job priorities saved successfully!");
    } catch (err) {
      console.error("Error saving priorities:", err);
      alert("Failed to save priorities.");
    }
  };

  if (jobs.length === 0) return <p>No active jobs available.</p>;

  return (
    <div className="job-priority-board">
      <h2>Job Priority Board</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="jobs">
          {(provided) => (
            <div
              className="jobs-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {jobs.map((job, index) => (
                <Draggable
                  key={job.id}
                  draggableId={job.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      className={`job-card ${
                        snapshot.isDragging ? "dragging" : ""
                      }`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <h4>{job.title}</h4>
                      <p>Priority: {index + 1}</p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={handleSave} style={{ marginTop: "1rem" }}>
        Save Priorities
      </button>
    </div>
  );
};

export default JobPriorityBoard;
