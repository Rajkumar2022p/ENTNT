import React, { useState, useEffect } from "react";

// Dummy 15-question exam
const dummyQuestions = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  question: `Dummy Question ${i + 1}: What is the correct option?`,
  options: [
    `Option A for Q${i + 1}`,
    `Option B for Q${i + 1}`,
    `Option C for Q${i + 1}`,
    `Option D for Q${i + 1}`,
  ],
  correctAnswer: `Option ${["A", "B", "C", "D"][i % 4]}`,
}));

const CandidateDummyExam = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // Load saved answers & timer from localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem("dummyExamAnswers");
    const savedTime = localStorage.getItem("dummyExamTime");
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedTime) setTimeLeft(Number(savedTime));
  }, []);

  // Timer logic with persistence
  useEffect(() => {
    if (submitted) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        const newTime = t - 1;
        localStorage.setItem("dummyExamTime", newTime);
        if (newTime <= 0) clearInterval(timer);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const currentQuestion = dummyQuestions[currentIndex];

  const handleOptionSelect = (option) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [currentQuestion.id]: option };
      localStorage.setItem("dummyExamAnswers", JSON.stringify(newAnswers));
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentIndex < dummyQuestions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    localStorage.removeItem("dummyExamAnswers");
    localStorage.removeItem("dummyExamTime");
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setCurrentIndex(0);
    setTimeLeft(600);
  };

  if (submitted) {
    const score = dummyQuestions.reduce(
      (acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0),
      0
    );

    return (
      <div style={styles.container}>
        <h2>Exam Submitted!</h2>
        <p>
          Your Score: {score} / {dummyQuestions.length}
        </p>

        <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
          {dummyQuestions.map((q, idx) => {
            const userAnswer = answers[q.id];
            const correct = q.correctAnswer;
            const isCorrect = userAnswer === correct;
            return (
              <div key={q.id} style={{ marginBottom: "1rem" }}>
                <p>
                  {idx + 1}. {q.question}
                </p>
                {q.options.map((opt) => (
                  <div
                    key={opt}
                    style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: "5px",
                      marginBottom: "2px",
                      backgroundColor:
                        opt === correct
                          ? "#4caf50" // correct answer
                          : opt === userAnswer
                          ? "#f44336" // user's wrong selection
                          : "#f0f0f0",
                      color: opt === correct || opt === userAnswer ? "#fff" : "#000",
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <button style={styles.button} onClick={handleRetake}>
          Retake Exam
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Candidate Dummy Exam</h2>
      <div style={styles.timer}>
        Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
      </div>

      <div style={styles.progress}>
        Question {currentIndex + 1} / {dummyQuestions.length}
      </div>

      <div style={styles.questionBox}>
        <p style={styles.questionText}>{currentQuestion.question}</p>
        <div style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionSelect(option)}
              style={{
                ...styles.optionButton,
                backgroundColor:
                  answers[currentQuestion.id] === option ? "#4caf50" : "#f0f0f0",
                color: answers[currentQuestion.id] === option ? "#fff" : "#000",
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.navButtons}>
        <button style={styles.navButton} onClick={handlePrev} disabled={currentIndex === 0}>
          Previous
        </button>
        {currentIndex < dummyQuestions.length - 1 ? (
          <button style={styles.navButton} onClick={handleNext}>
            Next
          </button>
        ) : (
          <button style={styles.navButton} onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "2rem auto",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    background: "#fff",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  timer: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  progress: {
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  questionBox: {
    marginBottom: "2rem",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  questionText: {
    fontSize: "18px",
    marginBottom: "1rem",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },
  optionButton: {
    padding: "0.8rem 1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "16px",
    transition: "all 0.2s",
  },
  navButtons: {
    display: "flex",
    justifyContent: "space-between",
  },
  navButton: {
    padding: "0.8rem 1.5rem",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    background: "#1976d2",
    color: "#fff",
    transition: "background 0.2s",
  },
  button: {
    padding: "0.8rem 1.5rem",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    background: "#4caf50",
    color: "#fff",
    marginTop: "1rem",
  },
};

export default CandidateDummyExam;
