import { supabase } from '../config/supabase';
import bcrypt from 'bcryptjs';
import { User } from '../types';

export const authService = {
  async register(email: string, username: string, password: string) {
    try {
      // Check if user exists
      const { data: existingUsers } = await supabase
        .from('users')
        .select('email, username')
        .or(`email.eq.${email},username.eq.${username}`);

      if (existingUsers && existingUsers.length > 0) {
        const emailExists = existingUsers.some(user => user.email === email);
        const usernameExists = existingUsers.some(user => user.username === username);
        
        if (emailExists) throw new Error('Email already registered');
        if (usernameExists) throw new Error('Username already taken');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
          email: email.toLowerCase(),
          username: username.toLowerCase(),
          password_hash: hashedPassword,
          total_xp: 0,
          level: 1,
          is_admin: false
        }])
        .select('id, email, username, total_xp, level, is_admin, created_at')
        .single();

      if (error) throw error;

      return { success: true, user: newUser };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async login(identifier: string, password: string) {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${identifier.toLowerCase()},username.eq.${identifier.toLowerCase()}`);

      if (error) throw error;
      if (!users || users.length === 0) throw new Error('Invalid credentials');

      const user = users[0];
      const isValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isValid) throw new Error('Invalid credentials');

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      const userData: User = {
        id: user.id,
        email: user.email,
        username: user.username,
        totalXp: user.total_xp,
        level: user.level,
        isAdmin: user.is_admin,
        createdAt: user.created_at
      };

      localStorage.setItem('hackbox-user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  logout() {
    localStorage.removeItem('hackbox-user');
    return { success: true };
  },

  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('hackbox-user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.isAdmin || false;
  }
};