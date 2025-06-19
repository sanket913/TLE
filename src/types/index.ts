export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  lastUpdated: Date;
  emailRemindersCount: number;
  emailRemindersEnabled: boolean;
  joinedDate: Date;
}

export interface Contest {
  id: string;
  name: string;
  date: Date;
  rank: number;
  ratingChange: number;
  newRating: number;
  problemsSolved: number;
  totalProblems: number;
}

export interface Problem {
  id: string;
  name: string;
  rating: number;
  tags: string[];
  solvedDate: Date;
  submissionId: string;
}

export interface Submission {
  id: string;
  problemId: string;
  date: Date;
  verdict: 'OK' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR';
  timeConsumed: number;
  memoryConsumed: number;
}

export interface SyncSettings {
  frequency: 'daily' | 'weekly';
  time: string; // HH:MM format
  enabled: boolean;
}

export interface StudentStats {
  totalProblems: number;
  averageRating: number;
  averageProblemsPerDay: number;
  mostDifficultProblem: Problem | null;
  problemsByRating: { [rating: string]: number };
  submissionHeatmap: { [date: string]: number };
}