// src/components/Candidate/CandidateSuggestions.js
import React, { useEffect, useState } from "react";

const CandidateSuggestions = ({ candidateId }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [newStory, setNewStory] = useState("");

  // Fetch suggestions from MirageJS API
  const fetchSuggestions = async () => {
    try {
      const res = await fetch(`/api/suggestions?candidateId=${candidateId}`);
      const data = await res.json();
      // Sort newest first
      setSuggestions(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [candidateId]);

  // Toggle starred
  const toggleStar = async (id, starred) => {
    try {
      await fetch(`/api/suggestions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starred: !starred }),
      });
      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, starred: !starred } : s))
      );
    } catch (err) {
      console.error("Failed to toggle star", err);
    }
  };

  // Add new story
  const addStory = async () => {
    if (!newStory.trim()) return;

    const payload = {
      candidateId: Number(candidateId),
      jobId: null,
      text: newStory.trim(),
      starred: false,
      createdAt: new Date(),
    };

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const savedStory = await res.json();
      setSuggestions([savedStory, ...suggestions]);
      setNewStory("");
    } catch (err) {
      console.error("Failed to add story", err);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2>Candidate Suggestions</h2>

      {/* Write your own story */}
      <div style={storyInputContainer}>
        <textarea
          value={newStory}
          onChange={(e) => setNewStory(e.target.value)}
          placeholder="Write your own story..."
          style={storyTextarea}
        />
        <button onClick={addStory} style={storyButton}>
          Add Story
        </button>
      </div>

      {/* Suggestions list */}
      <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {suggestions.length === 0 && <p>No suggestions yet for your applied jobs or assessments.</p>}
        {suggestions.map((s) => (
          <div
            key={s.id}
            style={{
              ...suggestionCard,
              borderColor: s.starred ? "#ffd700" : "#ccc",
              transform: s.starred ? "scale(1.02)" : "scale(1)",
              transition: "all 0.3s ease",
            }}
          >
            <p>{s.text}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <small>Job ID: {s.jobId ?? "N/A"}</small>
              <span
                style={{ cursor: "pointer", fontSize: "1.5rem", color: s.starred ? "#ffd700" : "#ccc" }}
                onClick={() => toggleStar(s.id, s.starred)}
              >
                ★
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styling
const storyInputContainer = { display: "flex", flexDirection: "column", gap: "0.5rem" };
const storyTextarea = {
  width: "100%",
  minHeight: "80px",
  padding: "1rem",
  borderRadius: "12px",
  border: "1px solid #ccc",
  resize: "vertical",
  fontSize: "1rem",
};
const storyButton = {
  alignSelf: "flex-end",
  padding: "0.5rem 1rem",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};
const suggestionCard = {
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "12px",
  background: "#f9f9f9",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

export default CandidateSuggestions;
