import Dexie from "dexie";

export const db = new Dexie("TalentFlowDB");

// Define tables here
db.version(1).stores({
  jobs: "++id, title, slug, status, tags, priority",
  assessments: "++id, jobId, questions, createdAt",
  users: "++id, name, email, role", // <-- add this table
});

// Optional: open the database
db.open().catch((err) => {
  console.error("Dexie open failed: ", err.stack || err);
});
