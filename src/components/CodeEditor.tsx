import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, ArrowLeft, CheckCircle, XCircle, Clock, Trophy, Lightbulb, Code } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Task, UserProgress, CodeExecutionResult } from '../types';
import { codeExecutionService } from '../services/codeExecutionService';

interface CodeEditorProps {
  task: Task;
  onTaskComplete: (taskId: string, xpEarned: number, language: 'javascript' | 'python') => void;
  onBack: () => void;
  userProgress: UserProgress;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  task, 
  onTaskComplete, 
  onBack, 
  userProgress 
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python'>('javascript');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  const isCompleted = userProgress.completedTasks.includes(task.id);
  const taskProgress = userProgress.tasksProgress[task.id];

  // Initialize code when task or language changes
  useEffect(() => {
    const starterCode = task.starterCode?.[selectedLanguage] || 
      (selectedLanguage === 'javascript' 
        ? 'function solution() {\n  // Your code here\n  \n}'
        : 'def solution():\n    # Your code here\n    pass');
    setCode(starterCode);
    setExecutionResult(null);
  }, [selectedLanguage, task.id]);

  // Handle code changes with debouncing to prevent reloading
  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };
  const handleRunCode = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    try {
      const result = await codeExecutionService.executeCode(code, task, selectedLanguage);
      setExecutionResult(result);
      
      if (result.success && result.passedTests === result.totalTests && !isCompleted) {
        setTimeout(() => {
          onTaskComplete(task.id, task.xpReward, selectedLanguage);
        }, 1000);
      }
    } catch (error) {
      setExecutionResult({
        success: false,
        output: '',
        error: 'Execution failed: ' + (error as Error).message,
        executionTime: 0,
        passedTests: 0,
        totalTests: task.testCases.length,
        testResults: []
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    const starterCode = task.starterCode?.[selectedLanguage] || 
      (selectedLanguage === 'javascript' 
        ? 'function solution() {\n  // Your code here\n  \n}'
        : 'def solution():\n    # Your code here\n    pass');
    setCode(starterCode);
    setExecutionResult(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'from-green-400 to-green-600',
      easy: 'from-blue-400 to-blue-600',
      medium: 'from-yellow-400 to-yellow-600',
      hard: 'from-orange-400 to-orange-600',
      expert: 'from-red-400 to-red-600'
    };
    return colors[difficulty as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  const showNextHint = () => {
    if (currentHintIndex < task.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Challenges</span>
          </button>
          
          {isCompleted && (
            <div className="flex items-center space-x-2 text-[#10B981]">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Completed</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getDifficultyColor(task.difficulty)} text-white`}>
            {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
          </div>
          <div className="flex items-center space-x-1 text-[#00D4FF]">
            <Trophy className="w-4 h-4" />
            <span className="font-medium">{task.xpReward} XP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Instructions */}
        <div className="space-y-6">
          {/* Task Info */}
          <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h1 className="text-2xl font-bold text-white mb-4">{task.title}</h1>
            <p className="text-gray-300 mb-4">{task.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>~{task.estimatedTime} min</span>
              </div>
              <div className="capitalize">{selectedLanguage}</div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/10 rounded-md text-xs text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Instructions</h2>
            <div className="text-gray-300 whitespace-pre-line">
              {task.instructions}
            </div>
          </div>

          {/* Hints */}
          {task.hints.length > 0 && (
            <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
                  <span>Hints</span>
                </h2>
                {!showHints && (
                  <button
                    onClick={() => setShowHints(true)}
                    className="text-sm text-[#00D4FF] hover:text-blue-300 transition-colors"
                  >
                    Show Hints
                  </button>
                )}
              </div>
              
              {showHints && (
                <div className="space-y-3">
                  {task.hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                    <div key={index} className="p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg">
                      <p className="text-gray-300 text-sm">{hint}</p>
                    </div>
                  ))}
                  
                  {currentHintIndex < task.hints.length - 1 && (
                    <button
                      onClick={showNextHint}
                      className="text-sm text-[#F59E0B] hover:text-yellow-300 transition-colors"
                    >
                      Show Next Hint ({currentHintIndex + 2}/{task.hints.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Test Results */}
          {executionResult && (
            <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Test Results</h2>
                <div className={`flex items-center space-x-2 ${
                  executionResult.success ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`}>
                  {executionResult.success ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <span className="font-medium">
                    {executionResult.passedTests}/{executionResult.totalTests} Passed
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {executionResult.testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.passed
                        ? 'bg-[#10B981]/10 border-[#10B981]/20'
                        : 'bg-[#EF4444]/10 border-[#EF4444]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">
                        {result.testCase.description}
                      </span>
                      {result.passed ? (
                        <CheckCircle className="w-4 h-4 text-[#10B981]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#EF4444]" />
                      )}
                    </div>
                    
                    {!result.passed && (
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="text-gray-400">Expected: </span>
                          <span className="text-gray-300 font-mono">{result.testCase.expectedOutput}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Got: </span>
                          <span className="text-gray-300 font-mono">{result.actualOutput}</span>
                        </div>
                        {result.error && (
                          <div>
                            <span className="text-gray-400">Error: </span>
                            <span className="text-red-400 font-mono">{result.error}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {executionResult.error && (
                <div className="mt-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
                  <p className="text-sm text-red-400 font-mono">{executionResult.error}</p>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-400">
                Execution time: {executionResult.executionTime}ms
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className="space-y-6">
          {/* Editor Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-bold text-white">Code Editor</h2>
              
              {/* Language Selector */}
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setSelectedLanguage('javascript')}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors ${
                    selectedLanguage === 'javascript'
                      ? 'bg-[#F7DF1E] text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  <span>JavaScript</span>
                </button>
                <button
                  onClick={() => setSelectedLanguage('python')}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors ${
                    selectedLanguage === 'python'
                      ? 'bg-[#3776AB] text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  <span>Python</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isRunning
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#10B981] to-[#059669] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                } text-white`}
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden">
            <div className="bg-[#16213e] px-4 py-2 border-b border-white/10">
              <span className="text-sm text-gray-400 capitalize">{selectedLanguage}</span>
            </div>
            
            <div className="h-96">
              <Editor
                height="100%"
                language={selectedLanguage}
                value={code}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
                  selectOnLineNumbers: true,
                  mouseWheelZoom: true,
                  contextmenu: true,
                  quickSuggestions: true,
                  suggestOnTriggerCharacters: true,
                  acceptSuggestionOnEnter: 'on',
                  tabCompletion: 'on',
                  wordBasedSuggestions: true
                }}
              />
            </div>
          </div>

          {/* Execution Status */}
          {isRunning && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full" />
              <span className="ml-3 text-gray-400">Executing code...</span>
            </div>
          )}

          {/* Success Message */}
          {executionResult?.success && executionResult.passedTests === executionResult.totalTests && (
            <div className="bg-gradient-to-r from-[#10B981]/20 to-[#059669]/20 border border-[#10B981]/40 rounded-xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-[#10B981] mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">
                🎉 Congratulations!
              </h3>
              <p className="text-gray-300 mb-4">
                You've successfully completed this challenge in {selectedLanguage}!
              </p>
              {!isCompleted && (
                <p className="text-[#10B981] font-medium">
                  +{task.xpReward} XP earned
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};