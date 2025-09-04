import React from "react";

function StartScreen({ onStart }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <h1 className="mb-4">Welcome to the Quiz Game!</h1>
      <button className="btn btn-primary btn-lg" onClick={onStart}>
        Start Quiz
      </button>
    </div>
  );
}

export default StartScreen;
