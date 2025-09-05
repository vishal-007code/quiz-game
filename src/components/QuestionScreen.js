import React, { useState, useEffect, useCallback } from "react";
import Feedback from "./Feedback";
import Timer from "./Timer";
import "../css/QuestionScreen.css";

function QuestionScreen({ question, onAnswer, questionIndex, level, totalQuestions }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const normalize = (val) => val?.toString().trim().toLowerCase();

  const areArraysEqualCI = (a = [], b = []) => {
    const an = a.map((v) => normalize(v)).sort();
    const bn = b.map((v) => normalize(v)).sort();
    if (an.length !== bn.length) return false;
    for (let i = 0; i < an.length; i++) {
      if (an[i] !== bn[i]) return false;
    }
    return true;
  };

  // ✅ handleSubmit wrapped in useCallback
  const handleSubmit = useCallback(
    (isTimeout = false) => {
      let isCorrect = false;

      if (!isTimeout) {
        if (question.type === "checkbox") {
          const correct = Array.isArray(question.correctAnswer)
            ? question.correctAnswer
            : [question.correctAnswer];
          const user = Array.isArray(userAnswer) ? userAnswer : [userAnswer].filter(Boolean);
          isCorrect = areArraysEqualCI(user, correct);
        } else if (question.type === "text-input") {
          isCorrect = normalize(userAnswer) === normalize(question.correctAnswer);
        } else {
          isCorrect = normalize(userAnswer) === normalize(question.correctAnswer);
        }
      }

      setFeedback(isCorrect ? "Correct!" : "Wrong!");

      setTimeout(() => {
        setFeedback(null);
        onAnswer(isCorrect);
        setUserAnswer("");
      }, 1000);
    },
    [question, userAnswer, onAnswer] // ✅ dependencies
  );

  // Progress percentage
  const progressPercent = ((questionIndex + 1) / totalQuestions) * 100;

  const isSelected = (value) => {
    if (question.type === "checkbox") {
      return Array.isArray(userAnswer)
        ? userAnswer.map((v) => normalize(v)).includes(normalize(value))
        : false;
    }
    return normalize(userAnswer) === normalize(value);
  };

  const toggleCheckbox = (value) => {
    setUserAnswer((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      const nv = normalize(value);
      const exists = current.map((v) => normalize(v)).includes(nv);
      if (exists) {
        return current.filter((v) => normalize(v) !== nv);
      }
      return [...current, value];
    });
  };

  const submitDisabled =
    question.type === "checkbox"
      ? !(Array.isArray(userAnswer) && userAnswer.length > 0)
      : !userAnswer;

  // ✅ Add "Enter" key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !submitDisabled) {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [submitDisabled, handleSubmit]);

  return (
    <div className="container d-flex justify-content-center">
      <div className="card quiz-card shadow-lg w-100">
        <div className="card-body">
          {/* ✅ Quiz Header */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-primary fs-6 text-capitalize">Level: {level}</span>
            <span className="badge bg-secondary fs-6">
              Question {questionIndex + 1} of {totalQuestions}
            </span>
          </div>

          {/* ✅ Progress Bar */}
          <div className="progress mb-3" style={{ height: "10px" }}>
            <div
              className="progress-bar bg-info"
              role="progressbar"
              style={{ width: `${progressPercent}%` }}
              aria-valuenow={progressPercent}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>

          {/* Timer */}
          <Timer
            duration={15}
            onTimeUp={() => handleSubmit(true)}
            resetKey={questionIndex}
          />

          <h2 className="card-title mb-4">{question.question}</h2>

          {/* Multiple Choice */}
          {question.type === "multiple-choice" && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {question.options.map((opt, idx) => {
                const active = isSelected(opt);
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`btn ${
                      active ? "btn-outline-primary active" : "btn-outline-secondary"
                    }`}
                    onClick={() => setUserAnswer(opt)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* True/False */}
          {question.type === "true-false" && (
            <div className="d-flex gap-2 mb-3">
              {[
                { label: "True", value: "true" },
                { label: "False", value: "false" },
              ].map((opt) => {
                const active = isSelected(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`btn ${
                      active ? "btn-outline-primary active" : "btn-outline-secondary"
                    }`}
                    onClick={() => setUserAnswer(opt.value)}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Checkbox */}
          {question.type === "checkbox" && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {question.options.map((opt, idx) => {
                const active = isSelected(opt);
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`btn ${
                      active ? "btn-outline-primary active" : "btn-outline-secondary"
                    }`}
                    onClick={() => toggleCheckbox(opt)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Text Input */}
          {question.type === "text-input" && (
            <div className="mb-3 text-start">
              <input
                type="text"
                className="form-control"
                placeholder="Type your answer here..."
                value={typeof userAnswer === "string" ? userAnswer : ""}
                onChange={(e) => setUserAnswer(e.target.value)}
              />
            </div>
          )}

          <button
            className="btn btn-success mt-3"
            onClick={() => handleSubmit()}
            disabled={submitDisabled}
          >
            Submit
          </button>

          {feedback && <Feedback message={feedback} />}
        </div>
      </div>
    </div>
  );
}

export default QuestionScreen;
