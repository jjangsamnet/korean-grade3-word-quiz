import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, Star, RotateCcw, BookOpen, Clock, Heart, Award, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface GameOverModalProps {
  score: number;
  isVictory: boolean;
  reason: 'victory' | 'timeout' | 'lives';
  answeredCount: number;
  correctCount: number;
  maxCombo: number;
  highestLevelReached: number;
  learnerNickname?: string | null;
  onRestart: () => void;
  onOpenNotebook: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  isVictory,
  reason,
  answeredCount,
  correctCount,
  maxCombo,
  highestLevelReached,
  learnerNickname,
  onRestart,
  onOpenNotebook,
}) => {
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // Star calculation (1 to 3 stars)
  let stars = 1;
  if (isVictory || score >= 2000) {
    stars = 3;
  } else if (score >= 1000 || highestLevelReached >= 3) {
    stars = 2;
  }

  // Honorary title for 3rd grade student
  let badgeTitle = '🎈 즐거운 낱말 탐험가';
  if (stars === 3) {
    badgeTitle = '👑 3학년 1학기 국어 어휘 대왕!';
  } else if (stars === 2) {
    badgeTitle = '🌟 알쏭달쏭 낱말 박사!';
  } else {
    badgeTitle = '🌱 쑥쑥 낱말 꿈나무!';
  }

  useEffect(() => {
    if (isVictory || stars >= 2) {
      sounds.playLevelUp();
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
        });
      } catch {
        // fallback
      }
    } else {
      sounds.playPop();
    }
  }, [isVictory, stars]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl border-4 border-amber-400 p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-200/50 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4 text-center">
          {/* Header Title & Reason */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>{learnerNickname ? `${learnerNickname} 탐험가의 3분 결과` : '3분 낱말 탐험 결과'}</span>
            </div>

            <h2 className="font-jua text-2xl sm:text-3xl font-extrabold text-amber-950">
              {reason === 'victory'
                ? '🎉 5단계 국어 탐험 완전 정복!'
                : reason === 'timeout'
                ? '⏰ 3분 타임어택 종료!'
                : '💖 아쉬워요! 하트가 모두 소진되었어요'}
            </h2>
            <p className="text-sm font-semibold text-slate-600 mt-1">
              {badgeTitle}
            </p>
          </div>

          {/* 3-Star Rating with Animations */}
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3].map((starIdx) => (
              <motion.div
                key={starIdx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: starIdx * 0.2, type: 'spring' }}
              >
                <Star
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${
                    starIdx <= stars
                      ? 'fill-amber-400 text-amber-500 filter drop-shadow-md animate-bounce-subtle'
                      : 'fill-slate-200 text-slate-300'
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Total Score Banner */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-4 text-white shadow-md border-b-4 border-orange-600">
            <span className="text-xs sm:text-sm font-bold text-amber-100 block">최종 획득 점수</span>
            <div className="font-jua text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums">
              {score.toLocaleString()}
              <span className="text-xl ml-1 font-sans font-bold">점</span>
            </div>
          </div>

          {/* Stats Breakdown Grid */}
          <div className="grid grid-cols-3 gap-2.5 bg-amber-50 rounded-2xl p-3 border border-amber-200">
            <div className="text-center">
              <span className="text-[11px] font-bold text-slate-500 block">맞힌 문제</span>
              <span className="font-jua text-lg sm:text-xl font-bold text-emerald-700">
                {correctCount} / {answeredCount}
              </span>
            </div>
            <div className="text-center border-x border-amber-200">
              <span className="text-[11px] font-bold text-slate-500 block">정답률</span>
              <span className="font-jua text-lg sm:text-xl font-bold text-amber-900">
                {accuracy}%
              </span>
            </div>
            <div className="text-center">
              <span className="text-[11px] font-bold text-slate-500 block">최대 콤보</span>
              <span className="font-jua text-lg sm:text-xl font-bold text-orange-600">
                {maxCombo} 콤보
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => {
                sounds.playPop();
                onRestart();
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-98 text-white font-jua text-xl rounded-2xl shadow-lg border-b-4 border-orange-700 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>3분 낱말 다시 도전하기!</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                onOpenNotebook();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-white hover:bg-amber-50 active:scale-98 text-amber-900 font-bold text-sm rounded-2xl border-2 border-amber-300 shadow-xs transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>오늘 배운 낱말 복습노트 열기</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
