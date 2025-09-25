// src/components/Candidate/CandidateExam.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../db/dexie";

const CandidateExam = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // default 10 min

  // Load assessment from DB
  useEffect(() => {
    const fetchAssessment = async () => {
      const a = await db.assessments.get(Number(assessmentId));
      if (!a) return navigate("/candidate-dashboard");
      setAssessment(a);

      // Restore answers if already started
      if (a.submittedAnswers) setAnswers(a.submittedAnswers);

      // Restore remaining time from localStorage if exists
      const storedTime = localStorage.getItem(`timeLeft-${a.id}`);
      if (storedTime) setTimeLeft(Number(storedTime));
    };
    fetchAssessment();
  }, [assessmentId, navigate]);

  // Timer
  useEffect(() => {
    if (!assessment) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        const newTime = t - 1;
        localStorage.setItem(`timeLeft-${assessment.id}`, newTime);
        if (newTime <= 0) clearInterval(timer);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, assessment]);

  // Save answers optimistically
  const handleAnswer = async (qId, option) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [qId]: option };
      if (assessment) {
        db.assessments.update(assessment.id, { submittedAnswers: newAnswers });
      }
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    if (!assessment) return;

    const score = assessment.questions.reduce(
      (acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0),
      0
    );

    await db.assessments.update(assessment.id, {
      submittedAnswers: answers,
      score,
      completedAt: new Date(),
    });

    localStorage.removeItem(`timeLeft-${assessment.id}`);
    navigate(`/candidate-dashboard/${assessment.candidateId}`);
  };

  if (!assessment) return <p>Loading assessment...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Assessment for Job: {assessment.jobId}</h2>
      <p>
        Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
      </p>

      <div>
        {assessment.questions.map((q, idx) => (
          <div key={q.id} style={{ marginBottom: "1rem" }}>
            <p>
              {idx + 1}. {q.question}
            </p>
            {q.options.map((opt) => (
              <label key={opt} style={{ display: "block" }}>
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleAnswer(q.id, opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
        Submit Assessment
      </button>
    </div>
  );
};

export default CandidateExam;
