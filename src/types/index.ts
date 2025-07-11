export interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';
  language: 'javascript' | 'python';
  xpReward: number;
  estimatedTime: number;
  tags: string[];
  instructions: string;
  starterCode: {
    javascript: string;
    python: string;
  };
  hints: string[];
  testCases: TestCase[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description: string;
  isHidden: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  totalXp: number;
  level: number;
  isAdmin: boolean;
  createdAt: string;
}

export interface UserProgress {
  totalXp: number;
  level: number;
  completedTasks: string[];
  currentStreak: number;
  tasksProgress: Record<string, TaskProgress>;
  userId?: string;
}

export interface TaskProgress {
  attempts: number;
  completed: boolean;
  bestTime?: number;
  lastAttempt: string;
  passedTests: number;
  totalTests: number;
  language: 'javascript' | 'python';
}

export interface CodeExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  passedTests: number;
  totalTests: number;
  testResults: TestResult[];
}

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualOutput: string;
  error?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}