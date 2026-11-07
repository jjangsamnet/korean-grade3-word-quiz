import React from 'react';
import { Volume2, VolumeX, HelpCircle, BookOpen, Trophy } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHelp: () => void;
  onOpenNotebook?: () => void;
  onOpenLeaderboard?: () => void;
  hasHistory?: boolean;
  learnerNickname?: string | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onOpenHelp,
  onOpenNotebook,
  onOpenLeaderboard,
  hasHistory = false,
  learnerNickname,
  onLogout,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-8 py-3.5 bg-amber-400/90 backdrop-blur-md border-b-2 border-amber-500 shadow-sm sticky top-0 z-30">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-2">
        <span className="text-2xl select-none" role="img" aria-label="rabbit">🐰</span>
        <div className="font-jua text-xl sm:text-2xl text-amber-950 font-bold tracking-tight whitespace-nowrap shrink-0 drop-shadow-xs">
          초3 국어 낱말 탐험대
        </div>
      </div>

      {/* Zone 2: Learner Badge / Educational Target */}
      <div className="hidden md:flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-300/60 px-3 py-1 rounded-full border border-amber-400">
        {learnerNickname ? (
          <>
            <span className="text-amber-950">⭐ [{learnerNickname}] 탐험가</span>
            <span aria-hidden="true">·</span>
            <span>3학년 1학기 국어 5단계 3분 챌린지</span>
          </>
        ) : (
          <>
            <span>초등 3학년 1학기 국어과 교육과정</span>
            <span aria-hidden="true">·</span>
            <span>5단계 레벨업 3분 챌린지</span>
          </>
        )}
      </div>

      {/* Zone 3: Primary Utility Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {learnerNickname && onLogout && (
          <button
            onClick={() => {
              sounds.playPop();
              onLogout();
            }}
            className="px-2.5 py-1.5 text-xs font-bold text-amber-950 bg-white/70 hover:bg-white rounded-xl border border-amber-300 shadow-2xs active:scale-95 transition-all whitespace-nowrap shrink-0"
            title="다른 별명으로 변경하기"
          >
            <span className="md:hidden">[{learnerNickname}] </span>
            <span>변경</span>
          </button>
        )}

        {onOpenLeaderboard && (
          <button
            onClick={() => {
              sounds.playPop();
              onOpenLeaderboard();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl border border-amber-400 shadow-2xs active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            title="실시간 리더보드 순위 보기"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">리더보드</span>
          </button>
        )}

        {hasHistory && onOpenNotebook && (
          <button
            onClick={() => {
              sounds.playPop();
              onOpenNotebook();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-amber-900 rounded-xl border border-amber-300 shadow-xs hover:bg-amber-50 active:scale-95 transition-all whitespace-nowrap shrink-0"
            title="나의 낱말 오답노트"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">낱말 복습노트</span>
          </button>
        )}

        <button
          onClick={() => {
            sounds.playPop();
            onOpenHelp();
          }}
          className="p-2 text-amber-950 bg-white/80 hover:bg-white rounded-xl border border-amber-300 shadow-xs active:scale-95 transition-all"
          title="게임 방법 보기"
          aria-label="게임 도움말"
        >
          <HelpCircle className="w-5 h-5 text-amber-800" />
        </button>

        <button
          onClick={onToggleMute}
          className="p-2 text-amber-950 bg-white/80 hover:bg-white rounded-xl border border-amber-300 shadow-xs active:scale-95 transition-all"
          title={isMuted ? '소리 켜기' : '소리 끄기'}
          aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-rose-600" />
          ) : (
            <Volume2 className="w-5 h-5 text-amber-800" />
          )}
        </button>
      </div>
    </header>
  );
};
