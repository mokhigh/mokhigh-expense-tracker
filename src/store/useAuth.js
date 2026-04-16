import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

export const useAuth = create((set) => ({
  user: null,
  loading: true,

  init: async () => {
    if (!isSupabaseConfigured) {
      set({ loading: false });
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ user: session?.user ?? null, loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null });
    });
  },

  signIn: async (email) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  },

  verifyOtp: async (email, token) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    if (error) throw error;
  },

  signOut: async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
