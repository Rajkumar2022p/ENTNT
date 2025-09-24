import Dexie from "dexie";

export const db = new Dexie("TalentFlowDB");



// Define tables here
db.version(1).stores({
  users: '++id, email, password, role', // ✅ Added for candidate & recruiter login
  jobs: '++id, recruiterId, title, appliedCandidates, shortlistedCandidates',
  assessments: '++id, jobId, candidateId, questions, submittedAnswers, score',
  suggestions: '++id, recruiterId, candidateId, message',
  resumes: '++id, candidateId, fileBlob',
});



// Optional: open the database
db.open().catch((err) => {
  console.error("Dexie open failed: ", err.stack || err);
});
