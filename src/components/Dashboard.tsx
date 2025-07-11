import React from 'react';
import { Trophy, Target, Zap, TrendingUp, Code, Star, ArrowRight } from 'lucide-react';
import { UserProgress, Task } from '../types';

interface DashboardProps {
  userProgress: UserProgress;
  onNavigateToTasks: () => void;
  tasks: Task[];
}

export const Dashboard: React.FC<DashboardProps> = ({ userProgress, onNavigateToTasks, tasks }) => {
  const completedTasksCount = userProgress.completedTasks.length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;

  const difficultyStats = ['beginner', 'easy', 'medium', 'hard', 'expert'].map(difficulty => {
    const tasksOfDifficulty = tasks.filter(task => task.difficulty === difficulty);
    const completedOfDifficulty = tasksOfDifficulty.filter(task => 
      userProgress.completedTasks.includes(task.id)
    ).length;
    
    return {
      difficulty,
      total: tasksOfDifficulty.length,
      completed: completedOfDifficulty,
      percentage: tasksOfDifficulty.length > 0 ? (completedOfDifficulty / tasksOfDifficulty.length) * 100 : 0
    };
  });

  const recentCompletedTasks = tasks
    .filter(task => userProgress.completedTasks.includes(task.id))
    .slice(-3);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 font-['JetBrains_Mono']">
          Welcome back, Coder! 👋
        </h1>
        <p className="text-gray-400 text-lg">
          Ready to level up your coding skills? Let's dive into some challenges.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-sm border border-[#00D4FF]/20 rounded-xl p-6 hover:border-[#00D4FF]/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00D4FF] to-[#0EA5E9] rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{userProgress.level}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Current Level</h3>
          <p className="text-xs text-gray-500">Keep coding to level up!</p>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-sm border border-[#10B981]/20 rounded-xl p-6 hover:border-[#10B981]/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{userProgress.totalXp}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Total XP</h3>
          <p className="text-xs text-gray-500">Experience points earned</p>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-sm border border-[#8B5CF6]/20 rounded-xl p-6 hover:border-[#8B5CF6]/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{completedTasksCount}/{totalTasks}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Tasks Completed</h3>
          <p className="text-xs text-gray-500">{completionRate.toFixed(1)}% completion rate</p>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-sm border border-[#F59E0B]/20 rounded-xl p-6 hover:border-[#F59E0B]/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{userProgress.currentStreak}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Current Streak</h3>
          <p className="text-xs text-gray-500">Days of coding</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress by Difficulty */}
        <div className="bg-gradient-to-br from-[#1a1a2e]/60 to-[#16213e]/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Star className="w-5 h-5 text-[#00D4FF]" />
              <span>Progress by Difficulty</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {difficultyStats.map(({ difficulty, total, completed, percentage }) => (
              <div key={difficulty} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300 capitalize">
                    {difficulty}
                  </span>
                  <span className="text-sm text-gray-400">
                    {completed}/{total}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 bg-gradient-to-r ${getDifficultyColor(difficulty)} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-gradient-to-br from-[#1a1a2e]/60 to-[#16213e]/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Code className="w-5 h-5 text-[#10B981]" />
              <span>Recent Completions</span>
            </h2>
          </div>
          
          {recentCompletedTasks.length > 0 ? (
            <div className="space-y-3">
              {recentCompletedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                  <div>
                    <h3 className="text-sm font-medium text-white">{task.title}</h3>
                    <p className="text-xs text-gray-400 capitalize">{task.difficulty} • {task.language}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-[#10B981]">+{task.xpReward} XP</span>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getDifficultyColor(task.difficulty)}`} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Code className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">No completed tasks yet</p>
              <button
                onClick={onNavigateToTasks}
                className="bg-gradient-to-r from-[#00D4FF] to-[#0EA5E9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all duration-300 flex items-center space-x-2 mx-auto"
              >
                <span>Start Coding</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      {completedTasksCount < totalTasks && (
        <div className="mt-8 bg-gradient-to-r from-[#00D4FF]/10 to-[#8B5CF6]/10 border border-[#00D4FF]/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Ready for your next challenge?</h2>
          <p className="text-gray-400 mb-6">
            You've completed {completedTasksCount} out of {totalTasks} challenges. Keep going!
          </p>
          <button
            onClick={onNavigateToTasks}
            className="bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white px-8 py-3 rounded-lg font-medium hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <Target className="w-5 h-5" />
            <span>Browse Challenges</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};