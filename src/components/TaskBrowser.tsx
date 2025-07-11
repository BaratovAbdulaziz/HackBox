import React, { useState, useMemo } from 'react';
import { Search, Filter, Code, Clock, Trophy, ChevronRight, CheckCircle } from 'lucide-react';
import { Task, UserProgress } from '../types';

interface TaskBrowserProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
  userProgress: UserProgress;
}

export const TaskBrowser: React.FC<TaskBrowserProps> = ({ tasks, onTaskSelect, userProgress }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDifficulty = selectedDifficulty === 'all' || task.difficulty === selectedDifficulty;
      const matchesLanguage = selectedLanguage === 'all' || task.language === selectedLanguage;
      
      return matchesSearch && matchesDifficulty && matchesLanguage;
    });
  }, [tasks, searchTerm, selectedDifficulty, selectedLanguage]);

  const difficulties = ['all', 'beginner', 'easy', 'medium', 'hard', 'expert'];
  const languages = ['all', 'javascript', 'python'];

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

  const getLanguageColor = (language: string) => {
    const colors = {
      javascript: 'bg-yellow-500',
      python: 'bg-blue-500'
    };
    return colors[language as keyof typeof colors] || 'bg-gray-500';
  };

  const isTaskCompleted = (taskId: string) => {
    return userProgress.completedTasks.includes(taskId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 font-['JetBrains_Mono']">
          Coding Challenges 🎯
        </h1>
        <p className="text-gray-400 text-lg">
          Master your skills with {tasks.length} carefully crafted coding challenges
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search challenges, tags, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#1a1a2e]/80 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-[#00D4FF]/50 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/20 transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-[#1a1a2e]/80 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#00D4FF]/50 focus:outline-none"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty} className="bg-[#1a1a2e]">
                  {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-gray-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-[#1a1a2e]/80 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#00D4FF]/50 focus:outline-none"
            >
              {languages.map(language => (
                <option key={language} value={language} className="bg-[#1a1a2e]">
                  {language === 'all' ? 'All Languages' : language.charAt(0).toUpperCase() + language.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-400">
          Showing {filteredTasks.length} challenge{filteredTasks.length !== 1 ? 's' : ''}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => {
          const completed = isTaskCompleted(task.id);
          return (
            <div
              key={task.id}
              onClick={() => onTaskSelect(task.id)}
              className={`group relative bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-sm border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,212,255,0.2)] ${
                completed 
                  ? 'border-[#10B981]/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                  : 'border-white/10 hover:border-[#00D4FF]/40'
              }`}
            >
              {/* Completion Badge */}
              {completed && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Task Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00D4FF] transition-colors">
                    {task.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {task.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#00D4FF] group-hover:translate-x-1 transition-all" />
              </div>

              {/* Task Metadata */}
              <div className="flex items-center justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(task.difficulty)} text-white`}>
                  {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getLanguageColor(task.language)}`} />
                  <span className="text-xs text-gray-400 capitalize">{task.language}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {task.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/10 rounded-md text-xs text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-gray-400">
                    +{task.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Task Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{task.estimatedTime} min</span>
                </div>
                <div className="flex items-center space-x-1 text-[#00D4FF]">
                  <Trophy className="w-4 h-4" />
                  <span>{task.xpReward} XP</span>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/5 to-[#8B5CF6]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-16">
          <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No challenges found</h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDifficulty('all');
              setSelectedLanguage('all');
            }}
            className="bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white px-6 py-2 rounded-lg font-medium hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};