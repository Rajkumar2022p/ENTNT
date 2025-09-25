// src/components/Candidate/ResumeUpload.js
import React, { useState } from "react";
import { db } from "../../db/dexie";

const ResumeUpload = ({ candidateId }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage("Only PDF or Word documents are allowed.");
      return;
    }

    setFile(selectedFile);
    setMessage(`Selected: ${selectedFile.name}`);

    // Optional: store in Dexie (IndexedDB)
    if (candidateId) {
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const fileData = reader.result;
          await db.table("users").update(candidateId, { resume: fileData, resumeName: selectedFile.name });
          setMessage(`Uploaded: ${selectedFile.name}`);
        };
        reader.readAsDataURL(selectedFile); // Store as base64
      } catch (err) {
        console.error("Failed to store resume:", err);
        setMessage("Failed to upload resume.");
      }
    }
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Upload Resume (PDF, DOC, DOCX):
      </label>
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      {message && <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>{message}</p>}
    </div>
  );
};

export default ResumeUpload;
