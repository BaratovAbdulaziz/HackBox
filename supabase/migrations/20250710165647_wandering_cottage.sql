/*
  # Initial HackBox Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `username` (text, unique)
      - `password_hash` (text)
      - `total_xp` (integer)
      - `level` (integer)
      - `is_admin` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `last_login` (timestamp)

    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `difficulty` (text)
      - `language` (text)
      - `xp_reward` (integer)
      - `estimated_time` (integer)
      - `tags` (jsonb)
      - `instructions` (text)
      - `starter_code` (jsonb)
      - `hints` (jsonb)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `test_cases`
      - `id` (uuid, primary key)
      - `task_id` (uuid, foreign key)
      - `input_data` (text)
      - `expected_output` (text)
      - `description` (text)
      - `is_hidden` (boolean)
      - `created_at` (timestamp)

    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `task_id` (uuid, foreign key)
      - `completed` (boolean)
      - `attempts` (integer)
      - `best_execution_time` (integer)
      - `last_attempt_at` (timestamp)
      - `passed_tests` (integer)
      - `total_tests` (integer)
      - `language` (text)
      - `xp_earned` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  total_xp integer DEFAULT 0,
  level integer DEFAULT 1,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'easy', 'medium', 'hard', 'expert')),
  language text NOT NULL CHECK (language IN ('javascript', 'python')),
  xp_reward integer DEFAULT 100,
  estimated_time integer DEFAULT 30,
  tags jsonb DEFAULT '[]'::jsonb,
  instructions text NOT NULL,
  starter_code jsonb DEFAULT '{}'::jsonb,
  hints jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create test_cases table
CREATE TABLE IF NOT EXISTS test_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  input_data text,
  expected_output text NOT NULL,
  description text,
  is_hidden boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  attempts integer DEFAULT 0,
  best_execution_time integer,
  last_attempt_at timestamptz DEFAULT now(),
  passed_tests integer DEFAULT 0,
  total_tests integer DEFAULT 0,
  language text DEFAULT 'javascript',
  xp_earned integer DEFAULT 0,
  UNIQUE(user_id, task_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_tasks_difficulty ON tasks(difficulty);
CREATE INDEX IF NOT EXISTS idx_tasks_language ON tasks(language);
CREATE INDEX IF NOT EXISTS idx_test_cases_task ON test_cases(task_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_task ON user_progress(task_id);

-- Insert sample tasks
INSERT INTO tasks (title, description, difficulty, language, xp_reward, estimated_time, tags, instructions, starter_code, hints) VALUES
('Hello World', 'Create your first function that returns a greeting message', 'beginner', 'javascript', 50, 10, 
'["basics", "strings", "functions"]', 
'Write a function called "helloWorld" that returns the exact string "Hello, World!".',
'{"javascript": "function helloWorld() {\n  // Return \"Hello, World!\" string\n  return ;\n}", "python": "def hello_world():\n    # Return \"Hello, World!\" string\n    pass"}',
'["Remember to use quotes around strings", "The return statement sends a value back from the function"]'),

('Sum Calculator', 'Build a function that adds two numbers together', 'beginner', 'javascript', 75, 15,
'["math", "arithmetic", "parameters"]',
'Create a function called "sum" that takes two parameters (a and b) and returns their sum.',
'{"javascript": "function sum(a, b) {\n  // Add the two parameters together\n  return ;\n}", "python": "def sum(a, b):\n    # Add the two parameters together\n    pass"}',
'["Use the + operator to add numbers", "Parameters are the variables listed in the function definition"]'),

('Array Maximum', 'Find the largest number in an array', 'easy', 'javascript', 125, 20,
'["arrays", "loops", "comparison"]',
'Write a function called "findMax" that takes an array of numbers and returns the maximum value.',
'{"javascript": "function findMax(numbers) {\n  // Find and return the maximum number\n  \n}", "python": "def find_max(numbers):\n    # Find and return the maximum number\n    pass"}',
'["You can use Math.max() with spread operator", "Or loop through the array comparing values"]'),

('Palindrome Checker', 'Determine if a string reads the same forwards and backwards', 'medium', 'javascript', 200, 25,
'["strings", "logic", "comparison"]',
'Create a function called "isPalindrome" that checks if a string is a palindrome.',
'{"javascript": "function isPalindrome(str) {\n  // Check if string is the same forwards and backwards\n  \n}", "python": "def is_palindrome(str):\n    # Check if string is the same forwards and backwards\n    pass"}',
'["Convert to lowercase first", "You can reverse the string and compare", "Consider removing spaces and punctuation"]'),

('Fibonacci Generator', 'Generate the nth Fibonacci number', 'medium', 'python', 250, 30,
'["recursion", "iteration", "sequences"]',
'Write a function called "fibonacci" that returns the nth number in the Fibonacci sequence.',
'{"javascript": "function fibonacci(n) {\n  // Generate the nth Fibonacci number\n  \n}", "python": "def fibonacci(n):\n    # Generate the nth Fibonacci number\n    pass"}',
'["Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13...", "Each number is the sum of the two before it", "Consider iterative vs recursive approaches"]');

-- Insert test cases for the sample tasks
INSERT INTO test_cases (task_id, input_data, expected_output, description, is_hidden) VALUES
-- Hello World tests
((SELECT id FROM tasks WHERE title = 'Hello World'), '', 'Hello, World!', 'Basic greeting test', false),
((SELECT id FROM tasks WHERE title = 'Hello World'), '', 'Hello, World!', 'Hidden validation test', true),

-- Sum Calculator tests
((SELECT id FROM tasks WHERE title = 'Sum Calculator'), '2,3', '5', 'Basic addition test', false),
((SELECT id FROM tasks WHERE title = 'Sum Calculator'), '10,15', '25', 'Larger numbers test', false),
((SELECT id FROM tasks WHERE title = 'Sum Calculator'), '-5,3', '-2', 'Negative numbers test', true),

-- Array Maximum tests
((SELECT id FROM tasks WHERE title = 'Array Maximum'), '[1,5,3,9,2]', '9', 'Basic max test', false),
((SELECT id FROM tasks WHERE title = 'Array Maximum'), '[100]', '100', 'Single element test', false),
((SELECT id FROM tasks WHERE title = 'Array Maximum'), '[-1,-5,-3]', '-1', 'Negative numbers test', true),

-- Palindrome Checker tests
((SELECT id FROM tasks WHERE title = 'Palindrome Checker'), 'racecar', 'true', 'Simple palindrome test', false),
((SELECT id FROM tasks WHERE title = 'Palindrome Checker'), 'hello', 'false', 'Not palindrome test', false),
((SELECT id FROM tasks WHERE title = 'Palindrome Checker'), 'A man a plan a canal Panama', 'true', 'Complex palindrome test', true),

-- Fibonacci tests
((SELECT id FROM tasks WHERE title = 'Fibonacci Generator'), '0', '0', 'F(0) test', false),
((SELECT id FROM tasks WHERE title = 'Fibonacci Generator'), '1', '1', 'F(1) test', false),
((SELECT id FROM tasks WHERE title = 'Fibonacci Generator'), '5', '5', 'F(5) test', false),
((SELECT id FROM tasks WHERE title = 'Fibonacci Generator'), '10', '55', 'F(10) test', true);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view active tasks" ON tasks
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view non-hidden test cases" ON test_cases
  FOR SELECT USING (is_hidden = false);

CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own progress" ON user_progress
  FOR ALL USING (true);

CREATE POLICY "Public can insert users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (true);