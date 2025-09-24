// src/components/KanbanBoard.js
import React, { useState, useEffect } from "react";
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./Sortable";
import { db } from "../../db/dexie";
import { jobsWithStages } from "../../store/CandidateScore";

const KanbanBoard = () => {
  const [jobs, setJobs] = useState([]);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    // Load dummy jobs, could be replaced with Dexie fetch
    setJobs(jobsWithStages);
  }, []);

  const handleCandidateDrag = async (jobId, stageId, activeId, overId) => {
    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) return;

    const stageIndex = jobs[jobIndex].stages.findIndex((s) => s.id === stageId);
    if (stageIndex === -1) return;

    const stage = [...jobs[jobIndex].stages[stageIndex]];
    const candidatesList = [...jobs[jobIndex].stages[stageIndex].candidates];

    const oldIndex = candidatesList.findIndex((c) => c.id === activeId);
    const newIndex = candidatesList.findIndex((c) => c.id === overId);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    const newCandidates = arrayMove(candidatesList, oldIndex, newIndex);

    const newJobs = [...jobs];
    newJobs[jobIndex].stages[stageIndex].candidates = newCandidates;
    setJobs(newJobs);

    // Optimistic update in Dexie
    try {
      await db.jobs.update(jobId, { stages: newJobs[jobIndex].stages });
    } catch {
      setJobs(jobs); // rollback on failure
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", padding: "1rem" }}>
      {jobs.map((job) => (
        <div key={job.id}>
          <h2>{job.title}</h2>
          <div style={{ display: "flex", gap: "1rem", overflowX: "auto" }}>
            {job.stages.map((stage) => (
              <div
                key={stage.id}
                style={{
                  minWidth: "250px",
                  padding: "1rem",
                  background: "#f5f5f5",
                  borderRadius: "8px",
                }}
              >
                <h3>{stage.name}</h3>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => handleCandidateDrag(job.id, stage.id, e.active.id, e.over?.id)}
                >
                  <SortableContext
                    items={stage.candidates.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {stage.candidates.map((c, index) => (
                      <SortableItem key={c.id} id={c.id}>
                        <div
                          style={{
                            padding: "0.5rem",
                            margin: "0.5rem 0",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            background: "#fff",
                          }}
                        >
                          {c.name} | Score: {c.score}
                        </div>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
