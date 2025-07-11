import { Task } from '../types';

export const taskData: Task[] = [
  {
    id: '1',
    title: 'Hello World',
    description: 'Create your first function that returns a greeting message',
    difficulty: 'beginner',
    language: 'javascript',
    xpReward: 50,
    estimatedTime: 5,
    tags: ['basics', 'strings', 'functions'],
    instructions: `Write a function called "helloWorld" that returns the exact string "Hello, World!".

This is your first coding challenge! Functions are reusable blocks of code that perform specific tasks. In this case, we want to create a function that returns a greeting message.

Requirements:
- Function name must be "helloWorld"
- Must return the exact string "Hello, World!" (including the comma and exclamation mark)
- No parameters needed`,
    starterCode: `function helloWorld() {
  // Return "Hello, World!" string
  return ;
}`,
    hints: [
      'Remember to use quotes around strings in JavaScript',
      'The return statement sends a value back from the function',
      'Make sure to include the comma and exclamation mark exactly as shown'
    ],
    testCases: [
      {
        id: '1-1',
        input: '',
        expectedOutput: 'Hello, World!',
        description: 'Basic greeting test',
        isHidden: false
      },
      {
        id: '1-2',
        input: '',
        expectedOutput: 'Hello, World!',
        description: 'Exact string match validation',
        isHidden: true
      }
    ]
  },
  {
    id: '2',
    title: 'Sum Calculator',
    description: 'Build a function that adds two numbers together',
    difficulty: 'beginner',
    language: 'javascript',
    xpReward: 75,
    estimatedTime: 10,
    tags: ['math', 'arithmetic', 'parameters'],
    instructions: `Create a function called "sum" that takes two parameters (a and b) and returns their sum.

This challenge introduces you to function parameters - values that are passed into functions when they're called. You'll learn how to work with multiple inputs and perform basic arithmetic operations.

Requirements:
- Function name must be "sum"
- Must accept two parameters: a and b
- Must return the result of adding a and b together
- Should work with both positive and negative numbers`,
    starterCode: `function sum(a, b) {
  // Add the two parameters together and return the result
  return ;
}`,
    hints: [
      'Use the + operator to add numbers in JavaScript',
      'Parameters are the variables listed in the function definition',
      'The function should work with any numbers passed to it'
    ],
    testCases: [
      {
        id: '2-1',
        input: '2,3',
        expectedOutput: '5',
        description: 'Basic addition test',
        isHidden: false
      },
      {
        id: '2-2',
        input: '10,15',
        expectedOutput: '25',
        description: 'Larger numbers test',
        isHidden: false
      },
      {
        id: '2-3',
        input: '-5,3',
        expectedOutput: '-2',
        description: 'Negative numbers test',
        isHidden: true
      },
      {
        id: '2-4',
        input: '0,0',
        expectedOutput: '0',
        description: 'Zero test',
        isHidden: true
      }
    ]
  },
  {
    id: '3',
    title: 'Array Maximum',
    description: 'Find the largest number in an array',
    difficulty: 'easy',
    language: 'javascript',
    xpReward: 125,
    estimatedTime: 15,
    tags: ['arrays', 'loops', 'comparison'],
    instructions: `Write a function called "findMax" that takes an array of numbers and returns the maximum value.

This challenge introduces you to arrays and iteration. You'll need to examine each element in the array and keep track of the largest value found so far.

Requirements:
- Function name must be "findMax"
- Must accept one parameter: an array of numbers
- Must return the largest number in the array
- Should handle arrays with positive, negative, and zero values
- Assume the array will always have at least one element

Approaches you can use:
1. Use a loop to iterate through the array
2. Use the built-in Math.max() function with spread operator
3. Use array methods like reduce()`,
    starterCode: `function findMax(numbers) {
  // Find and return the maximum number in the array
  
}`,
    hints: [
      'You can use Math.max() with the spread operator: Math.max(...array)',
      'Or loop through the array comparing each value to find the maximum',
      'Start with the first element as your initial maximum value'
    ],
    testCases: [
      {
        id: '3-1',
        input: '[1,5,3,9,2]',
        expectedOutput: '9',
        description: 'Basic maximum test',
        isHidden: false
      },
      {
        id: '3-2',
        input: '[100]',
        expectedOutput: '100',
        description: 'Single element test',
        isHidden: false
      },
      {
        id: '3-3',
        input: '[-1,-5,-3]',
        expectedOutput: '-1',
        description: 'Negative numbers test',
        isHidden: true
      },
      {
        id: '3-4',
        input: '[0,0,0]',
        expectedOutput: '0',
        description: 'All zeros test',
        isHidden: true
      }
    ]
  },
  {
    id: '4',
    title: 'Palindrome Checker',
    description: 'Determine if a string reads the same forwards and backwards',
    difficulty: 'medium',
    language: 'javascript',
    xpReward: 200,
    estimatedTime: 20,
    tags: ['strings', 'logic', 'comparison'],
    instructions: `Create a function called "isPalindrome" that checks if a string is a palindrome.

A palindrome is a word, phrase, or sequence that reads the same backward as forward. For this challenge, ignore spaces, punctuation, and case differences.

Requirements:
- Function name must be "isPalindrome"
- Must accept one parameter: a string
- Must return true if the string is a palindrome, false otherwise
- Should ignore spaces, punctuation, and case differences
- Empty strings should return true

Examples of palindromes:
- "racecar" → true
- "A man a plan a canal Panama" → true (ignoring spaces and case)
- "race a car" → false

Approach:
1. Clean the string (remove spaces, convert to lowercase)
2. Compare the cleaned string with its reverse
3. Return true if they match, false otherwise`,
    starterCode: `function isPalindrome(str) {
  // Check if string is the same forwards and backwards
  
}`,
    hints: [
      'Convert the string to lowercase first: str.toLowerCase()',
      'Remove spaces and punctuation using replace() method',
      'You can reverse a string by splitting, reversing, and joining: str.split("").reverse().join("")',
      'Compare the cleaned string with its reversed version'
    ],
    testCases: [
      {
        id: '4-1',
        input: 'racecar',
        expectedOutput: 'true',
        description: 'Simple palindrome test',
        isHidden: false
      },
      {
        id: '4-2',
        input: 'hello',
        expectedOutput: 'false',
        description: 'Not palindrome test',
        isHidden: false
      },
      {
        id: '4-3',
        input: 'A man a plan a canal Panama',
        expectedOutput: 'true',
        description: 'Complex palindrome with spaces',
        isHidden: true
      },
      {
        id: '4-4',
        input: '',
        expectedOutput: 'true',
        description: 'Empty string test',
        isHidden: true
      }
    ]
  },
  {
    id: '5',
    title: 'Fibonacci Generator',
    description: 'Generate the nth Fibonacci number',
    difficulty: 'medium',
    language: 'javascript',
    xpReward: 250,
    estimatedTime: 25,
    tags: ['recursion', 'iteration', 'sequences'],
    instructions: `Write a function called "fibonacci" that returns the nth number in the Fibonacci sequence.

The Fibonacci sequence is: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
Each number is the sum of the two preceding ones.

Requirements:
- Function name must be "fibonacci"
- Must accept one parameter: n (the position in the sequence, starting from 0)
- Must return the nth Fibonacci number
- Handle edge cases: fibonacci(0) = 0, fibonacci(1) = 1

You can solve this using:
1. Iterative approach (recommended for efficiency)
2. Recursive approach (elegant but slower for large n)
3. Memoization (recursive with caching)

Examples:
- fibonacci(0) → 0
- fibonacci(1) → 1
- fibonacci(5) → 5
- fibonacci(10) → 55`,
    starterCode: `function fibonacci(n) {
  // Generate the nth Fibonacci number
  
}`,
    hints: [
      'The Fibonacci sequence starts: 0, 1, 1, 2, 3, 5, 8, 13...',
      'Each number is the sum of the two before it: F(n) = F(n-1) + F(n-2)',
      'For efficiency, use an iterative approach with two variables',
      'Handle the base cases first: n=0 returns 0, n=1 returns 1'
    ],
    testCases: [
      {
        id: '5-1',
        input: '0',
        expectedOutput: '0',
        description: 'F(0) test',
        isHidden: false
      },
      {
        id: '5-2',
        input: '1',
        expectedOutput: '1',
        description: 'F(1) test',
        isHidden: false
      },
      {
        id: '5-3',
        input: '5',
        expectedOutput: '5',
        description: 'F(5) test',
        isHidden: false
      },
      {
        id: '5-4',
        input: '10',
        expectedOutput: '55',
        description: 'F(10) test',
        isHidden: true
      }
    ]
  },
  {
    id: '6',
    title: 'Binary Search',
    description: 'Implement binary search algorithm',
    difficulty: 'hard',
    language: 'javascript',
    xpReward: 350,
    estimatedTime: 35,
    tags: ['algorithms', 'searching', 'optimization'],
    instructions: `Implement a function called "binarySearch" that finds the index of a target value in a sorted array.

Binary search is an efficient algorithm that works by repeatedly dividing the search interval in half. It has O(log n) time complexity, making it much faster than linear search for large arrays.

Requirements:
- Function name must be "binarySearch"
- Must accept two parameters: arr (sorted array), target (value to find)
- Must return the index of the target if found, -1 if not found
- Array will always be sorted in ascending order
- Use the binary search algorithm (not linear search)

Algorithm:
1. Set left pointer to 0, right pointer to array length - 1
2. While left <= right:
   a. Calculate middle index
   b. If middle element equals target, return middle index
   c. If middle element < target, search right half
   d. If middle element > target, search left half
3. If not found, return -1`,
    starterCode: `function binarySearch(arr, target) {
  // Implement binary search algorithm
  
}`,
    hints: [
      'Binary search only works on sorted arrays',
      'Use two pointers: left and right to track the search boundaries',
      'Calculate middle index: Math.floor((left + right) / 2)',
      'Eliminate half the search space in each iteration'
    ],
    testCases: [
      {
        id: '6-1',
        input: '[1,3,5,7,9],5',
        expectedOutput: '2',
        description: 'Found element test',
        isHidden: false
      },
      {
        id: '6-2',
        input: '[1,3,5,7,9],4',
        expectedOutput: '-1',
        description: 'Not found test',
        isHidden: false
      },
      {
        id: '6-3',
        input: '[1],1',
        expectedOutput: '0',
        description: 'Single element found',
        isHidden: true
      },
      {
        id: '6-4',
        input: '[1],2',
        expectedOutput: '-1',
        description: 'Single element not found',
        isHidden: true
      }
    ]
  },
  {
    id: '7',
    title: 'Two Sum',
    description: 'Find two numbers in an array that add up to a target sum',
    difficulty: 'medium',
    language: 'javascript',
    xpReward: 225,
    estimatedTime: 20,
    tags: ['arrays', 'hash-maps', 'algorithms'],
    instructions: `Write a function called "twoSum" that finds two numbers in an array that add up to a specific target.

This is a classic coding interview problem that can be solved efficiently using a hash map approach.

Requirements:
- Function name must be "twoSum"
- Must accept two parameters: nums (array of integers), target (target sum)
- Must return an array of the two indices whose values add up to target
- You may assume that each input has exactly one solution
- You may not use the same element twice
- Return indices in ascending order

Example:
- twoSum([2,7,11,15], 9) → [0,1] (because nums[0] + nums[1] = 2 + 7 = 9)

Approaches:
1. Brute force: Check all pairs (O(n²))
2. Hash map: Single pass with O(n) time complexity (recommended)`,
    starterCode: `function twoSum(nums, target) {
  // Find two numbers that add up to target
  
}`,
    hints: [
      'Use a hash map to store values and their indices as you iterate',
      'For each number, check if (target - number) exists in the hash map',
      'If found, return the current index and the stored index',
      'The hash map approach gives O(n) time complexity'
    ],
    testCases: [
      {
        id: '7-1',
        input: '[2,7,11,15],9',
        expectedOutput: '[0,1]',
        description: 'Basic two sum test',
        isHidden: false
      },
      {
        id: '7-2',
        input: '[3,2,4],6',
        expectedOutput: '[1,2]',
        description: 'Different indices test',
        isHidden: false
      },
      {
        id: '7-3',
        input: '[3,3],6',
        expectedOutput: '[0,1]',
        description: 'Duplicate numbers test',
        isHidden: true
      }
    ]
  },
  {
    id: '8',
    title: 'Valid Parentheses',
    description: 'Check if parentheses are properly balanced',
    difficulty: 'easy',
    language: 'javascript',
    xpReward: 150,
    estimatedTime: 15,
    tags: ['stacks', 'strings', 'validation'],
    instructions: `Create a function called "isValid" that determines if parentheses are properly balanced.

Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. A string is valid if:
1. Open brackets must be closed by the same type of brackets
2. Open brackets must be closed in the correct order

Requirements:
- Function name must be "isValid"
- Must accept one parameter: s (string of brackets)
- Must return true if valid, false otherwise
- Handle empty strings (return true)

Examples:
- "()" → true
- "()[]{}" → true
- "(]" → false
- "([)]" → false
- "{[]}" → true

Use a stack data structure to solve this efficiently.`,
    starterCode: `function isValid(s) {
  // Check if parentheses are properly balanced
  
}`,
    hints: [
      'Use a stack (array) to keep track of opening brackets',
      'When you see an opening bracket, push it onto the stack',
      'When you see a closing bracket, check if it matches the top of the stack',
      'The string is valid if the stack is empty at the end'
    ],
    testCases: [
      {
        id: '8-1',
        input: '()',
        expectedOutput: 'true',
        description: 'Simple parentheses test',
        isHidden: false
      },
      {
        id: '8-2',
        input: '()[]{}}',
        expectedOutput: 'true',
        description: 'Multiple bracket types test',
        isHidden: false
      },
      {
        id: '8-3',
        input: '(]',
        expectedOutput: 'false',
        description: 'Mismatched brackets test',
        isHidden: true
      },
      {
        id: '8-4',
        input: '',
        expectedOutput: 'true',
        description: 'Empty string test',
        isHidden: true
      }
    ]
  }
];