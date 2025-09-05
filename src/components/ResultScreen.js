import React, { useEffect, useState } from "react";
import "../css/ResultScreen.css";

function ResultScreen({ score, onRestart }) {
  const [highScore, setHighScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem("quiz_high_score") || "0", 10);
    if (score > stored) {
      localStorage.setItem("quiz_high_score", String(score));
      setHighScore(score);
      setIsNewHigh(true);
    } else {
      setHighScore(stored);
    }
  }, [score]);

  return (
    <div className="container d-flex justify-content-center">
      <div className={`result-card shadow-lg text-center ${isNewHigh ? "confetti" : ""}`}>
        <h1 className="mb-4">🎉 Game Over!</h1>
        <p className="score-text">Your total score:</p>
        <h2 className="final-score">{score}</h2>
        <p className="mb-1">High score: <strong>{highScore}</strong></p>
        {isNewHigh && <p className="text-success fw-bold">New high score! 🚀</p>}
        <button className="btn btn-primary btn-lg mt-4" onClick={onRestart}>
          Restart Quiz
        </button>
      </div>
    </div>
  );
}

export default ResultScreen;
