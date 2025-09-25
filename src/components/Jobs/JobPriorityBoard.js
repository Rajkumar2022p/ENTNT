// src/components/Jobs/JobPriorityBoard.js
import React, { useState, useEffect } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {SortableItem} from "./Sortable";
import { db } from "../../db/dexie";

const JobPriorityBoard = ({ recruiterJobs, setRecruiterJobs }) => {
  const [activeJobs, setActiveJobs] = useState([]);

  // Sensors for DnD
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    // Only show active jobs for priority board
    setActiveJobs(recruiterJobs.filter((job) => job.status === "active"));
  }, [recruiterJobs]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = activeJobs.findIndex((job) => job.id === active.id);
    const newIndex = activeJobs.findIndex((job) => job.id === over.id);
    const newActiveJobs = arrayMove(activeJobs, oldIndex, newIndex);

    // Optimistic UI update
    setActiveJobs(newActiveJobs);
    setRecruiterJobs((prev) => {
      // Merge reordered active jobs back with other jobs
      const otherJobs = prev.filter((job) => job.status !== "active");
      return [...newActiveJobs, ...otherJobs];
    });

    // Persist new order to Dexie
    try {
      for (let i = 0; i < newActiveJobs.length; i++) {
        await db.jobs.update(newActiveJobs[i].id, { priority: i + 1 });
      }
    } catch (err) {
      console.error("Failed to update job priority", err);
    }
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

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Job Priority Board (Drag & Drop)</h2>
      {activeJobs.length === 0 ? (
        <p>No active jobs to prioritize.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={activeJobs.map((job) => job.id)} strategy={verticalListSortingStrategy}>
            {activeJobs.map((job) => (
              <SortableItem key={job.id} id={job.id} job={job} toggleArchive={toggleArchive} />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default JobPriorityBoard;
