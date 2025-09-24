// src/store/CandidatesScore.js

export const jobsWithStages = [
  {
    id: 1,
    title: "Frontend Developer",
    stages: [
      {
        id: "screening",
        name: "Screening",
        candidates: [
          { id: "c1", name: "Alice", score: 85 },
          { id: "c2", name: "Bob", score: 78 },
        ],
      },
      {
        id: "technical",
        name: "Technical Interview",
        candidates: [
          { id: "c3", name: "Charlie", score: 90 },
          { id: "c4", name: "David", score: 88 },
        ],
      },
      {
        id: "hr",
        name: "HR Interview",
        candidates: [
          { id: "c5", name: "Eve", score: 92 },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Backend Developer",
    stages: [
      {
        id: "screening",
        name: "Screening",
        candidates: [
          { id: "c6", name: "Frank", score: 80 },
          { id: "c7", name: "Grace", score: 75 },
        ],
      },
      {
        id: "technical",
        name: "Technical Interview",
        candidates: [
          { id: "c8", name: "Hank", score: 89 },
        ],
      },
    ],
  },
];
