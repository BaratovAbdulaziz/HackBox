import { supabase } from '../config/supabase';
import { UserProgress, TaskProgress } from '../types';
import { authService } from './authService';

const STORAGE_KEY = 'hackbox-progress';

export const progressService = {
  async getProgress(): Promise<UserProgress> {
    const user = authService.getCurrentUser();
    
    if (user) {
      // Get progress from Supabase
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const completedTasks = data?.filter(p => p.completed).map(p => p.task_id) || [];
        const totalXp = data?.reduce((sum, p) => sum + (p.xp_earned || 0), 0) || 0;
        const level = Math.floor(totalXp / 200) + 1;

        const tasksProgress: Record<string, TaskProgress> = {};
        data?.forEach(p => {
          tasksProgress[p.task_id] = {
            attempts: p.attempts || 0,
            completed: p.completed || false,
            bestTime: p.best_execution_time,
            lastAttempt: p.last_attempt_at || new Date().toISOString(),
            passedTests: p.passed_tests || 0,
            totalTests: p.total_tests || 0,
            language: p.language || 'javascript'
          };
        });

        return {
          totalXp,
          level,
          completedTasks,
          currentStreak: 0, // Calculate based on consecutive days
          tasksProgress,
          userId: user.id
        };
      } catch (error) {
        console.error('Error fetching progress from Supabase:', error);
      }
    }

    // Fallback to local storage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading local progress:', error);
    }
    
    return {
      totalXp: 0,
      level: 1,
      completedTasks: [],
      currentStreak: 0,
      tasksProgress: {}
    };
  },

  async saveProgress(progress: UserProgress): Promise<void> {
    const user = authService.getCurrentUser();
    
    // Always save to local storage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }

    // Save to Supabase if user is logged in
    if (user && progress.userId) {
      try {
        // Update user's total XP and level
        await supabase
          .from('users')
          .update({
            total_xp: progress.totalXp,
            level: progress.level
          })
          .eq('id', user.id);

        // Upsert task progress
        const progressData = Object.entries(progress.tasksProgress).map(([taskId, taskProgress]) => ({
          user_id: user.id,
          task_id: taskId,
          completed: taskProgress.completed,
          attempts: taskProgress.attempts,
          best_execution_time: taskProgress.bestTime,
          last_attempt_at: taskProgress.lastAttempt,
          passed_tests: taskProgress.passedTests,
          total_tests: taskProgress.totalTests,
          language: taskProgress.language,
          xp_earned: taskProgress.completed ? this.getTaskXp(taskId) : 0
        }));

        if (progressData.length > 0) {
          await supabase
            .from('user_progress')
            .upsert(progressData, { onConflict: 'user_id,task_id' });
        }
      } catch (error) {
        console.error('Error saving progress to Supabase:', error);
      }
    }
  },

  async completeTask(taskId: string, xpEarned: number, language: 'javascript' | 'python'): Promise<UserProgress> {
    const currentProgress = await this.getProgress();
    
    if (currentProgress.completedTasks.includes(taskId)) {
      return currentProgress;
    }

    const newTotalXp = currentProgress.totalXp + xpEarned;
    const newLevel = Math.floor(newTotalXp / 200) + 1;
    
    const updatedProgress: UserProgress = {
      ...currentProgress,
      totalXp: newTotalXp,
      level: newLevel,
      completedTasks: [...currentProgress.completedTasks, taskId],
      currentStreak: currentProgress.currentStreak + 1,
      tasksProgress: {
        ...currentProgress.tasksProgress,
        [taskId]: {
          ...currentProgress.tasksProgress[taskId],
          completed: true,
          attempts: (currentProgress.tasksProgress[taskId]?.attempts || 0) + 1,
          lastAttempt: new Date().toISOString(),
          language
        }
      }
    };

    await this.saveProgress(updatedProgress);
    return updatedProgress;
  },

  async updateTaskProgress(taskId: string, progress: Partial<TaskProgress>): Promise<UserProgress> {
    const currentProgress = await this.getProgress();
    
    const updatedProgress: UserProgress = {
      ...currentProgress,
      tasksProgress: {
        ...currentProgress.tasksProgress,
        [taskId]: {
          ...currentProgress.tasksProgress[taskId],
          ...progress,
          lastAttempt: new Date().toISOString()
        }
      }
    };

    await this.saveProgress(updatedProgress);
    return updatedProgress;
  },

  getTaskXp(taskId: string): number {
    // This would normally fetch from the task data
    return 100; // Default XP value
  }
};