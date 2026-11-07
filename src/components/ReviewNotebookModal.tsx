import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle2, XCircle, BookOpen, Volume2, Search, Filter } from 'lucide-react';
import { UserAnswerHistory } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface ReviewNotebookModalProps {
  history: UserAnswerHistory[];
  onClose: () => void;
}

export const ReviewNotebookModal: React.FC<ReviewNotebookModalProps> = ({ history, onClose }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'wrong' | 'correct'>('all');

  const filteredHistory = history.filter((item) => {
    if (filterMode === 'wrong') return !item.isCorrect;
    if (filterMode === 'correct') return item.isCorrect;
    return true;
  });

  const wrongCount = history.filter((item) => !item.isCorrect).length;
  const correctCount = history.filter((item) => item.isCorrect).length;

  const playTTS = (item: UserAnswerHistory) => {
    sounds.playPop();
    const text = `${item.question.question}. 정답은 ${item.question.correctAnswer}입니다. ${item.question.explanation}`;
    sounds.speak(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-amber-950/70 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl bg-white rounded-3xl border-4 border-amber-300 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-amber-100 border-b-2 border-amber-200 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-800" />
            <h2 className="font-jua text-xl sm:text-2xl text-amber-950 font-bold">
              초3 국어 낱말 복습노트
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

        {/* Filter Bar (Functional buttons) */}
        <div className="flex items-center justify-between px-5 py-3 bg-amber-50/70 border-b border-amber-100 shrink-0 gap-2">
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => {
                sounds.playPop();
                setFilterMode('all');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              전체 보기 ({history.length})
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setFilterMode('wrong');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterMode === 'wrong'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              틀린 낱말 ({wrongCount})
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setFilterMode('correct');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterMode === 'correct'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              맞힌 낱말 ({correctCount})
            </button>
          </div>

          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
            총 {history.length}문제 학습 기록
          </span>
        </div>

        {/* Scrollable Questions List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-40 text-amber-500" />
              <p className="font-jua text-lg text-slate-600">
                {filterMode === 'wrong'
                  ? '틀린 문제가 없어요! 완벽합니다 🎉'
                  : '학습 기록이 없습니다.'}
              </p>
            </div>
          ) : (
            filteredHistory.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  item.isCorrect
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {item.question.unit}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {item.question.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => playTTS(item)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-amber-900 bg-amber-100 hover:bg-amber-200 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      title="선생님 해설 듣기 (남성 밝은 톤)"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-800" />
                      <span className="hidden sm:inline">해설 듣기</span>
                    </button>
                    {item.isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        정답
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-lg">
                        <XCircle className="w-3.5 h-3.5" />
                        오답
                      </span>
                    )}
                  </div>
                </div>

                <p className="font-bold text-slate-900 text-sm sm:text-base mb-1.5">
                  {item.question.question}
                </p>

                {item.question.contextSentence && (
                  <p className="text-xs sm:text-sm text-slate-600 bg-white/80 p-2 rounded-xl border border-slate-100 mb-2">
                    {item.question.contextSentence}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold mb-2">
                  <div>
                    <span className="text-slate-500 mr-1">정답:</span>
                    <span className="text-emerald-700 font-extrabold font-jua text-base">
                      {item.question.correctAnswer}
                    </span>
                  </div>
                  {!item.isCorrect && (
                    <div>
                      <span className="text-slate-500 mr-1">내가 고른 답:</span>
                      <span className="text-rose-600 line-through">
                        {item.selectedAnswer}
                      </span>
                    </div>
                  )}
                </div>

                {/* Explanation */}
                <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-amber-100">
                  <span className="font-bold text-amber-800 mr-1">💡 낱말 풀이:</span>
                  <span>{item.question.explanation}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-amber-50 border-t border-amber-200 text-center shrink-0">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-jua text-base rounded-xl shadow-xs transition-all cursor-pointer"
          >
            확인 완료
          </button>
        </div>
      </motion.div>
    </div>
  );
};
