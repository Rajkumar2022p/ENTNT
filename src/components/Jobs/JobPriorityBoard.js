// src/components/Jobs/JobPriorityBoard.js
import React, { useEffect, useState } from "react";
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
import { SortableItem } from "./Sortable"; // your existing sortable item component
import { db } from "../../db/dexie";

const JobPriorityBoard = ({ recruiterJobs, setRecruiterJobs }) => {
  const [urgentJobs, setUrgentJobs] = useState([]);
  const [normalJobs, setNormalJobs] = useState([]);
  const today = new Date();

  const sensors = useSensors(useSensor(PointerSensor));

  // Split jobs into urgent and normal based on deadline
  useEffect(() => {
    const activeJobs = recruiterJobs.filter((j) => j.status === "active");

    const urgent = [];
    const normal = [];

    activeJobs.forEach((job) => {
      if (job.deadline) {
        const diff = (new Date(job.deadline) - today) / (1000 * 60 * 60 * 24);
        if (diff <= 1) urgent.push(job);
        else normal.push(job);
      } else {
        normal.push(job);
      }
    });

    urgent.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
    normal.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

    setUrgentJobs(urgent);
    setNormalJobs(normal);
  }, [recruiterJobs]);

  const handleDragEnd = async (event, type) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const list = type === "urgent" ? [...urgentJobs] : [...normalJobs];
    const oldIndex = list.findIndex((job) => job.id === active.id);
    const newIndex = list.findIndex((job) => job.id === over.id);

    const newList = arrayMove(list, oldIndex, newIndex);

    // Update state
    if (type === "urgent") setUrgentJobs(newList);
    else setNormalJobs(newList);

    // Update priorities in recruiterJobs and Dexie
    const updatedRecruiterJobs = recruiterJobs.map((job) => {
      const idx = newList.findIndex((j) => j.id === job.id);
      return idx !== -1 ? { ...job, priority: idx } : job;
    });
    setRecruiterJobs(updatedRecruiterJobs);

    try {
      await Promise.all(newList.map((job, idx) => db.jobs.update(job.id, { priority: idx })));
    } catch {
      // rollback on error
      if (type === "urgent") setUrgentJobs(list);
      else setNormalJobs(list);
      setRecruiterJobs(recruiterJobs);
    }
  };

  const calculateRemainingDays = (deadline) => {
    if (!deadline) return null;
    const diff = (new Date(deadline) - today) / (1000 * 60 * 60 * 24);
    return Math.ceil(diff);
  };

  const renderColumn = (jobsList, type, title) => (
    <div style={{ minWidth: "300px", flex: "0 0 auto" }}>
      <h3>{title}</h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(e) => handleDragEnd(e, type)}
      >
        <SortableContext items={jobsList.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {jobsList.map((job, index) => {
            const remainingDays = calculateRemainingDays(job.deadline);
            return (
              <SortableItem key={job.id} id={job.id}>
                <div
                  style={{
                    padding: "1rem",
                    margin: "0.5rem 0",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    background: "#fefefe",
                  }}
                >
                  <h4>{job.title}</h4>
                  <p>
                    Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}{" "}
                    {remainingDays != null && remainingDays >= 0 && (
                      <span>| {remainingDays === 0 ? "Due today!" : `${remainingDays} day(s) left`}</span>
                    )}
                  </p>
                  <p>Priority: {index + 1}</p>
                </div>
              </SortableItem>
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "1rem", overflowX: "auto" }}>
      {renderColumn(urgentJobs, "urgent", "🔥 Urgent Jobs")}
      {renderColumn(normalJobs, "normal", "🧾 Other Jobs")}
    </div>
  );
};

export default JobPriorityBoard;
