import React from "react";
import "../css/StartScreen.css"; // 👈 external CSS file for styles

function StartScreen({ onStart, onResume, hasSavedGame }) {
  return (
    <div className="start-screen d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="card quiz-card text-center">
        <div className="card-body p-5">
          <h1 className="quiz-title">🎯 Welcome to the Quiz Game!</h1>
          <p className="quiz-subtitle">
            Test your knowledge across multiple levels. Ready to prove yourself? 🚀
          </p>

          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button className="btn start-btn" onClick={onStart}>
              Start Quiz
            </button>

            {hasSavedGame && (
              <button className="btn resume-btn" onClick={onResume}>
                Resume Game
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;
