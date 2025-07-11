import { Task, CodeExecutionResult, TestResult } from '../types';

export const codeExecutionService = {
  async executeCode(code: string, task: Task, language: 'javascript' | 'python'): Promise<CodeExecutionResult> {
    const startTime = performance.now();
    
    try {
      const testResults: TestResult[] = [];
      let passedTests = 0;

      for (const testCase of task.testCases) {
        try {
          const result = await this.runSingleTest(code, testCase.input, language);
          const passed = this.compareOutputs(result.output, testCase.expectedOutput);
          
          testResults.push({
            testCase,
            passed,
            actualOutput: result.output,
            error: result.error
          });

          if (passed) passedTests++;
        } catch (error) {
          testResults.push({
            testCase,
            passed: false,
            actualOutput: '',
            error: (error as Error).message
          });
        }
      }

      const executionTime = Math.round(performance.now() - startTime);
      const success = passedTests === task.testCases.length;

      return {
        success,
        output: testResults.map(r => r.actualOutput).join('\n'),
        executionTime,
        passedTests,
        totalTests: task.testCases.length,
        testResults
      };

    } catch (error) {
      return {
        success: false,
        output: '',
        error: (error as Error).message,
        executionTime: Math.round(performance.now() - startTime),
        passedTests: 0,
        totalTests: task.testCases.length,
        testResults: []
      };
    }
  },

  async runSingleTest(code: string, input: string, language: 'javascript' | 'python'): Promise<{ output: string; error?: string }> {
    try {
      if (language === 'javascript') {
        return this.executeJavaScript(code, input);
      } else if (language === 'python') {
        return this.executePython(code, input);
      }
      
      throw new Error(`Language ${language} not supported`);
    } catch (error) {
      return {
        output: '',
        error: (error as Error).message
      };
    }
  },

  executeJavaScript(code: string, input: string): { output: string; error?: string } {
    try {
      const safeEval = new Function(
        'console',
        `
        ${code}
        
        let args = [];
        if ("${input}") {
          try {
            const inputStr = "${input}";
            if (inputStr.includes('[') && inputStr.includes(']')) {
              const parts = inputStr.split(',');
              const arrayPart = parts[0] + ']';
              const otherParts = parts.slice(1);
              args.push(JSON.parse(arrayPart));
              otherParts.forEach(part => {
                if (part) args.push(isNaN(Number(part)) ? part : Number(part));
              });
            } else {
              args = inputStr.split(',').map(arg => {
                arg = arg.trim();
                if (arg === '') return '';
                if (!isNaN(Number(arg))) return Number(arg);
                if (arg === 'true') return true;
                if (arg === 'false') return false;
                return arg;
              });
            }
          } catch (e) {
            args = ["${input}"];
          }
        }
        
        const functionNames = ['helloWorld', 'sum', 'findMax', 'isPalindrome', 'fibonacci', 'binarySearch', 'twoSum', 'isValid', 'reverseString', 'factorial'];
        let result;
        
        for (const funcName of functionNames) {
          try {
            if (typeof eval(funcName) === 'function') {
              if (args.length === 0) {
                result = eval(funcName)();
              } else if (args.length === 1) {
                result = eval(funcName)(args[0]);
              } else {
                result = eval(funcName)(...args);
              }
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        return result;
        `
      );

      const mockConsole = {
        log: () => {},
        error: () => {},
        warn: () => {},
        info: () => {}
      };

      const result = safeEval(mockConsole);
      
      let output: string;
      if (Array.isArray(result)) {
        output = JSON.stringify(result);
      } else if (typeof result === 'object' && result !== null) {
        output = JSON.stringify(result);
      } else {
        output = String(result);
      }

      return { output };

    } catch (error) {
      return {
        output: '',
        error: (error as Error).message
      };
    }
  },

  executePython(code: string, input: string): { output: string; error?: string } {
    try {
      // For now, we'll simulate Python execution
      // In a real implementation, you'd use a Python interpreter like Pyodide
      
      // Simple Python function execution simulation
      const pythonToJS = code
        .replace(/def\s+(\w+)\s*\(/g, 'function $1(')
        .replace(/:\s*$/gm, ' {')
        .replace(/^\s{4}/gm, '  ')
        .replace(/return\s+/g, 'return ')
        .replace(/True/g, 'true')
        .replace(/False/g, 'false')
        .replace(/None/g, 'null')
        .replace(/len\(/g, '(')
        .replace(/range\(/g, 'Array.from({length: ')
        .replace(/\bprint\(/g, 'console.log(');

      // Add closing braces for functions
      const lines = pythonToJS.split('\n');
      const result = [];
      let indentLevel = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('function ') && line.includes('{')) {
          result.push(line);
          indentLevel++;
        } else if (line.trim() === '' && indentLevel > 0) {
          result.push('}');
          indentLevel--;
        } else {
          result.push(line);
        }
      }
      
      while (indentLevel > 0) {
        result.push('}');
        indentLevel--;
      }

      const jsCode = result.join('\n');
      return this.executeJavaScript(jsCode, input);

    } catch (error) {
      return {
        output: '',
        error: (error as Error).message
      };
    }
  },

  compareOutputs(actual: string, expected: string): boolean {
    const cleanActual = actual.trim();
    const cleanExpected = expected.trim();
    
    if (cleanActual === cleanExpected) {
      return true;
    }

    try {
      const actualParsed = JSON.parse(cleanActual);
      const expectedParsed = JSON.parse(cleanExpected);
      return JSON.stringify(actualParsed) === JSON.stringify(expectedParsed);
    } catch {
      // Not JSON, continue with other comparisons
    }

    const actualNum = parseFloat(cleanActual);
    const expectedNum = parseFloat(cleanExpected);
    if (!isNaN(actualNum) && !isNaN(expectedNum)) {
      return Math.abs(actualNum - expectedNum) < 0.001;
    }

    if ((cleanActual === 'true' || cleanActual === 'false') && 
        (cleanExpected === 'true' || cleanExpected === 'false')) {
      return cleanActual === cleanExpected;
    }

    return false;
  }
};