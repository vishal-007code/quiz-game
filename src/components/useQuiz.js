import { useState, useEffect } from "react";
import questionsData from "../data/questions.json";
import "../css/useQuiz.css";

export default function useQuiz() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState("easy");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [levelPassed, setLevelPassed] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState({
    easy: [],
    medium: [],
    hard: [],
  });
  const [hasSavedGame, setHasSavedGame] = useState(false);

  const STORAGE_KEY = "quiz_progress_v1";
  const levels = ["easy", "medium", "hard"];

  // 🔀 shuffle helper
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

  // Load saved game on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setHasSavedGame(Boolean(raw));
    } catch (_) {
      setHasSavedGame(false);
    }
  }, []);

  // Auto-save progress
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
    } catch (_) {}
  }, [
    gameStarted,
    currentLevel,
    currentQuestionIndex,
    score,
    correctCount,
    gameOver,
    levelCompleted,
    levelPassed,
    shuffledQuestions,
  ]);

  const clearSavedGame = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHasSavedGame(false);
    } catch (_) {}
  };

  // 🎮 Start game
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

  // ⏯ Resume game
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

  // ✅ Handle answers
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

  // ⬆️ Go to next level
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

  // 🔄 Retry current level
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

  return {
    gameStarted,
    currentLevel,
    currentQuestionIndex,
    score,
    correctCount,
    gameOver,
    levelCompleted,
    levelPassed,
    shuffledQuestions,
    hasSavedGame,
    startGame,
    resumeGame,
    handleAnswer,
    goToNextLevel,
    retryLevel,
    currentLevelQuestions,
  };
}
