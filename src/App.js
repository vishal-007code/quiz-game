import React, { useState, useEffect } from "react";
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
  const [shuffledQuestions, setShuffledQuestions] = useState({ easy: [], medium: [], hard: [] });
  const [hasSavedGame, setHasSavedGame] = useState(false);

  const STORAGE_KEY = "quiz_progress_v1";
  const levels = ["easy", "medium", "hard"];

  const shuffleArray = (array) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const buildShuffledForAll = () => ({
    easy: shuffleArray(questionsData.easy || []),
    medium: shuffleArray(questionsData.medium || []),
    hard: shuffleArray(questionsData.hard || []),
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setHasSavedGame(Boolean(raw));
    } catch (_) {
      setHasSavedGame(false);
    }
  }, []);

  useEffect(() => {
    if (!gameStarted) return;
    try {
      const payload = {
        gameStarted,
        currentLevel,
        currentQuestionIndex,
        score,
        correctCount,
        gameOver,
        levelCompleted,
        levelPassed,
        shuffledQuestions,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setHasSavedGame(true);
    } catch (_) {
    }
  }, [gameStarted, currentLevel, currentQuestionIndex, score, correctCount, gameOver, levelCompleted, levelPassed, shuffledQuestions]);

  const clearSavedGame = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHasSavedGame(false);
    } catch (_) {
    }
  };

  const startGame = () => {
    const shuffled = buildShuffledForAll();

    setShuffledQuestions(shuffled);
    setGameStarted(true);
    setCurrentLevel("easy");
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectCount(0);
    setGameOver(false);
    setLevelCompleted(false);
    setLevelPassed(false);
    clearSavedGame();
  };

  const resumeGame = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || !data.shuffledQuestions) return;
      setShuffledQuestions(data.shuffledQuestions);
      setGameStarted(true);
      setCurrentLevel(data.currentLevel || "easy");
      setCurrentQuestionIndex(Number(data.currentQuestionIndex) || 0);
      setScore(Number(data.score) || 0);
      setCorrectCount(Number(data.correctCount) || 0);
      setGameOver(Boolean(data.gameOver));
      setLevelCompleted(Boolean(data.levelCompleted));
      setLevelPassed(Boolean(data.levelPassed));
    } catch (_) {
      startGame();
    }
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

    if (currentQuestionIndex + 1 < (shuffledQuestions[currentLevel]?.length || 0)) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const passed = updatedCorrectCount >= 2;
      
      if (currentLevel === "hard") {
        setGameOver(true);
      } else {
        setLevelCompleted(true);
        setLevelPassed(passed);
      }
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
    setShuffledQuestions((prev) => ({
      ...prev,
      [currentLevel]: shuffleArray(questionsData[currentLevel] || []),
    }));
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setLevelCompleted(false);
  };

  const currentLevelQuestions = shuffledQuestions[currentLevel] || [];

  return (
    <div className="container py-5 text-center">
      {!gameStarted && (
        <StartScreen onStart={startGame} onResume={resumeGame} hasSavedGame={hasSavedGame} />
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
