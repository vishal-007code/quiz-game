import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import StartScreen from "./components/StartScreen";
import QuestionScreen from "./components/QuestionScreen";
import ResultScreen from "./components/ResultScreen";
import useQuiz from "./components/useQuiz"; // 👈 import custom hook
import "./App.css";

function App() {
  const {
    gameStarted,
    currentLevel,
    currentQuestionIndex,
    score,
    gameOver,
    levelCompleted,
    levelPassed,
    hasSavedGame,
    startGame,
    resumeGame,
    handleAnswer,
    goToNextLevel,
    retryLevel,
    currentLevelQuestions,
  } = useQuiz();

  return (
    <div className="quiz-wrapper">
      {!gameStarted && (
        <StartScreen
          onStart={startGame}
          onResume={resumeGame}
          hasSavedGame={hasSavedGame}
        />
      )}

      {gameStarted && !gameOver && !levelCompleted && currentLevelQuestions.length > 0 && (
        <QuestionScreen
          question={currentLevelQuestions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          questionIndex={currentQuestionIndex}
          level={currentLevel}
          totalQuestions={currentLevelQuestions.length}
        />
      )}

      {levelCompleted && !gameOver && (
        <div className="card quiz-card p-5 shadow-lg">
          {levelPassed ? (
            <>
              <h2 className="quiz-title">✅ Well done!</h2>
              <p className="quiz-subtitle">
                You passed the <b>{currentLevel}</b> level 🎉
              </p>
              <p>Your score so far: <b>{score}</b></p>
              <button className="btn start-btn mt-3" onClick={goToNextLevel}>
                Next Level 🚀
              </button>
            </>
          ) : (
            <>
              <h2 className="quiz-title">❌ Oops!</h2>
              <p className="quiz-subtitle">
                You didn’t pass the <b>{currentLevel}</b> level.
              </p>
              <p>Your score so far: <b>{score}</b></p>
              <div className="d-flex gap-3 justify-content-center mt-3">
                <button className="btn start-btn" onClick={retryLevel}>
                  🔄 Retry Level
                </button>
                <button className="btn resume-btn" onClick={startGame}>
                  🔁 Restart Game
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {gameOver && <ResultScreen score={score} onRestart={startGame} />}
    </div>
  );
}

export default App;
