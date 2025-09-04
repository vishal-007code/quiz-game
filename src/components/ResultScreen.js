import React from "react";
import "../css/ResultScreen.css";

function ResultScreen({ score, onRestart }) {
  return (
    <div className="container d-flex justify-content-center">
      <div className="result-card shadow-lg text-center">
        <h1 className="mb-4">🎉 Game Over!</h1>
        <p className="score-text">Your total score:</p>
        <h2 className="final-score">{score}</h2>
        <button className="btn btn-primary btn-lg mt-4" onClick={onRestart}>
          Restart Quiz
        </button>
      </div>
    </div>
  );
}

export default ResultScreen;
