import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TaskBrowser } from './components/TaskBrowser';
import { CodeEditor } from './components/CodeEditor';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { UserProgress, User, Task } from './types';
import { progressService } from './services/progressService';
import { taskService } from './services/taskService';
import { authService } from './services/authService';

type View = 'dashboard' | 'tasks' | 'editor';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalXp: 0,
    level: 1,
    completedTasks: [],
    currentStreak: 0,
    tasksProgress: {}
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [keySequence, setKeySequence] = useState('');

  useEffect(() => {
    loadInitialData();
    
    // Check for existing user session
    const existingUser = authService.getCurrentUser();
    if (existingUser) {
      setUser(existingUser);
    }

    // Listen for admin keyword
    const handleKeyPress = (e: KeyboardEvent) => {
      const newSequence = (keySequence + e.key.toLowerCase()).slice(-20); // Keep only last 20 chars
      setKeySequence(newSequence);
      
      if (newSequence.includes('abdulaziz')) {
        setShowAdminPanel(true);
        setKeySequence('');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keySequence]);

  const loadInitialData = async () => {
    try {
      const [progressData, tasksData] = await Promise.all([
        progressService.getProgress(),
        taskService.getAllTasks()
      ]);
      
      setUserProgress(progressData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    setCurrentView('editor');
  };

  const handleTaskComplete = async (taskId: string, xpEarned: number, language: 'javascript' | 'python') => {
    const updatedProgress = await progressService.completeTask(taskId, xpEarned, language);
    setUserProgress(updatedProgress);
    
    // Update user's total XP if logged in
    if (user) {
      setUser({ ...user, totalXp: updatedProgress.totalXp, level: updatedProgress.level });
    }
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    // Reload progress to sync with server
    loadInitialData();
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    // Keep local progress but clear user-specific data
    loadInitialData();
  };

  const selectedTask = selectedTaskId ? tasks.find(task => task.id === selectedTaskId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e]">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        userProgress={userProgress}
        user={user}
        onShowAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />
      
      <main className="pt-20">
        {currentView === 'dashboard' && (
          <Dashboard 
            userProgress={userProgress}
            onNavigateToTasks={() => setCurrentView('tasks')}
            tasks={tasks}
          />
        )}
        
        {currentView === 'tasks' && (
          <TaskBrowser 
            tasks={tasks}
            onTaskSelect={handleTaskSelect}
            userProgress={userProgress}
          />
        )}
        
        {currentView === 'editor' && selectedTask && (
          <CodeEditor 
            task={selectedTask}
            onTaskComplete={handleTaskComplete}
            onBack={() => setCurrentView('tasks')}
            userProgress={userProgress}
          />
        )}
      </main>

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;