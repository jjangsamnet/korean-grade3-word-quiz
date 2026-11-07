import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, Sparkles, ArrowRight, Dices, AlertCircle } from 'lucide-react';
import { Mascot } from './Mascot';
import { sounds } from '../utils/soundEffects';

interface LoginScreenProps {
  onLoginSuccess: (nickname: string) => void;
}

const FUN_NICKNAMES = [
  '씩씩한 호랑이',
  '슬기로운 다람쥐',
  '지혜로운 올빼미',
  '눈부신 토끼',
  '용감한 사자',
  '달콤한 꿀벌',
  '재빠른 치타',
  '꿈꾸는 돌고래',
  '착한 곰돌이',
  '국어 대장 매',
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleRandomNickname = () => {
    sounds.playPop();
    const randomPick = FUN_NICKNAMES[Math.floor(Math.random() * FUN_NICKNAMES.length)];
    setNickname(randomPick);
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = nickname.trim();
    const trimmedPass = password.trim();

    if (!trimmedName) {
      sounds.playWrong();
      setErrorMessage('별명을 입력해 주세요! 멋진 탐험가 이름을 지어볼까요?');
      triggerShake();
      return;
    }

    if (trimmedPass !== '2026') {
      sounds.playWrong();
      setErrorMessage('비밀번호가 올바르지 않아요. (비밀번호: 2026)');
      triggerShake();
      return;
    }

    sounds.playCorrect();
    onLoginSuccess(trimmedName);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Mascot Greeting */}
      <div className="mb-4">
        <Mascot
          mood="happy"
          message="안녕! 탐험가 별명을 적고 비밀번호 '2026'을 입력해줘!"
        />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className={`w-full max-w-md bg-white rounded-3xl border-3 border-amber-300 p-6 sm:p-8 shadow-xl relative transition-all ${
          isShaking ? 'animate-shake border-rose-400' : ''
        }`}
      >
        {/* Card Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>초3 국어 낱말 탐험대 입장</span>
          </div>

          <h2 className="font-jua text-2xl sm:text-3xl font-bold text-amber-950">
            탐험가 등록하기
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            별명을 적고 비밀번호 <strong className="text-amber-700">2026</strong>을 입력해주세요.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nickname Input Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1">
                <User className="w-4 h-4 text-amber-600" />
                <span>탐험가 별명</span>
              </label>

              <button
                type="button"
                onClick={handleRandomNickname}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200 transition-colors cursor-pointer"
              >
                <Dices className="w-3 h-3 text-amber-600" />
                <span>추천 별명</span>
              </button>
            </div>

            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="예: 씩씩한 호랑이, 3반 지우"
              maxLength={12}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none text-base font-bold text-slate-900 bg-slate-50/50 focus:bg-white transition-all"
            />
          </div>

          {/* Password Input Field */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1 mb-1.5">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>비밀번호 (2026)</span>
            </label>

            <input
              type="password"
              inputMode="numeric"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="비밀번호 4자리 입력 (2026)"
              maxLength={8}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none text-base font-bold text-slate-900 bg-slate-50/50 focus:bg-white tracking-widest transition-all"
            />
            <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
              * 입장 비밀번호는 <strong>2026</strong> 입니다.
            </span>
          </div>

          {/* Error Message Notice */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 active:scale-98 text-white font-jua text-xl rounded-2xl shadow-lg border-b-4 border-orange-700 transition-all cursor-pointer"
          >
            <span>탐험 시작하기!</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
