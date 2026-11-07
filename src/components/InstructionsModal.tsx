import React from 'react';
import { motion } from 'motion/react';
import { X, Clock, Layers, Flame, Lightbulb, Heart, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface InstructionsModalProps {
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/70 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-amber-100 border-b-2 border-amber-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl select-none" role="img" aria-label="owl">🦉</span>
            <h2 className="font-jua text-2xl text-amber-950 font-bold">
              게임 방법 알아보기
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-amber-200 text-amber-900 transition-colors"
            title="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3.5 text-sm font-medium text-slate-700">
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-950 block">1. 3분 타임어택 챌린지!</span>
              <span className="text-xs text-slate-600">
                제한 시간 3분(180초) 동안 15개의 3학년 1학기 국어 낱말 퀴즈를 해결해요.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-2xl border border-indigo-200">
            <Layers className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-indigo-950 block">2. 5단계 레벨업 시스템!</span>
              <span className="text-xs text-slate-600">
                1단계(감각어) ➔ 2단계(높임말) ➔ 3단계(국어사전) ➔ 4단계(원인·결과) ➔ 5단계(왕관 어휘)로 레벨업해요!
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-2xl border border-rose-200">
            <Heart className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-950 block">3. 3개의 하트 라이프!</span>
              <span className="text-xs text-slate-600">
                틀리면 하트가 줄어들어요. 신중하고 빠르게 알맞은 낱말을 골라보세요.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-2xl border border-orange-200">
            <Flame className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-orange-950 block">4. 연속 정답 피버 모드!</span>
              <span className="text-xs text-slate-600">
                연속으로 정답을 맞추면 콤보 점수와 함께 <b className="text-orange-700">점수 2배 피버 모드</b>가 발동해요.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-950 block">5. 유용한 3가지 힌트 찬스!</span>
              <span className="text-xs text-slate-600">
                어려운 문제는 <b>초성 힌트</b>, <b>국어사전 뜻풀이</b>, <b>50:50 보기 지우기</b> 찬스를 활용하세요!
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-amber-100 border-t border-amber-200 text-center">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-jua text-lg rounded-2xl shadow-md border-b-3 border-amber-700 transition-all cursor-pointer"
          >
            잘 알겠어요! 출발!
          </button>
        </div>
      </motion.div>
    </div>
  );
};
