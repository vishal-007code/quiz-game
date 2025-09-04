import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import StartScreen from "./components/StartScreen";
import QuestionScreen from "./components/QuestionScreen";
import ResultScreen from "./components/ResultScreen";
import questionsData from "./data/questions.json";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState("easy");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [levelPassed, setLevelPassed] = useState(false);

  const levels = ["easy", "medium", "hard"];

  const startGame = () => {
    setGameStarted(true);
    setCurrentLevel("easy");
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectCount(0);
    setGameOver(false);
    setLevelCompleted(false);
  };

  const handleAnswer = (isCorrect) => {
    let updatedScore = score;
    let updatedCorrectCount = correctCount;

    if (isCorrect) {
      if (currentLevel === "easy") updatedScore += 10;
      if (currentLevel === "medium") updatedScore += 20;
      if (currentLevel === "hard") updatedScore += 30;
      updatedCorrectCount += 1;
    }

    // Move to next question
    if (currentQuestionIndex + 1 < questionsData[currentLevel].length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Level finished
      const passed = updatedCorrectCount >= 2;
      setLevelCompleted(true);
      setLevelPassed(passed);
    }

    setScore(updatedScore);
    setCorrectCount(updatedCorrectCount);
  };

  const goToNextLevel = () => {
    const nextLevelIndex = levels.indexOf(currentLevel) + 1;
    if (nextLevelIndex < levels.length) {
      setCurrentLevel(levels[nextLevelIndex]);
      setCurrentQuestionIndex(0);
      setCorrectCount(0);
      setLevelCompleted(false);
    } else {
      setGameOver(true);
    }
  };

  const retryLevel = () => {
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setLevelCompleted(false);
  };

  return (
    <div className="container py-5 text-center">
      {!gameStarted && <StartScreen onStart={startGame} />}

      {gameStarted && !gameOver && !levelCompleted && (
        <QuestionScreen
          question={questionsData[currentLevel][currentQuestionIndex]}
          onAnswer={handleAnswer}
          questionIndex={currentQuestionIndex}
          level={currentLevel}
          totalQuestions={questionsData[currentLevel].length}
        />
      )}

      {/* Level Completion Screen */}
      {levelCompleted && !gameOver && (
        <div className="card p-5 shadow-lg">
          {levelPassed ? (
            <>
              <h2>✅ Well done! You passed the {currentLevel} level.</h2>
              <p>Your score so far: {score}</p>
              <button className="btn btn-success mt-3" onClick={goToNextLevel}>
                Next Level
              </button>
            </>
          ) : (
            <>
              <h2>❌ You didn’t pass the {currentLevel} level.</h2>
              <p>Your score so far: {score}</p>
              <button
                className="btn btn-warning mt-3 me-2"
                onClick={retryLevel}
              >
                Retry Level
              </button>
              <button
                className="btn btn-danger mt-3"
                onClick={() => setGameOver(true)}
              >
                Restart Game
              </button>
            </>
          )}
        </div>
      )}

      {gameOver && <ResultScreen score={score} onRestart={startGame} />}
    </div>
  );
}

export default App;
