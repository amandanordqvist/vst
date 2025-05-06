import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  role?: 'owner' | 'captain' | 'maintenance';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'owner' | 'captain' | 'maintenance') => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock login - in a real app, this would validate credentials with a backend
          if (email === 'demo@example.com' && password === 'password') {
            set({
              user: {
                id: 'u1',
                name: 'John Sailor',
                email: 'demo@example.com',
                profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
                role: 'owner',
              },
              isAuthenticated: true,
              isLoading: false,
            });
            
            console.log("Login successful, state updated:", {
              isAuthenticated: true,
              user: {
                id: 'u1',
                name: 'John Sailor',
                email: 'demo@example.com',
                role: 'owner',
              }
            });
            
            return Promise.resolve();
          } else {
            const errorMsg = 'Invalid email or password';
            console.log("Login failed:", errorMsg);
            
            set({
              error: errorMsg,
              isLoading: false,
            });
            
            return Promise.reject(new Error(errorMsg));
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Login failed';
          console.error("Login error:", errorMsg);
          
          set({
            error: errorMsg,
            isLoading: false,
          });
          
          return Promise.reject(error);
        }
      },
      
      register: async (name, email, password, role = 'owner') => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock registration - in a real app, this would create a user in the backend
          set({
            user: {
              id: `u${Date.now()}`,
              name,
              email,
              role,
            },
            isAuthenticated: true,
            isLoading: false,
          });
          
          console.log("Registration successful, state updated:", {
            isAuthenticated: true,
            user: {
              id: `u${Date.now()}`,
              name,
              email,
              role,
            }
          });
          
          return Promise.resolve();
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Registration failed';
          console.error("Registration error:", errorMsg);
          
          set({
            error: errorMsg,
            isLoading: false,
          });
          
          return Promise.reject(error);
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
        console.log("User logged out");
      },
      
      updateUser: async (updates) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
            isLoading: false,
          }));
          
          console.log("User updated:", updates);
          return Promise.resolve();
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Failed to update user';
          console.error("Update user error:", errorMsg);
          
          set({
            error: errorMsg,
            isLoading: false,
          });
          
          return Promise.reject(error);
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // Set isInitialized to true after hydration is complete
        if (state) {
          state.isInitialized = true;
          console.log("Auth store rehydrated:", {
            isAuthenticated: state.isAuthenticated,
            user: state.user,
            isInitialized: true
          });
        }
      },
    }
  )
);