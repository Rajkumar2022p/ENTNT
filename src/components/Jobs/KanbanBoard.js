// src/components/KanbanBoard.js
import React, { useState, useEffect } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./Sortable";
import { db } from "../../db/dexie";
import { jobsWithStages } from "../../store/CandidateScore";

const KanbanBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [showBulkStagePanel, setShowBulkStagePanel] = useState(false);
  const [targetStageId, setTargetStageId] = useState("");

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setJobs(jobsWithStages); // replace with Dexie fetch if needed
  }, []);

  // Toggle candidate selection
  const toggleCandidateSelection = (candidate, jobId, stageId) => {
    const key = `${jobId}-${stageId}-${candidate.id}`;
    setSelectedCandidates((prev) =>
      prev.some((c) => c.key === key)
        ? prev.filter((c) => c.key !== key)
        : [...prev, { ...candidate, jobId, stageId, key }]
    );
  };

  // Bulk Promote/Demote
  const handleBulkMove = async () => {
    if (!targetStageId) return;

    const updatedJobs = [...jobs];

    selectedCandidates.forEach((c) => {
      const jobIndex = updatedJobs.findIndex((j) => j.id === c.jobId);
      const job = updatedJobs[jobIndex];
      const sourceStage = job.stages.find((s) => s.id === c.stageId);
      const targetStage = job.stages.find((s) => s.id === targetStageId);

      const candidateIndex = sourceStage.candidates.findIndex((sc) => sc.id === c.id);
      if (candidateIndex !== -1) {
        const [movedCandidate] = sourceStage.candidates.splice(candidateIndex, 1);
        targetStage.candidates.push(movedCandidate);
      }
    });

    setJobs(updatedJobs);
    setSelectedCandidates([]);
    setTargetStageId("");
    setShowBulkStagePanel(false);

    // Update Dexie DB
    try {
      for (let c of selectedCandidates) {
        const jobIndex = updatedJobs.findIndex((j) => j.id === c.jobId);
        await db.jobs.update(c.jobId, { stages: updatedJobs[jobIndex].stages });
      }
    } catch (err) {
      console.error("Dexie update failed:", err);
    }
  };

  // Drag & Drop handler
  const handleCandidateDrag = async (event, jobId) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) return;

    const updatedJobs = [...jobs];
    const stages = updatedJobs[jobIndex].stages;

    let sourceStageIndex, sourceCandidateIndex;
    stages.forEach((stage, sIdx) => {
      const cIdx = stage.candidates.findIndex((c) => c.id === active.id);
      if (cIdx !== -1) {
        sourceStageIndex = sIdx;
        sourceCandidateIndex = cIdx;
      }
    });

    let destStageIndex;
    stages.forEach((stage, sIdx) => {
      if (stage.candidates.some((c) => c.id === over.id)) {
        destStageIndex = sIdx;
      }
    });

    if (typeof destStageIndex === "undefined") destStageIndex = sourceStageIndex;
    if (typeof sourceStageIndex === "undefined" || typeof destStageIndex === "undefined") return;

    const candidateToMove = stages[sourceStageIndex].candidates.splice(sourceCandidateIndex, 1)[0];
    const overIndex = stages[destStageIndex].candidates.findIndex((c) => c.id === over.id);

    if (overIndex === -1) stages[destStageIndex].candidates.push(candidateToMove);
    else stages[destStageIndex].candidates.splice(overIndex, 0, candidateToMove);

    setJobs(updatedJobs);
    try {
      await db.jobs.update(jobId, { stages });
    } catch (err) {
      console.error("Dexie update failed:", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      {jobs.map((job) => (
        <div key={job.id} style={{ marginBottom: "2rem" }}>
          <h2>{job.title}</h2>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleCandidateDrag(e, job.id)}
          >
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
                  <SortableContext
                    items={stage.candidates.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {stage.candidates.map((c) => {
                      const isSelected = selectedCandidates.some(
                        (sc) => sc.key === `${job.id}-${stage.id}-${c.id}`
                      );
                      return (
                        <SortableItem key={c.id} id={c.id}>
                          <div
                            style={{
                              padding: "0.5rem",
                              margin: "0.5rem 0",
                              border: "1px solid #ccc",
                              borderRadius: "6px",
                              background: isSelected ? "#d0e6ff" : "#fff",
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => toggleCandidateSelection(c, job.id, stage.id)}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              style={{ marginRight: "0.5rem" }}
                            />
                            <div>
                              <strong>{c.name}</strong>
                              <div>Score: {c.score}</div>
                            </div>
                          </div>
                        </SortableItem>
                      );
                    })}
                  </SortableContext>
                </div>
              ))}
            </div>
          </DndContext>
        </div>
      ))}

      {/* Step 1: Show Bulk Update Button */}
      {selectedCandidates.length > 0 && !showBulkStagePanel && (
        <button
          onClick={() => setShowBulkStagePanel(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            padding: "0.5rem 1rem",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          Bulk Update {selectedCandidates.length} Candidate(s)
        </button>
      )}

      {/* Step 2: Show Stage Selection Panel */}
      {showBulkStagePanel && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            padding: "1rem 2rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 5px 10px rgba(0,0,0,0.15)",
            zIndex: 1000,
            width: "350px",
          }}
        >
          <h4>Move {selectedCandidates.length} Candidate(s)</h4>
          <select
            value={targetStageId}
            onChange={(e) => setTargetStageId(e.target.value)}
            style={{ marginTop: "0.5rem", width: "100%" }}
          >
            <option value="">-- Select Target Stage --</option>
            {jobs
              .flatMap((j) => j.stages)
              .filter((s) => !selectedCandidates.some((c) => c.stageId === s.id))
              .map((stage) => {
                const firstCandidateStageIndex = selectedCandidates
                  .map((c) => {
                    const job = jobs.find((j) => j.id === c.jobId);
                    return job.stages.findIndex((s2) => s2.id === c.stageId);
                  })[0];

                const targetStageIndex = jobs[0].stages.findIndex((s2) => s2.id === stage.id);

                const label = targetStageIndex > firstCandidateStageIndex ? "Promote" : "Demote";

                return (
                  <option key={stage.id} value={stage.id}>
                    {stage.name} ({label})
                  </option>
                );
              })}
          </select>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button
              onClick={() => setShowBulkStagePanel(false)}
              style={{ padding: "0.5rem 1rem", background: "#ccc", border: "none", borderRadius: "4px" }}
            >
              Cancel
            </button>
            <button
              onClick={handleBulkMove}
              disabled={!targetStageId}
              style={{ padding: "0.5rem 1rem", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}
            >
              Confirm Move
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
