export type QuestionType = 'choice' | 'tiles' | 'blank';

export interface Question {
  id: string;
  level: number; // 1 to 5
  unit: string; // e.g. "1단원 재미가 톡톡톡"
  category: string; // e.g. "감각적 표현과 흉내말"
  question: string;
  contextSentence?: string; // e.g. "할아버지, 어서 따뜻한 [ ? ] 드세요."
  options: string[]; // 4 choices
  correctAnswer: string;
  chosungHint: string; // e.g. "ㅈㅈ"
  dictionaryTip: string; // Friendly dictionary meaning for 3rd graders
  explanation: string; // Educational explanation
}

export type GameState = 
  | 'READY'       // Title screen
  | 'PLAYING'     // Answering questions
  | 'LEVEL_UP'    // Just cleared a level
  | 'GAME_OVER'   // Finished or time ran out
  | 'REVIEW';     // Review notebook

export interface UserAnswerHistory {
  question: Question;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpentSec: number;
}

export interface LevelInfo {
  level: number;
  name: string;
  badge: string;
  color: string;
  description: string;
  unitTag: string;
}
