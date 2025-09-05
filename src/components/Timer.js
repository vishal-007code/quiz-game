import React, { useState, useEffect } from "react";
import "../css/Timer.css";

function Timer({ duration, onTimeUp, resetKey }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Reset timer whenever resetKey changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [resetKey, duration]);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const progress = (timeLeft / duration) * 100;
  const lowTime = timeLeft < 5;

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="timer-label">⏳ Time Left:</span>
        <span className="timer-value">{timeLeft}s</span>
      </div>
      <div className="progress" style={{ height: "10px" }}>
        <div
          className={`progress-bar ${lowTime ? "bg-danger" : "bg-success"}`}
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={timeLeft}
          aria-valuemin="0"
          aria-valuemax={duration}
        ></div>
      </div>
    </div>
  );
}

export default Timer;
