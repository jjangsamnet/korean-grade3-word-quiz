import React from 'react';
import { motion } from 'motion/react';

export type MascotMood = 'idle' | 'happy' | 'cheer' | 'oops' | 'fever';

interface MascotProps {
  mood: MascotMood;
  message?: string;
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({ mood, message, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Mascot Character - "토글이" (Togeuri the Word Explorer Bunny) */}
      <motion.div
        animate={
          mood === 'happy'
            ? { y: [0, -12, 0], rotate: [-4, 4, 0] }
            : mood === 'fever'
            ? { scale: [1, 1.08, 1], rotate: [-2, 2, -2] }
            : mood === 'oops'
            ? { x: [-4, 4, -4, 0] }
            : { y: [0, -4, 0] }
        }
        transition={{
          repeat: mood === 'happy' || mood === 'oops' ? 1 : Infinity,
          duration: mood === 'fever' ? 0.6 : 1.8,
          ease: 'easeInOut',
        }}
        className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20"
      >
        {/* Glow halo when in fever */}
        {mood === 'fever' && (
          <div className="absolute inset-0 rounded-full bg-amber-400 blur-md opacity-60 animate-pulse" />
        )}

        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none">
          {/* Ears */}
          <ellipse cx="36" cy="22" rx="9" ry="20" fill="#FFEDD5" stroke="#F97316" strokeWidth="3" />
          <ellipse cx="36" cy="22" rx="5" ry="14" fill="#FED7AA" />

          <ellipse cx="64" cy="22" rx="9" ry="20" fill="#FFEDD5" stroke="#F97316" strokeWidth="3" />
          <ellipse cx="64" cy="22" rx="5" ry="14" fill="#FED7AA" />

          {/* Head & Body */}
          <circle cx="50" cy="58" r="32" fill="#FFF7ED" stroke="#F97316" strokeWidth="3.5" />

          {/* Explorer Hat */}
          <ellipse cx="50" cy="38" rx="28" ry="7" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
          <path d="M 32 38 Q 50 18 68 38 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
          {/* Hat Star Badge */}
          <polygon points="50,26 52,31 57,31 53,34 55,39 50,36 45,39 47,34 43,31 48,31" fill="#EF4444" />

          {/* Cheeks */}
          <ellipse cx="32" cy="62" rx="6" ry="3.5" fill="#FCA5A5" opacity="0.8" />
          <ellipse cx="68" cy="62" rx="6" ry="3.5" fill="#FCA5A5" opacity="0.8" />

          {/* Eyes based on mood */}
          {mood === 'happy' || mood === 'fever' ? (
            <>
              {/* Happy closed arched eyes */}
              <path d="M 34 54 Q 40 48 46 54" fill="none" stroke="#7C2D12" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 54 54 Q 60 48 66 54" fill="none" stroke="#7C2D12" strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : mood === 'oops' ? (
            <>
              {/* Oops dizzy eyes */}
              <text x="36" y="56" fontSize="12" fontWeight="bold" fill="#7C2D12" textAnchor="middle">×</text>
              <text x="64" y="56" fontSize="12" fontWeight="bold" fill="#7C2D12" textAnchor="middle">×</text>
            </>
          ) : (
            <>
              {/* Big sparkly curious eyes */}
              <circle cx="39" cy="53" r="4.5" fill="#7C2D12" />
              <circle cx="41" cy="51" r="1.8" fill="#FFFFFF" />
              <circle cx="61" cy="53" r="4.5" fill="#7C2D12" />
              <circle cx="63" cy="51" r="1.8" fill="#FFFFFF" />
            </>
          )}

          {/* Cute Nose */}
          <ellipse cx="50" cy="61" rx="2.5" ry="2" fill="#EA580C" />

          {/* Mouth based on mood */}
          {mood === 'happy' || mood === 'fever' ? (
            <path d="M 44 65 Q 50 72 56 65" fill="#EF4444" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
          ) : mood === 'oops' ? (
            <path d="M 46 68 Q 50 64 54 68" fill="none" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <path d="M 46 64 Q 50 68 54 64" fill="none" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
          )}

          {/* Fever Flame / Sweatdrop */}
          {mood === 'fever' && (
            <g transform="translate(68, 12)">
              <path d="M 0 10 Q 5 0 8 6 Q 10 2 12 10 Q 14 16 7 16 Q 0 16 0 10 Z" fill="#EF4444" />
            </g>
          )}
          {mood === 'oops' && (
            <ellipse cx="74" cy="46" rx="3.5" ry="5.5" fill="#60A5FA" opacity="0.85" transform="rotate(15 74 46)" />
          )}
        </svg>
      </motion.div>

      {/* Speech Bubble */}
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -6 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className="relative bg-white/95 backdrop-blur-sm border-2 border-amber-300 rounded-2xl px-3.5 py-2 shadow-sm text-sm font-bold text-amber-950 max-w-[260px] sm:max-w-xs"
        >
          {/* Arrow pointing left */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-amber-300" />
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-6 border-r-white" />
          <span className="leading-snug">{message}</span>
        </motion.div>
      )}
    </div>
  );
};
