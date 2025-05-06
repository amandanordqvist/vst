import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { maintenanceItems } from '@/mocks/maintenance';

export interface MaintenanceItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  estimatedTime: string;
  category?: string;
  instructions?: string[];
  images?: string[];
}

interface MaintenanceState {
  items: MaintenanceItem[];
  isLoading: boolean;
  error: string | null;
  
  fetchMaintenanceItems: () => Promise<void>;
  addMaintenanceItem: (item: Omit<MaintenanceItem, 'id'>) => Promise<void>;
  updateItemStatus: (id: string, status: string) => Promise<void>;
  updateMaintenanceItem: (id: string, updates: Partial<MaintenanceItem>) => Promise<void>;
  deleteMaintenanceItem: (id: string) => Promise<void>;
}

export const useMaintenanceStore = create<MaintenanceState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      
      fetchMaintenanceItems: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Convert mock data to ensure it matches the MaintenanceItem type
          const typedItems: MaintenanceItem[] = maintenanceItems.map(item => ({
            ...item,
            priority: item.priority as MaintenanceItem['priority'],
            status: item.status as MaintenanceItem['status']
          }));
          
          // In a real app, this would fetch data from an API
          set({ items: typedItems, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch maintenance items',
            isLoading: false,
          });
        }
      },
      
      addMaintenanceItem: async (item) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newItem: MaintenanceItem = {
            ...item,
            id: `m${Date.now()}`,
          };
          
          set(state => ({
            items: [...state.items, newItem],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add maintenance item',
            isLoading: false,
          });
        }
      },
      
      updateItemStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            items: state.items.map(item => 
              item.id === id ? { ...item, status: status as MaintenanceItem['status'] } : item
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update item status',
            isLoading: false,
          });
        }
      },
      
      updateMaintenanceItem: async (id, updates) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            items: state.items.map(item => 
              item.id === id ? { ...item, ...updates } : item
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update maintenance item',
            isLoading: false,
          });
        }
      },
      
      deleteMaintenanceItem: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            items: state.items.filter(item => item.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete maintenance item',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'maintenance-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);