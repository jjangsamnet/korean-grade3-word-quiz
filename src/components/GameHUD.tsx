import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Heart, Flame, Trophy, Sparkles } from 'lucide-react';
import { LEVEL_INFOS } from '../data/quizData';

interface GameHUDProps {
  currentLevel: number;
  questionIndexInLevel: number; // 0 to 2 (3 questions per level)
  totalQuestionsInLevel: number;
  timeLeftSec: number;
  totalTimeSec: number;
  lives: number;
  maxLives: number;
  score: number;
  combo: number;
  isFever: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  currentLevel,
  questionIndexInLevel,
  totalQuestionsInLevel,
  timeLeftSec,
  totalTimeSec,
  lives,
  maxLives,
  score,
  combo,
  isFever,
}) => {
  const currentLevelInfo = LEVEL_INFOS.find((l) => l.level === currentLevel) || LEVEL_INFOS[0];

  // Time format
  const mins = Math.floor(timeLeftSec / 60);
  const secs = timeLeftSec % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const timePercent = Math.max(0, Math.min(100, (timeLeftSec / totalTimeSec) * 100));
  const isTimeCritical = timeLeftSec <= 30;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      {/* Level Progression Stepper */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 border-2 border-amber-200 shadow-sm">
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {LEVEL_INFOS.map((lvl) => {
            const isCompleted = lvl.level < currentLevel;
            const isCurrent = lvl.level === currentLevel;

            return (
              <div
                key={lvl.level}
                className={`flex-1 flex flex-col items-center p-1.5 sm:p-2 rounded-xl border transition-all text-center ${
                  isCurrent
                    ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-400 font-bold scale-105 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50 border-emerald-300 opacity-90'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-base sm:text-lg select-none">{lvl.badge}</span>
                  <span className={`text-[11px] sm:text-xs hidden md:inline font-semibold ${
                    isCurrent ? 'text-amber-950 font-bold' : isCompleted ? 'text-emerald-800' : 'text-slate-500'
                  }`}>
                    {lvl.level}단계
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-600 truncate max-w-full">
                  {lvl.level === 1 && '새싹'}
                  {lvl.level === 2 && '높임말'}
                  {lvl.level === 3 && '국어사전'}
                  {lvl.level === 4 && '원인·결과'}
                  {lvl.level === 5 && '왕관마스터'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main HUD Row: Timer, Hearts, Score, Combo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* 1. Timer Card */}
        <div className={`flex flex-col justify-between p-2.5 sm:p-3 rounded-2xl border-2 transition-all shadow-xs ${
          isTimeCritical
            ? 'bg-rose-50 border-rose-400 text-rose-800 animate-pulse'
            : 'bg-white border-amber-300 text-amber-950'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-600 animate-spin' : 'text-amber-600'}`} />
              <span>3분 타이머</span>
            </div>
            <span className="font-mono text-base font-extrabold tabular-nums">
              {timeFormatted}
            </span>
          </div>

          {/* Time Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5 border border-slate-200">
            <motion.div
              className={`h-full rounded-full ${
                isTimeCritical ? 'bg-rose-500' : timeLeftSec <= 60 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${timePercent}%` }}
              transition={{ ease: 'linear', duration: 0.3 }}
            />
          </div>
        </div>

        {/* 2. Lives / Hearts Card */}
        <div className="flex flex-col justify-between p-2.5 sm:p-3 bg-white rounded-2xl border-2 border-amber-300 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span>도전 기회</span>
            <span className="text-xs text-amber-700">{lives}/{maxLives}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            {Array.from({ length: maxLives }).map((_, i) => (
              <motion.div
                key={i}
                animate={i >= lives ? { scale: [1, 1.2, 0.8], opacity: 0.3 } : { scale: 1, opacity: 1 }}
                className="select-none"
              >
                <Heart
                  className={`w-6 h-6 ${
                    i < lives
                      ? 'fill-rose-500 text-rose-500 filter drop-shadow-xs'
                      : 'fill-slate-200 text-slate-300'
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. Score Card */}
        <div className="flex flex-col justify-between p-2.5 sm:p-3 bg-white rounded-2xl border-2 border-amber-300 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <div className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>점수</span>
            </div>
            {isFever && (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.2 rounded-md animate-bounce">
                x2배!
              </span>
            )}
          </div>
          <div className="flex items-baseline justify-end gap-1 mt-1 font-jua text-2xl text-amber-900 font-extrabold tabular-nums">
            <span>{score.toLocaleString()}</span>
            <span className="text-xs font-bold font-sans text-amber-700">점</span>
          </div>
        </div>

        {/* 4. Question & Combo Card */}
        <div className={`flex flex-col justify-between p-2.5 sm:p-3 rounded-2xl border-2 shadow-xs transition-colors ${
          combo >= 2 ? 'bg-amber-100/90 border-amber-400' : 'bg-white border-amber-300'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span>진행률</span>
            <span className="text-amber-800">
              {currentLevel}단계 ({questionIndexInLevel + 1}/{totalQuestionsInLevel})
            </span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-slate-500 font-medium">연속 정답</span>
            <div className="flex items-center gap-1">
              <AnimatePresence mode="wait">
                {combo >= 2 ? (
                  <motion.div
                    key={combo}
                    initial={{ scale: 0.6, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0.6 }}
                    className="flex items-center gap-1 text-sm font-bold text-orange-600 font-jua"
                  >
                    <Flame className="w-4 h-4 fill-orange-500 text-orange-600 animate-bounce" />
                    <span>{combo} 콤보!</span>
                  </motion.div>
                ) : (
                  <span className="text-xs font-semibold text-slate-400">0</span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* FEVER MODE Active Banner */}
      <AnimatePresence>
        {isFever && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="w-full bg-gradient-to-r from-amber-400 via-rose-500 to-orange-400 text-white font-jua text-sm sm:text-base py-1.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md animate-pulse"
          >
            <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
            <span>🔥 피버 모드 발동! 정답 시 보너스 점수 2배 획득 중! 🔥</span>
            <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
