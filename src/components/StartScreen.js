import React from "react";

function StartScreen({ onStart, onResume, hasSavedGame }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="card shadow-lg border-0" style={{ maxWidth: "640px", width: "92%", borderRadius: "18px" }}>
        <div className="card-body text-center p-5">
          <h1 className="mb-3" style={{ fontWeight: 800, letterSpacing: "0.5px" }}>Welcome to the Quiz Game!</h1>
          <p className="text-muted mb-4" style={{ fontSize: "1.1rem" }}>
            Test your knowledge across multiple levels. Ready to play?
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <button className="btn btn-primary btn-lg px-5 py-3" onClick={onStart} style={{ borderRadius: "12px", boxShadow: "0 8px 20px rgba(13,110,253,.3)" }}>
              Start Quiz
            </button>
            {hasSavedGame && (
              <button className="btn btn-outline-secondary btn-lg px-4 py-3" onClick={onResume} style={{ borderRadius: "12px" }}>
                Resume
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;
