import { supabase } from '../config/supabase';
import { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          test_cases (*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        difficulty: task.difficulty,
        language: task.language,
        xpReward: task.xp_reward,
        estimatedTime: task.estimated_time,
        tags: task.tags || [],
        instructions: task.instructions,
        starterCode: task.starter_code || { javascript: '', python: '' },
        hints: task.hints || [],
        testCases: task.test_cases?.map((tc: any) => ({
          id: tc.id,
          input: tc.input_data || '',
          expectedOutput: tc.expected_output,
          description: tc.description,
          isHidden: tc.is_hidden
        })) || [],
        createdAt: task.created_at,
        updatedAt: task.updated_at
      })) || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string }> {
    try {
      const taskId = uuidv4();
      
      // Insert task
      const { error: taskError } = await supabase
        .from('tasks')
        .insert([{
          id: taskId,
          title: task.title,
          description: task.description,
          difficulty: task.difficulty,
          language: task.language,
          xp_reward: task.xpReward,
          estimated_time: task.estimatedTime,
          tags: task.tags,
          instructions: task.instructions,
          starter_code: task.starterCode,
          hints: task.hints,
          is_active: true
        }]);

      if (taskError) throw taskError;

      // Insert test cases
      if (task.testCases.length > 0) {
        const testCasesData = task.testCases.map(tc => ({
          id: uuidv4(),
          task_id: taskId,
          input_data: tc.input,
          expected_output: tc.expectedOutput,
          description: tc.description,
          is_hidden: tc.isHidden
        }));

        const { error: testCasesError } = await supabase
          .from('test_cases')
          .insert(testCasesData);

        if (testCasesError) throw testCasesError;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Create task error:', error);
      return { success: false, error: error.message };
    }
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description,
          difficulty: updates.difficulty,
          language: updates.language,
          xp_reward: updates.xpReward,
          estimated_time: updates.estimatedTime,
          tags: updates.tags,
          instructions: updates.instructions,
          starter_code: updates.starterCode,
          hints: updates.hints,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async deleteTask(taskId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ is_active: false })
        .eq('id', taskId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};