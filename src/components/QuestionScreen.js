import React, { useState } from "react";
import Feedback from "./Feedback";
import Timer from "./Timer";
import "../css/QuestionScreen.css";

function QuestionScreen({ question, onAnswer, questionIndex, level, totalQuestions }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = (isTimeout = false) => {
    let isCorrect = false;

    if (!isTimeout) {
      isCorrect =
        userAnswer.toString().toLowerCase() ===
        question.correctAnswer.toString().toLowerCase();
    }

    setFeedback(isCorrect ? "Correct!" : "Wrong!");

    setTimeout(() => {
      setFeedback(null);
      onAnswer(isCorrect);
      setUserAnswer("");
    }, 1000);
  };

  // Progress percentage
  const progressPercent = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="container d-flex justify-content-center">
      <div className="card quiz-card shadow-lg w-100">
        <div className="card-body">
          
          {/* ✅ Quiz Header */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-primary fs-6 text-capitalize">
              Level: {level}
            </span>
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
            <div className="options mb-3">
              {question.options.map((opt, idx) => (
                <div className="form-check text-start mb-2" key={idx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="answer"
                    id={`option-${idx}`}
                    value={opt}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                  <label
                    className="form-check-label ms-2"
                    htmlFor={`option-${idx}`}
                  >
                    {opt}
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* True/False */}
          {question.type === "true-false" && (
            <div className="options mb-3">
              <div className="form-check text-start mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  id="true-option"
                  name="answer"
                  value="true"
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
                <label className="form-check-label ms-2" htmlFor="true-option">
                  True
                </label>
              </div>
              <div className="form-check text-start mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  id="false-option"
                  name="answer"
                  value="false"
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
                <label className="form-check-label ms-2" htmlFor="false-option">
                  False
                </label>
              </div>
            </div>
          )}

          {/* Text Input */}
          {question.type === "text-input" && (
            <div className="mb-3 text-start">
              <input
                type="text"
                className="form-control"
                placeholder="Type your answer here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              />
            </div>
          )}

          <button
            className="btn btn-success mt-3"
            onClick={() => handleSubmit()}
            disabled={!userAnswer}
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
