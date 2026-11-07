import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Award, BookOpen, Clock, Heart, Flame, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';

import { Question, GameState, UserAnswerHistory } from './types/game';
import { LEVEL_INFOS, getGameQuestions } from './data/quizData';
import { sounds } from './utils/soundEffects';
import { Header } from './components/Header';
import { Mascot, MascotMood } from './components/Mascot';
import { GameHUD } from './components/GameHUD';
import { QuizCard } from './components/QuizCard';
import { LevelUpModal } from './components/LevelUpModal';
import { GameOverModal } from './components/GameOverModal';
import { ReviewNotebookModal } from './components/ReviewNotebookModal';
import { InstructionsModal } from './components/InstructionsModal';
import { LoginScreen } from './components/LoginScreen';

const TOTAL_GAME_TIME_SEC = 180; // 3 minutes total
const QUESTIONS_PER_LEVEL = 3;
const MAX_LIVES = 3;

export default function App() {
  // Learner Authentication State
  const [learnerNickname, setLearnerNickname] = useState<string | null>(() => {
    return localStorage.getItem('wordgame_nickname') || null;
  });

  // Game Flow States
  const [gameState, setGameState] = useState<GameState>('READY');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeftSec, setTimeLeftSec] = useState(TOTAL_GAME_TIME_SEC);

  // Question Interaction States
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [showChosung, setShowChosung] = useState(false);
  const [showDictionaryTip, setShowDictionaryTip] = useState(false);
  const [availableFiftyFifty, setAvailableFiftyFifty] = useState(true);

  // Mascot & Mood
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [mascotMessage, setMascotMessage] = useState(
    learnerNickname
      ? `반가워, ${learnerNickname} 탐험가! 3분 낱말 탐험을 시작해볼까?`
      : '안녕! 3학년 국어 낱말 탐험을 떠나볼까?'
  );

  // Handle Login
  const handleLoginSuccess = (name: string) => {
    setLearnerNickname(name);
    localStorage.setItem('wordgame_nickname', name);
    setMascotMood('happy');
    setMascotMessage(`반가워, ${name} 탐험가! 3분 낱말 탐험을 시작해볼까?`);
    setGameState('READY');
  };

  // Handle Logout
  const handleLogout = () => {
    setLearnerNickname(null);
    localStorage.removeItem('wordgame_nickname');
    setGameState('READY');
  };

  // Audio & Modals
  const [isMuted, setIsMuted] = useState(sounds.isMuted);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showReviewNotebook, setShowReviewNotebook] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'victory' | 'timeout' | 'lives'>('victory');
  const [history, setHistory] = useState<UserAnswerHistory[]>([]);

  // High score tracking
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('wordgame_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const questionStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Current Level Calculations
  const currentQuestion = questions[currentIndex];
  const currentLevel = currentQuestion ? currentQuestion.level : 1;
  const questionIndexInLevel = currentIndex % QUESTIONS_PER_LEVEL;
  const isFever = combo >= 3;

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
  };

  // Start / Restart Game
  const startNewGame = useCallback(() => {
    sounds.playPop();
    const newQuestions = getGameQuestions();
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(MAX_LIVES);
    setTimeLeftSec(TOTAL_GAME_TIME_SEC);
    setHistory([]);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsShaking(false);
    setEliminatedOptions([]);
    setShowChosung(false);
    setShowDictionaryTip(false);
    setAvailableFiftyFifty(true);
    setMascotMood('cheer');
    setMascotMessage('1단계 새싹 어휘 탐험 시작! 3분 동안 힘차게 달려보자!');
    setGameState('PLAYING');
    questionStartTimeRef.current = Date.now();
  }, []);

  // Timer Tick
  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeftSec((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setGameOverReason('timeout');
            setGameState('GAME_OVER');
            return 0;
          }
          if (prev === 30 || prev === 10 || prev <= 5) {
            sounds.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameState]);

  // Handle Option Select
  const handleSelectOption = (option: string) => {
    if (isAnswerSubmitted || !currentQuestion) return;

    sounds.playPop();
    setSelectedOption(option);
    setIsAnswerSubmitted(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    const timeSpent = Math.round((Date.now() - questionStartTimeRef.current) / 1000);

    // Save to history
    setHistory((prev) => [
      ...prev,
      {
        question: currentQuestion,
        selectedAnswer: option,
        isCorrect,
        timeSpentSec: timeSpent,
      },
    ]);

    if (isCorrect) {
      sounds.playCorrect();
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));

      // Calculate score: Base 100 + level bonus + combo bonus (x2 if fever)
      const multiplier = newCombo >= 3 ? 2 : 1;
      const points = (100 + currentLevel * 40 + newCombo * 25) * multiplier;
      setScore((prev) => {
        const nextScore = prev + points;
        if (nextScore > highScore) {
          setHighScore(nextScore);
          localStorage.setItem('wordgame_highscore', String(nextScore));
        }
        return nextScore;
      });

      // Confetti burst for correct answer
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore
      }

      // Mascot reaction
      if (newCombo >= 3) {
        sounds.playCombo(newCombo);
        setMascotMood('fever');
        setMascotMessage(`🔥 대단해! ${newCombo}연속 정답! 피버 모드 점수 2배!`);
      } else {
        setMascotMood('happy');
        setMascotMessage('딩동댕! 아주 훌륭해요! 정답을 맞췄어요!');
      }
    } else {
      // Wrong Answer
      sounds.playWrong();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      setCombo(0);
      const nextLives = lives - 1;
      setLives(nextLives);
      setMascotMood('oops');
      setMascotMessage('아쉬워요! 아래 낱말 풀이를 읽고 다음엔 꼭 맞춰봐요!');

      if (nextLives <= 0) {
        setTimeout(() => {
          setGameOverReason('lives');
          setGameState('GAME_OVER');
        }, 1200);
      }
    }
  };

  // Move to Next Question or Level Up
  const handleNextQuestion = () => {
    if (!currentQuestion) return;

    // Check if we just finished question 3 in a level
    const isLevelFinished = questionIndexInLevel === QUESTIONS_PER_LEVEL - 1;
    const isGameFinished = currentIndex >= questions.length - 1;

    if (isGameFinished) {
      setGameOverReason('victory');
      setGameState('GAME_OVER');
      return;
    }

    if (isLevelFinished) {
      // Level Up!
      setScore((prev) => prev + 300); // 300 pts level clear bonus
      setGameState('LEVEL_UP');
      return;
    }

    // Otherwise, advance to next question in same level
    advanceQuestionState(currentIndex + 1);
  };

  const advanceQuestionState = (nextIdx: number) => {
    setCurrentIndex(nextIdx);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsShaking(false);
    setEliminatedOptions([]);
    setShowChosung(false);
    setShowDictionaryTip(false);
    setMascotMood(combo >= 3 ? 'fever' : 'cheer');
    setMascotMessage('다음 문제도 자신 있게 풀어보자!');
    questionStartTimeRef.current = Date.now();
  };

  // Proceed after LevelUp Modal
  const handleProceedAfterLevelUp = () => {
    advanceQuestionState(currentIndex + 1);
    setAvailableFiftyFifty(true); // replenish 50:50 each level!
    setGameState('PLAYING');
  };

  // Hint: Chosung
  const handleUseChosungHint = () => {
    sounds.playPop();
    setShowChosung(true);
    setMascotMood('cheer');
    setMascotMessage(`초성 힌트 [${currentQuestion?.chosungHint}]를 보고 유추해봐!`);
  };

  // Hint: Dictionary
  const handleUseDictHint = () => {
    sounds.playPop();
    setShowDictionaryTip(true);
    setMascotMood('cheer');
    setMascotMessage('국어사전 뜻풀이를 차근차근 읽어보자!');
  };

  // Hint: 50:50 Eliminator
  const handleUseFiftyFifty = () => {
    if (!availableFiftyFifty || !currentQuestion) return;
    sounds.playPop();
    const wrongOptions = currentQuestion.options.filter((opt) => opt !== currentQuestion.correctAnswer);
    // Shuffle and pick 2 wrong options to eliminate
    const toEliminate = [...wrongOptions].sort(() => Math.random() - 0.5).slice(0, 2);
    setEliminatedOptions(toEliminate);
    setAvailableFiftyFifty(false);
    setMascotMood('cheer');
    setMascotMessage('헷갈리는 보기 2개를 싹 지워주었어!');
  };

  const correctCount = history.filter((h) => h.isCorrect).length;

  return (
    <div className="min-h-screen bg-amber-50/70 text-slate-800 flex flex-col justify-between selection:bg-amber-200">
      {/* Top Header */}
      <Header
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenHelp={() => setShowInstructions(true)}
        onOpenNotebook={() => setShowReviewNotebook(true)}
        hasHistory={history.length > 0}
        learnerNickname={learnerNickname}
        onLogout={handleLogout}
      />

      {/* Main Game Screen Router */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center">
        {!learnerNickname ? (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        ) : gameState === 'READY' ? (
          <div className="w-full max-w-3xl mx-auto space-y-6 text-center">
            {/* Mascot Greeting */}
            <div className="flex justify-center">
              <Mascot
                mood="happy"
                message={`반가워, ${learnerNickname} 탐험가! 3분 낱말 탐험을 시작해볼까?`}
              />
            </div>

            {/* Title & Description Card */}
            <div className="bg-white rounded-3xl border-3 border-amber-300 p-6 sm:p-9 shadow-xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>3학년 1학기 국어과 교과서 연계 게임</span>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <span>⭐ [{learnerNickname}] 탐험가</span>
                </div>
              </div>

              <h1 className="font-jua text-3xl sm:text-5xl font-extrabold text-amber-950 tracking-tight">
                초3 국어 낱말 탐험대
              </h1>

              <p className="text-slate-600 font-medium text-sm sm:text-base max-w-xl mx-auto mt-2 leading-relaxed">
                3분 동안 5단계 레벨업에 도전하며 재미있게 낱말 퀴즈를 풀고 어휘력 왕관을 차지하세요!
              </p>

              {/* High Score & Badge display */}
              {highScore > 0 && (
                <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm font-bold text-amber-900">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>내 최고 기록:</span>
                  <span className="font-jua text-base text-amber-700 font-extrabold tabular-nums">
                    {highScore.toLocaleString()}점
                  </span>
                </div>
              )}

              {/* 5-Level Curriculum Preview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5 my-6 text-left">
                {LEVEL_INFOS.map((lvl) => (
                  <div
                    key={lvl.level}
                    className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-2xl select-none block mb-1">{lvl.badge}</span>
                      <span className="font-jua text-xs font-bold text-amber-900 block truncate">
                        {lvl.level}단계
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium mt-1 leading-tight line-clamp-2">
                      {lvl.unitTag}
                    </span>
                  </div>
                ))}
              </div>

              {/* Primary Start Action */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={startNewGame}
                  className="w-full max-w-md mx-auto flex items-center justify-center gap-3 py-4 px-8 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 active:scale-98 text-white font-jua text-2xl rounded-2xl shadow-xl border-b-4 border-orange-700 transition-all cursor-pointer"
                >
                  <Play className="w-7 h-7 fill-white" />
                  <span>3분 낱말 탐험 시작하기!</span>
                </button>

                <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> 3분 타임어택
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500" /> 하트 3개
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500" /> 피버 콤보
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : gameState === 'PLAYING' && currentQuestion ? (
          <div className="w-full space-y-4">
            {/* Top Game HUD */}
            <GameHUD
              currentLevel={currentLevel}
              questionIndexInLevel={questionIndexInLevel}
              totalQuestionsInLevel={QUESTIONS_PER_LEVEL}
              timeLeftSec={timeLeftSec}
              totalTimeSec={TOTAL_GAME_TIME_SEC}
              lives={lives}
              maxLives={MAX_LIVES}
              score={score}
              combo={combo}
              isFever={isFever}
            />

            {/* Mascot Banner */}
            <div className="flex justify-start sm:justify-center px-1">
              <Mascot mood={mascotMood} message={mascotMessage} />
            </div>

            {/* Quiz Interaction Card */}
            <QuizCard
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              onSelectOption={handleSelectOption}
              selectedOption={selectedOption}
              isAnswerSubmitted={isAnswerSubmitted}
              onNextQuestion={handleNextQuestion}
              isShaking={isShaking}
              eliminatedOptions={eliminatedOptions}
              showChosung={showChosung}
              showDictionaryTip={showDictionaryTip}
              onUseChosungHint={handleUseChosungHint}
              onUseDictHint={handleUseDictHint}
              onUseFiftyFifty={handleUseFiftyFifty}
              availableFiftyFifty={availableFiftyFifty}
            />
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-3 text-xs text-amber-900/60 font-medium">
        <span>초등학교 3학년 1학기 국어 낱말 탐험대</span>
        <span className="mx-2">·</span>
        <span>교과서 필수 어휘 5단계 마스터</span>
      </footer>

      {/* Level Up Celebratory Modal */}
      {gameState === 'LEVEL_UP' && (
        <LevelUpModal
          completedLevel={currentLevel}
          score={score}
          onProceedToNextLevel={handleProceedAfterLevelUp}
        />
      )}

      {/* Game Over / Victory Modal */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          score={score}
          isVictory={gameOverReason === 'victory'}
          reason={gameOverReason}
          answeredCount={history.length}
          correctCount={correctCount}
          maxCombo={maxCombo}
          highestLevelReached={currentLevel}
          learnerNickname={learnerNickname}
          onRestart={startNewGame}
          onOpenNotebook={() => setShowReviewNotebook(true)}
        />
      )}

      {/* Educational Review Notebook Modal */}
      {showReviewNotebook && (
        <ReviewNotebookModal
          history={history}
          onClose={() => setShowReviewNotebook(false)}
        />
      )}

      {/* Game Instructions Modal */}
      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}
    </div>
  );
}
