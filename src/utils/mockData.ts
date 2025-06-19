import { Student, Contest, Problem, Submission } from '../types';
import { subDays, format } from 'date-fns';

export const generateMockStudent = (id: string): Student => ({
  id,
  name: `Student ${id}`,
  email: `student${id}@example.com`,
  phone: `+1234567890${id}`,
  codeforcesHandle: `student${id}`,
  currentRating: Math.floor(Math.random() * 2000) + 800,
  maxRating: Math.floor(Math.random() * 2500) + 1000,
  lastUpdated: subDays(new Date(), Math.floor(Math.random() * 7)),
  emailRemindersCount: Math.floor(Math.random() * 5),
  emailRemindersEnabled: Math.random() > 0.3,
  joinedDate: subDays(new Date(), Math.floor(Math.random() * 365)),
});

export const generateMockContests = (count: number): Contest[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `contest-${i}`,
    name: `Contest ${i + 1}`,
    date: subDays(new Date(), Math.floor(Math.random() * 365)),
    rank: Math.floor(Math.random() * 1000) + 1,
    ratingChange: Math.floor(Math.random() * 200) - 100,
    newRating: Math.floor(Math.random() * 2000) + 800,
    problemsSolved: Math.floor(Math.random() * 6) + 1,
    totalProblems: Math.floor(Math.random() * 3) + 6,
  }));
};

export const generateMockProblems = (count: number): Problem[] => {
  const problemTags = ['implementation', 'math', 'greedy', 'dp', 'graph', 'string', 'binary search'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `problem-${i}`,
    name: `Problem ${String.fromCharCode(65 + (i % 26))}`,
    rating: Math.floor(Math.random() * 1500) + 800,
    tags: problemTags.slice(0, Math.floor(Math.random() * 3) + 1),
    solvedDate: subDays(new Date(), Math.floor(Math.random() * 90)),
    submissionId: `sub-${i}`,
  }));
};

export const generateMockSubmissions = (count: number): Submission[] => {
  const verdicts = ['OK', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'RUNTIME_ERROR'] as const;
  
  return Array.from({ length: count }, (_, i) => ({
    id: `submission-${i}`,
    problemId: `problem-${i % 50}`,
    date: subDays(new Date(), Math.floor(Math.random() * 90)),
    verdict: verdicts[Math.floor(Math.random() * verdicts.length)],
    timeConsumed: Math.floor(Math.random() * 2000),
    memoryConsumed: Math.floor(Math.random() * 256000),
  }));
};

export const generateSubmissionHeatmap = (days: number): { [date: string]: number } => {
  const heatmap: { [date: string]: number } = {};
  
  for (let i = 0; i < days; i++) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    heatmap[date] = Math.floor(Math.random() * 10);
  }
  
  return heatmap;
};

export const mockStudents: Student[] = Array.from({ length: 10 }, (_, i) => 
  generateMockStudent((i + 1).toString())
);