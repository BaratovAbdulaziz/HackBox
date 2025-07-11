import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Users, BarChart3, Settings } from 'lucide-react';
import { Task, User } from '../types';
import { taskService } from '../services/taskService';
import { supabase } from '../config/supabase';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'users' | 'analytics'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'tasks') {
        const tasksData = await taskService.getAllTasks();
        setTasks(tasksData);
      } else if (activeTab === 'users') {
        try {
          const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('id, email, username, total_xp, level, is_admin, created_at')
            .order('created_at', { ascending: false });
          
          if (usersError) {
            console.warn('Users table not available:', usersError.message);
            setUsers([]);
          } else {
            setUsers(usersData || []);
          }
        } catch (err) {
          console.warn('Users functionality not available');
          setUsers([]);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please check your database connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask({
      id: '',
      title: '',
      description: '',
      difficulty: 'beginner',
      language: 'javascript',
      xpReward: 100,
      estimatedTime: 30,
      tags: [],
      instructions: '',
      starterCode: {
        javascript: 'function solution() {\n  // Your code here\n}',
        python: 'def solution():\n    # Your code here\n    pass'
      },
      hints: [],
      testCases: []
    });
    setIsCreating(true);
    setError('');
  };

  const handleSaveTask = async () => {
    if (!editingTask) return;

    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!editingTask.title.trim()) {
        throw new Error('Task title is required');
      }
      if (!editingTask.description.trim()) {
        throw new Error('Task description is required');
      }
      if (!editingTask.instructions.trim()) {
        throw new Error('Task instructions are required');
      }

      if (isCreating) {
        const { id, createdAt, updatedAt, ...taskData } = editingTask;
        const result = await taskService.createTask(taskData);
        if (!result.success) {
          throw new Error(result.error || 'Failed to create task');
        }
      } else {
        const result = await taskService.updateTask(editingTask.id, editingTask);
        if (!result.success) {
          throw new Error(result.error || 'Failed to update task');
        }
      }
      
      setEditingTask(null);
      setIsCreating(false);
      await loadData();
    } catch (error) {
      console.error('Error saving task:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setError('');
      setLoading(true);
      try {
        const result = await taskService.deleteTask(taskId);
        if (!result.success) {
          throw new Error(result.error || 'Failed to delete task');
        }
        await loadData();
      } catch (error) {
        console.error('Error deleting task:', error);
        setError('Failed to delete task');
      } finally {
        setLoading(false);
      }
    }
  };

  const addTestCase = () => {
    if (!editingTask) return;
    
    setEditingTask({
      ...editingTask,
      testCases: [
        ...editingTask.testCases,
        {
          id: Date.now().toString(),
          input: '',
          expectedOutput: '',
          description: '',
          isHidden: false
        }
      ]
    });
  };

  const updateTestCase = (index: number, field: string, value: any) => {
    if (!editingTask) return;
    
    const updatedTestCases = [...editingTask.testCases];
    updatedTestCases[index] = { ...updatedTestCases[index], [field]: value };
    
    setEditingTask({
      ...editingTask,
      testCases: updatedTestCases
    });
  };

  const removeTestCase = (index: number) => {
    if (!editingTask) return;
    
    setEditingTask({
      ...editingTask,
      testCases: editingTask.testCases.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gradient-to-br from-[#1a1a2e]/95 to-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-xl w-full max-w-7xl h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Settings className="w-6 h-6 text-[#00D4FF]" />
            <span>Admin Panel</span>
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 bg-red-500/20 border border-red-500/40 rounded-lg p-3 text-red-300 text-sm">
            {error}
          </div>
        )}
        {/* Tabs */}
        <div className="flex border-b border-white/10 overflow-x-auto">
          {[
            { id: 'tasks', label: 'Tasks', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-4 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#00D4FF]/20 text-[#00D4FF] border-b-2 border-[#00D4FF]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {/* Tasks Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Manage Tasks</h3>
                <button
                  onClick={handleCreateTask}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-[#00D4FF] to-[#0EA5E9] text-white px-4 py-2 rounded-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Task</span>
                </button>
              </div>

              {/* Task Editor */}
              {editingTask && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white">
                      {isCreating ? 'Create New Task' : 'Edit Task'}
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveTask}
                        disabled={loading}
                        className="flex items-center space-x-2 bg-[#10B981] text-white px-4 py-2 rounded-lg hover:bg-[#059669] transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'Saving...' : 'Save'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingTask(null);
                          setIsCreating(false);
                          setError('');
                        }}
                        className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#00D4FF] focus:outline-none"
                        placeholder="Enter task title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                      <select
                        value={editingTask.difficulty}
                        onChange={(e) => setEditingTask({ ...editingTask, difficulty: e.target.value as any })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#00D4FF] focus:outline-none"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                      <select
                        value={editingTask.language}
                        onChange={(e) => setEditingTask({ ...editingTask, language: e.target.value as any })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#00D4FF] focus:outline-none"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">XP Reward</label>
                      <input
                        type="number"
                        value={editingTask.xpReward}
                        onChange={(e) => setEditingTask({ ...editingTask, xpReward: parseInt(e.target.value) })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#00D4FF] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={editingTask.description}
                      onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#00D4FF] focus:outline-none"
                      placeholder="Brief description of the task"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Instructions</label>
                    <textarea
                      value={editingTask.instructions}
                      onChange={(e) => setEditingTask({ ...editingTask, instructions: e.target.value })}
                      rows={4}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#00D4FF] focus:outline-none"
                      placeholder="Detailed instructions for solving the task"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">JavaScript Starter Code</label>
                      <textarea
                        value={editingTask.starterCode.javascript}
                        onChange={(e) => setEditingTask({
                          ...editingTask,
                          starterCode: { ...editingTask.starterCode, javascript: e.target.value }
                        })}
                        rows={6}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-[#00D4FF] focus:outline-none"
                        placeholder="function solution() {\n  // Your code here\n}"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Python Starter Code</label>
                      <textarea
                        value={editingTask.starterCode.python}
                        onChange={(e) => setEditingTask({
                          ...editingTask,
                          starterCode: { ...editingTask.starterCode, python: e.target.value }
                        })}
                        rows={6}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-[#00D4FF] focus:outline-none"
                        placeholder="def solution():\n    # Your code here\n    pass"
                      />
                    </div>
                  </div>

                  {/* Test Cases */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-300">Test Cases</label>
                      <button
                        onClick={addTestCase}
                        className="flex items-center space-x-2 bg-[#8B5CF6] text-white px-3 py-1 rounded-lg hover:bg-[#7C3AED] transition-colors text-sm"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Test Case</span>
                      </button>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {editingTask.testCases.map((testCase, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-300">Test Case {index + 1}</span>
                            <button
                              onClick={() => removeTestCase(index)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Input</label>
                              <input
                                type="text"
                                value={testCase.input}
                                onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:border-[#00D4FF] focus:outline-none"
                                placeholder="e.g., 2,3 or [1,2,3]"
                              />
                            </div>

                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Expected Output</label>
                              <input
                                type="text"
                                value={testCase.expectedOutput}
                                onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:border-[#00D4FF] focus:outline-none"
                                placeholder="e.g., 5 or [1,2,3]"
                              />
                            </div>

                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Description</label>
                              <input
                                type="text"
                                value={testCase.description}
                                onChange={(e) => updateTestCase(index, 'description', e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:border-[#00D4FF] focus:outline-none"
                                placeholder="Test description"
                              />
                            </div>
                          </div>

                          <div className="mt-2">
                            <label className="flex items-center space-x-2 text-sm text-gray-300">
                              <input
                                type="checkbox"
                                checked={testCase.isHidden}
                                onChange={(e) => updateTestCase(index, 'isHidden', e.target.checked)}
                                className="rounded border-white/20 bg-white/10 text-[#00D4FF] focus:ring-[#00D4FF]"
                              />
                              <span>Hidden test case</span>
                            </label>
                          </div>
                        </div>
                      ))}
                      
                      {editingTask.testCases.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <p>No test cases added yet.</p>
                          <p className="text-sm">Click "Add Test Case" to create your first test.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tasks List */}
              {!editingTask && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.map(task => (
                    <div key={task.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-white">{task.title}</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingTask(task)}
                            className="text-[#00D4FF] hover:text-blue-300 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{task.description}</p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded-full text-white ${
                          task.difficulty === 'beginner' ? 'bg-green-500' :
                          task.difficulty === 'easy' ? 'bg-blue-500' :
                          task.difficulty === 'medium' ? 'bg-yellow-500' :
                          task.difficulty === 'hard' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}>
                          {task.difficulty}
                        </span>
                        <span className="text-gray-400">{task.xpReward} XP</span>
                      </div>
                    </div>
                  ))}
                  
                  {tasks.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                      <p className="text-lg mb-2">No tasks found</p>
                      <p className="text-sm">Create your first task to get started!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">User Management</h3>
              
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">XP</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Admin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">{user.username}</div>
                              <div className="text-sm text-gray-400">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.level}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.totalXp}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.isAdmin ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'bg-gray-600 text-gray-300'
                            }`}>
                              {user.isAdmin ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Analytics Dashboard</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-[#00D4FF]/20 to-[#0EA5E9]/20 border border-[#00D4FF]/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Users</p>
                      <p className="text-2xl font-bold text-white">{users.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-[#00D4FF]" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 border border-[#10B981]/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Tasks</p>
                      <p className="text-2xl font-bold text-white">{tasks.length}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-[#10B981]" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#8B5CF6]/20 to-[#7C3AED]/20 border border-[#8B5CF6]/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Avg Level</p>
                      <p className="text-2xl font-bold text-white">
                        {users.length > 0 ? Math.round(users.reduce((sum, user) => sum + user.level, 0) / users.length) : 0}
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-[#8B5CF6]" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#F59E0B]/20 to-[#D97706]/20 border border-[#F59E0B]/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total XP</p>
                      <p className="text-2xl font-bold text-white">
                        {users.reduce((sum, user) => sum + user.totalXp, 0).toLocaleString()}
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-[#F59E0B]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};