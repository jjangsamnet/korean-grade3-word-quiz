import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { LEVEL_INFOS } from '../data/quizData';
import { sounds } from '../utils/soundEffects';

interface LevelUpModalProps {
  completedLevel: number;
  score: number;
  onProceedToNextLevel: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  completedLevel,
  score,
  onProceedToNextLevel,
}) => {
  const completedInfo = LEVEL_INFOS.find((l) => l.level === completedLevel) || LEVEL_INFOS[0];
  const nextInfo = LEVEL_INFOS.find((l) => l.level === completedLevel + 1);

  useEffect(() => {
    sounds.playLevelUp();
    // Confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
      });
    } catch {
      // fallback
    }
  }, [completedLevel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/60 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-white rounded-3xl border-4 border-amber-400 p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Top Sunburst */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-amber-200 to-transparent rounded-full opacity-50 blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
            className="w-20 h-20 mx-auto rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-4xl shadow-inner select-none"
          >
            {completedInfo.badge}
          </motion.div>

          <div>
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 w-fit mx-auto px-3 py-1 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>레벨 클리어!</span>
            </div>
            <h3 className="font-jua text-2xl sm:text-3xl text-amber-950 font-bold">
              {completedInfo.name} 완수!
            </h3>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              {completedInfo.description}
            </p>
          </div>

          <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 flex items-center justify-around text-center">
            <div>
              <span className="text-xs text-slate-500 font-bold block">획득 점수</span>
              <span className="font-jua text-2xl text-amber-900 font-extrabold tabular-nums">
                {score.toLocaleString()}점
              </span>
            </div>
            <div className="w-px h-8 bg-amber-200" />
            <div>
              <span className="text-xs text-slate-500 font-bold block">레벨 보너스</span>
              <span className="font-jua text-2xl text-emerald-600 font-extrabold">
                +300점
              </span>
            </div>
          </div>

          {nextInfo && (
            <div className="p-3 bg-indigo-50/80 rounded-2xl border border-indigo-200 text-left">
              <span className="text-xs font-bold text-indigo-700 block">다음 스테이지</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl select-none">{nextInfo.badge}</span>
                <span className="font-jua text-base font-bold text-indigo-950">
                  {nextInfo.name}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              sounds.playPop();
              onProceedToNextLevel();
            }}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-98 text-white font-jua text-xl rounded-2xl shadow-lg border-b-4 border-orange-700 transition-all cursor-pointer"
          >
            <span>다음 단계 출발하기!</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
