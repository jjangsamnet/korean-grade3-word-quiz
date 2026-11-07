import React from 'react';
import { motion } from 'motion/react';
import { X, Trophy, Medal, Star, Flame, Award, Clock, Sparkles } from 'lucide-react';
import { LeaderboardRecord } from '../utils/firebase';
import { sounds } from '../utils/soundEffects';

interface LeaderboardModalProps {
  records: LeaderboardRecord[];
  currentNickname: string | null;
  isLoading: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  records,
  currentNickname,
  isLoading,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-amber-950/70 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl bg-white rounded-3xl border-4 border-amber-300 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 border-b-2 border-amber-500 shrink-0 text-amber-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/90 rounded-2xl shadow-xs">
              <Trophy className="w-6 h-6 text-amber-600 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-jua text-xl sm:text-2xl font-bold tracking-tight">
                  실시간 국어 탐험대 명예의 전당
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold bg-white/80 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  실시간 연동
                </span>
              </div>
              <p className="text-xs text-amber-900/80 font-medium">
                초3 낱말 3분 챌린지 전국 친구들의 최고 점수 리더보드
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/40 text-amber-950 transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Top 3 Podium Highlights (if at least 1 record) */}
        {records.length > 0 && (
          <div className="px-5 py-3 bg-amber-50/80 border-b border-amber-200 shrink-0">
            <div className="grid grid-cols-3 gap-2 text-center">
              {/* 2nd Place */}
              <div className="flex flex-col items-center justify-end p-2 bg-white/90 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xl select-none">🥈</span>
                <span className="text-[11px] font-bold text-slate-500">2등</span>
                <span className="font-jua text-sm text-slate-800 font-bold truncate max-w-full">
                  {records[1] ? records[1].nickname : '-'}
                </span>
                <span className="font-jua text-xs text-amber-700 font-extrabold">
                  {records[1] ? `${records[1].score.toLocaleString()}점` : '-'}
                </span>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center justify-end p-2.5 bg-gradient-to-b from-amber-100 to-amber-50 rounded-2xl border-2 border-amber-400 shadow-xs scale-103">
                <span className="text-2xl select-none">🥇</span>
                <span className="text-[11px] font-bold text-amber-800">1등 챔피언</span>
                <span className="font-jua text-base text-amber-950 font-bold truncate max-w-full">
                  {records[0] ? records[0].nickname : '-'}
                </span>
                <span className="font-jua text-sm text-orange-600 font-extrabold">
                  {records[0] ? `${records[0].score.toLocaleString()}점` : '-'}
                </span>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center justify-end p-2 bg-white/90 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xl select-none">🥉</span>
                <span className="text-[11px] font-bold text-amber-700">3등</span>
                <span className="font-jua text-sm text-slate-800 font-bold truncate max-w-full">
                  {records[2] ? records[2].nickname : '-'}
                </span>
                <span className="font-jua text-xs text-amber-700 font-extrabold">
                  {records[2] ? `${records[2].score.toLocaleString()}점` : '-'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Content List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5 flex-1">
          {isLoading ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto animate-spin text-amber-500" />
              <p className="font-jua text-base text-slate-600">
                실시간 리더보드를 불러오는 중...
              </p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Trophy className="w-12 h-12 mx-auto text-amber-400 opacity-60" />
              <p className="font-jua text-lg text-slate-700">
                아직 등록된 탐험 기록이 없어요!
              </p>
              <p className="text-xs text-slate-500">
                3분 낱말 탐험을 완료하고 첫 번째 명예의 전당 주인공이 되어보세요!
              </p>
            </div>
          ) : (
            records.map((record, idx) => {
              const rank = idx + 1;
              const isMe = currentNickname && record.nickname === currentNickname;

              let rankBadge = (
                <span className="w-7 h-7 rounded-xl flex items-center justify-center font-jua text-sm font-bold bg-slate-100 text-slate-700">
                  {rank}
                </span>
              );

              if (rank === 1) {
                rankBadge = (
                  <span className="w-7 h-7 rounded-xl flex items-center justify-center font-jua text-sm font-bold bg-amber-400 text-amber-950 shadow-xs">
                    🥇
                  </span>
                );
              } else if (rank === 2) {
                rankBadge = (
                  <span className="w-7 h-7 rounded-xl flex items-center justify-center font-jua text-sm font-bold bg-slate-300 text-slate-800 shadow-xs">
                    🥈
                  </span>
                );
              } else if (rank === 3) {
                rankBadge = (
                  <span className="w-7 h-7 rounded-xl flex items-center justify-center font-jua text-sm font-bold bg-amber-600 text-white shadow-xs">
                    🥉
                  </span>
                );
              }

              return (
                <div
                  key={record.id || idx}
                  className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border-2 transition-all ${
                    isMe
                      ? 'bg-amber-100/80 border-amber-400 shadow-xs ring-2 ring-amber-300'
                      : rank <= 3
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-white border-slate-200 hover:border-amber-200'
                  }`}
                >
                  {/* Left: Rank & Nickname */}
                  <div className="flex items-center gap-3 min-w-0">
                    {rankBadge}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-jua text-base sm:text-lg text-slate-900 font-bold truncate">
                          {record.nickname}
                        </span>
                        {isMe && (
                          <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.2 rounded-md">
                            나
                          </span>
                        )}
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: record.stars }).map((_, sIdx) => (
                            <Star key={sIdx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <span>{record.badgeTitle}</span>
                        <span>·</span>
                        <span>정답률 {record.accuracy}%</span>
                        {record.maxCombo >= 2 && (
                          <>
                            <span>·</span>
                            <span className="text-orange-600 font-bold flex items-center gap-0.5">
                              <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                              {record.maxCombo} 콤보
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Score */}
                  <div className="text-right shrink-0 pl-2">
                    <span className="font-jua text-xl sm:text-2xl font-extrabold text-amber-900 tabular-nums block">
                      {record.score.toLocaleString()}점
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {record.levelsCleared}단계 완수
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-amber-50 border-t border-amber-200 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 font-semibold">
            총 {records.length}명의 탐험가가 도전했습니다.
          </span>

          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-jua text-base rounded-xl shadow-xs transition-all cursor-pointer"
          >
            닫기
          </button>
        </div>
      </motion.div>
    </div>
  );
};
