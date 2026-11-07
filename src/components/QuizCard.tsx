import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Lightbulb, BookMarked, Scissors, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Question } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onSelectOption: (option: string) => void;
  selectedOption: string | null;
  isAnswerSubmitted: boolean;
  onNextQuestion: () => void;
  isShaking: boolean;
  eliminatedOptions: string[];
  showChosung: boolean;
  showDictionaryTip: boolean;
  onUseChosungHint: () => void;
  onUseDictHint: () => void;
  onUseFiftyFifty: () => void;
  availableFiftyFifty: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onSelectOption,
  selectedOption,
  isAnswerSubmitted,
  onNextQuestion,
  isShaking,
  eliminatedOptions,
  showChosung,
  showDictionaryTip,
  onUseChosungHint,
  onUseDictHint,
  onUseFiftyFifty,
  availableFiftyFifty,
}) => {
  const [isPlayingQuestionTTS, setIsPlayingQuestionTTS] = useState(false);
  const [isPlayingExplanationTTS, setIsPlayingExplanationTTS] = useState(false);

  // Play question text in bright male tone
  const handleQuestionTTS = () => {
    sounds.playPop();
    if (isPlayingQuestionTTS) {
      sounds.stopSpeaking();
      setIsPlayingQuestionTTS(false);
      return;
    }
    sounds.stopSpeaking();
    setIsPlayingExplanationTTS(false);
    setIsPlayingQuestionTTS(true);

    const fullSpeech = `${question.question}. ${question.contextSentence?.replace('[ ? ]', '빈칸') || ''}`;
    sounds.speak(fullSpeech, () => {
      setIsPlayingQuestionTTS(false);
    });
  };

  // Play explanation text in bright male tone
  const handleExplanationTTS = () => {
    sounds.playPop();
    if (isPlayingExplanationTTS) {
      sounds.stopSpeaking();
      setIsPlayingExplanationTTS(false);
      return;
    }
    sounds.stopSpeaking();
    setIsPlayingQuestionTTS(false);
    setIsPlayingExplanationTTS(true);

    const prefix = isCorrect ? '정답입니다! ' : `정답은 ${question.correctAnswer}입니다. `;
    const speech = `${prefix}${question.explanation}`;
    sounds.speak(speech, () => {
      setIsPlayingExplanationTTS(false);
    });
  };

  const isCorrect = selectedOption === question.correctAnswer;

  // Auto-play explanation in bright male tone when answer is submitted
  useEffect(() => {
    if (isAnswerSubmitted) {
      const timer = setTimeout(() => {
        setIsPlayingExplanationTTS(true);
        const prefix = isCorrect ? '정답입니다! ' : `정답은 ${question.correctAnswer}입니다. `;
        const speech = `${prefix}${question.explanation}`;
        sounds.speak(speech, () => {
          setIsPlayingExplanationTTS(false);
        });
      }, 500);

      return () => {
        clearTimeout(timer);
        sounds.stopSpeaking();
        setIsPlayingExplanationTTS(false);
      };
    } else {
      sounds.stopSpeaking();
      setIsPlayingExplanationTTS(false);
      setIsPlayingQuestionTTS(false);
    }
  }, [isAnswerSubmitted, isCorrect, question]);

  return (
    <div
      className={`w-full max-w-4xl mx-auto bg-white rounded-3xl border-3 border-amber-300 shadow-lg p-5 sm:p-7 relative transition-all ${
        isShaking ? 'animate-shake border-rose-400' : ''
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <span className="bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold px-3 py-1 rounded-full border border-amber-200">
            {question.unit}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-500">
            {question.category}
          </span>
        </div>

        {/* TTS Read-Aloud Button */}
        <button
          onClick={handleQuestionTTS}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
            isPlayingQuestionTTS
              ? 'bg-amber-400 text-amber-950 border-amber-500 scale-95 shadow-inner'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 shadow-2xs'
          }`}
          title="문제를 밝은 남성 선생님 목소리로 들어보세요"
        >
          <Volume2 className={`w-4 h-4 ${isPlayingQuestionTTS ? 'animate-bounce text-amber-950' : 'text-amber-700'}`} />
          <span>{isPlayingQuestionTTS ? '문제 읽는 중...' : '문제 듣기'}</span>
        </button>
      </div>

      {/* Main Question Heading */}
      <div className="mt-4 mb-3">
        <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
          <span className="text-amber-600 font-jua mr-1.5">Q{questionNumber}.</span>
          {question.question}
        </h2>
      </div>

      {/* Context Sentence Card with Highlighted Blank Box */}
      {question.contextSentence && (
        <div className="my-4 p-4 sm:p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-200 text-center shadow-xs">
          <p className="text-lg sm:text-xl font-bold text-slate-800 leading-relaxed font-sans">
            {question.contextSentence.split('[ ? ]').map((part, idx, arr) => (
              <React.Fragment key={idx}>
                <span>{part}</span>
                {idx < arr.length - 1 && (
                  <span
                    className={`inline-block mx-1.5 px-3 py-1 rounded-xl font-jua text-xl border-2 transition-all ${
                      isAnswerSubmitted
                        ? isCorrect
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-400 font-extrabold'
                          : 'bg-rose-100 text-rose-800 border-rose-400 font-extrabold line-through'
                        : selectedOption
                        ? 'bg-amber-200 text-amber-950 border-amber-400'
                        : 'bg-white text-amber-700 border-dashed border-amber-400 min-w-[70px] shadow-inner'
                    }`}
                  >
                    {isAnswerSubmitted
                      ? isCorrect
                        ? question.correctAnswer
                        : selectedOption
                      : selectedOption || ' ? '}
                  </span>
                )}
              </React.Fragment>
            ))}
          </p>
        </div>
      )}

      {/* Active Hint Displays (Chosung & Dictionary) */}
      <div className="space-y-2 mb-4">
        {showChosung && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-3 bg-amber-100/90 rounded-2xl border border-amber-300 text-amber-950 text-sm font-bold"
          >
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
            <span>초성 힌트:</span>
            <span className="font-jua text-lg tracking-widest bg-white px-2.5 py-0.5 rounded-lg border border-amber-300 text-orange-600">
              {question.chosungHint}
            </span>
          </motion.div>
        )}

        {showDictionaryTip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-start gap-2 p-3 bg-sky-50 rounded-2xl border border-sky-200 text-sky-950 text-sm font-medium"
          >
            <BookMarked className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sky-800 mr-1.5">[국어사전 뜻풀이]</span>
              <span>{question.dictionaryTip}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* 4 Choices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {question.options.map((option, idx) => {
          const isEliminated = eliminatedOptions.includes(option);
          const isSelected = selectedOption === option;
          const isThisCorrect = option === question.correctAnswer;

          let btnStyle = 'bg-white border-2 border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/50 shadow-xs';

          if (isAnswerSubmitted) {
            if (isThisCorrect) {
              btnStyle = 'bg-emerald-500 border-2 border-emerald-600 text-white font-extrabold ring-4 ring-emerald-200 shadow-md scale-102';
            } else if (isSelected && !isThisCorrect) {
              btnStyle = 'bg-rose-500 border-2 border-rose-600 text-white font-bold opacity-90';
            } else {
              btnStyle = 'bg-slate-100 border-2 border-slate-200 text-slate-400 opacity-50';
            }
          } else if (isSelected) {
            btnStyle = 'bg-amber-200 border-2 border-amber-500 text-amber-950 font-bold';
          }

          if (isEliminated) {
            btnStyle = 'bg-slate-100 border-2 border-slate-200 text-slate-300 opacity-30 cursor-not-allowed line-through';
          }

          return (
            <button
              key={idx}
              disabled={isAnswerSubmitted || isEliminated}
              onClick={() => onSelectOption(option)}
              className={`flex items-center justify-between p-4 rounded-2xl text-left transition-all font-sans text-base sm:text-lg min-h-[58px] ${btnStyle} active:scale-98`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-jua text-sm font-bold shrink-0 ${
                  isAnswerSubmitted && isThisCorrect
                    ? 'bg-white text-emerald-700'
                    : isAnswerSubmitted && isSelected && !isThisCorrect
                    ? 'bg-white text-rose-700'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {idx + 1}
                </span>
                <span className="font-bold tracking-tight">{option}</span>
              </div>

              {isAnswerSubmitted && (
                <div className="shrink-0">
                  {isThisCorrect && <CheckCircle2 className="w-6 h-6 text-white" />}
                  {isSelected && !isThisCorrect && <XCircle className="w-6 h-6 text-white" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Explanation & Next Question Action Bar */}
      <AnimatePresence>
        {isAnswerSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-5 p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-jua text-base sm:text-lg font-bold">
                  {isCorrect ? '🎉 정답입니다! 최고예요!' : '💡 아쉬워요! 정답을 확인해 보세요.'}
                </span>
                {!isCorrect && (
                  <span className="text-xs font-bold bg-white text-rose-700 px-2 py-0.5 rounded-md border border-rose-200">
                    정답: {question.correctAnswer}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-medium opacity-90 leading-relaxed">
                {question.explanation}
              </p>

              {/* Voice Explanation Audio Player (Bright Male Tone) */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-black/5">
                <button
                  type="button"
                  onClick={handleExplanationTTS}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    isPlayingExplanationTTS
                      ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-inner scale-98'
                      : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-300 shadow-2xs active:scale-95'
                  }`}
                  title="설명을 밝은 남성 선생님 목소리로 들어보세요"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingExplanationTTS ? 'animate-bounce text-amber-950' : 'text-amber-700'}`} />
                  <span>
                    {isPlayingExplanationTTS ? '선생님 설명 읽어주는 중...' : '선생님 설명 듣기 (남성 음성)'}
                  </span>
                </button>
                <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                  🧑‍🏫 밝은 남성 선생님 해설
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.stopSpeaking();
                sounds.playPop();
                onNextQuestion();
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-jua text-base rounded-2xl shadow-md border-b-3 border-amber-700 transition-all shrink-0 cursor-pointer"
            >
              <span>{questionNumber >= totalQuestions ? '결과 확인하기' : '다음 문제'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Educational Hint Controls Bar (Before answering) */}
      {!isAnswerSubmitted && (
        <div className="mt-4 pt-3 border-t border-amber-100 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-amber-800">
            도움이 필요할 땐 힌트 찬스를 써보세요!
          </span>

          <div className="flex items-center gap-1.5">
            {/* Chosung Hint Button */}
            <button
              onClick={onUseChosungHint}
              disabled={showChosung}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                showChosung
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-2xs active:scale-95'
              }`}
              title="초성 자음 힌트 보기"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
              <span>초성 힌트</span>
            </button>

            {/* Dictionary Meaning Hint Button */}
            <button
              onClick={onUseDictHint}
              disabled={showDictionaryTip}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                showDictionaryTip
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-sky-100 hover:bg-sky-200 text-sky-900 border-sky-300 shadow-2xs active:scale-95'
              }`}
              title="사전 뜻풀이 힌트 보기"
            >
              <BookMarked className="w-3.5 h-3.5 text-sky-700" />
              <span>사전 뜻</span>
            </button>

            {/* 50:50 Eliminator */}
            <button
              onClick={onUseFiftyFifty}
              disabled={!availableFiftyFifty || eliminatedOptions.length > 0}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                !availableFiftyFifty || eliminatedOptions.length > 0
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-rose-100 hover:bg-rose-200 text-rose-900 border-rose-300 shadow-2xs active:scale-95'
              }`}
              title="오답 2개 지우기 찬스"
            >
              <Scissors className="w-3.5 h-3.5 text-rose-700" />
              <span>50:50 ({availableFiftyFifty ? '1회' : '0회'})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
