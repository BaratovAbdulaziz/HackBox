import React from 'react';
import { Code2, Trophy, Target, User, LogIn, LogOut } from 'lucide-react';
import { UserProgress, User as UserType } from '../types';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: 'dashboard' | 'tasks' | 'editor') => void;
  userProgress: UserProgress;
  user: UserType | null;
  onShowAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  setCurrentView, 
  userProgress, 
  user,
  onShowAuth,
  onLogout
}) => {
  const getXpForNextLevel = (level: number) => {
    return level * 200;
  };

  const currentLevelXp = getXpForNextLevel(userProgress.level - 1);
  const nextLevelXp = getXpForNextLevel(userProgress.level);
  const progressInLevel = userProgress.totalXp - currentLevelXp;
  const xpNeededForLevel = nextLevelXp - currentLevelXp;
  const progressPercentage = (progressInLevel / xpNeededForLevel) * 100;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0f0f23]/80 border-b border-[#00D4FF]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00D4FF] to-[#8B5CF6] rounded-lg flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white font-['JetBrains_Mono']">
              HackBox
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                currentView === 'dashboard'
                  ? 'bg-[#00D4FF]/20 text-[#00D4FF] shadow-[0_0_20px_rgba(0,212,255,0.3)]'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => setCurrentView('tasks')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                currentView === 'tasks'
                  ? 'bg-[#00D4FF]/20 text-[#00D4FF] shadow-[0_0_20px_rgba(0,212,255,0.3)]'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Challenges</span>
            </button>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {/* Progress Bar */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  Level {userProgress.level}
                </div>
                <div className="text-xs text-gray-400">
                  {progressInLevel}/{xpNeededForLevel} XP
                </div>
              </div>
              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00D4FF] to-[#10B981] transition-all duration-500"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>
            
            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-white">{user.username}</div>
                  <div className="text-xs text-gray-400">{user.totalXp} XP</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <button
                  onClick={onLogout}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onShowAuth}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white px-4 py-2 rounded-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};