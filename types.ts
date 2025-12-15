export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  correctOptionId: string;
}

export enum AppMode {
  LOGIN = 'LOGIN',
  INSTRUCTION = 'INSTRUCTION',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT',
  ADMIN = 'ADMIN'
}

export enum QuizType {
  OFFICIAL = 'OFFICIAL',
  PRACTICE = 'PRACTICE'
}

export interface User {
  fullName: string;
  collegiateNumber: string;
}

export interface QuizState {
  answers: Record<number, string>; // questionId -> optionId
  markedForReview: number[]; // Array of questionIds
  startTime: number;
  isFinished: boolean;
  score: number;
}

export interface ExamResult {
  fullName: string;
  collegiateNumber: string;
  score: number;
  date: string;
  type: QuizType;
}