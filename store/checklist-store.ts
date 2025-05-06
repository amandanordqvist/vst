import { create } from 'zustand';
import { checklists } from '@/mocks/checklists';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  requiresPhoto: boolean;
  hasPhoto: boolean;
  hasIssue: boolean;
  issueDescription?: string;
  notes?: string;
}

interface ChecklistState {
  checklists: {
    preDeparture: ChecklistItem[];
    postTrip: ChecklistItem[];
  };
  currentType: 'preDeparture' | 'postTrip';
  isLoading: boolean;
  error: string | null;
  
  fetchChecklists: () => Promise<void>;
  setCurrentType: (type: 'preDeparture' | 'postTrip') => void;
  toggleItem: (id: string) => void;
  addPhoto: (id: string) => void;
  reportIssue: (id: string, description?: string) => void;
  addNote: (id: string, note: string) => void;
  resetChecklist: (type: 'preDeparture' | 'postTrip') => void;
  submitChecklist: (type: 'preDeparture' | 'postTrip') => Promise<void>;
}

export const useChecklistStore = create<ChecklistState>((set, get) => ({
  checklists: {
    preDeparture: [],
    postTrip: [],
  },
  currentType: 'preDeparture',
  isLoading: false,
  error: null,
  
  fetchChecklists: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({
        checklists: {
          preDeparture: checklists.preDeparture,
          postTrip: checklists.postTrip,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch checklists',
        isLoading: false,
      });
    }
  },
  
  setCurrentType: (type) => {
    set({ currentType: type });
  },
  
  toggleItem: (id) => {
    set((state) => {
      const { currentType, checklists } = state;
      
      return {
        checklists: {
          ...checklists,
          [currentType]: checklists[currentType].map(item => 
            item.id === id 
              ? { ...item, isCompleted: !item.isCompleted } 
              : item
          ),
        },
      };
    });
  },
  
  addPhoto: (id) => {
    set((state) => {
      const { currentType, checklists } = state;
      
      return {
        checklists: {
          ...checklists,
          [currentType]: checklists[currentType].map(item => 
            item.id === id 
              ? { ...item, hasPhoto: true } 
              : item
          ),
        },
      };
    });
  },
  
  reportIssue: (id, description) => {
    set((state) => {
      const { currentType, checklists } = state;
      
      return {
        checklists: {
          ...checklists,
          [currentType]: checklists[currentType].map(item => 
            item.id === id 
              ? { ...item, hasIssue: true, issueDescription: description } 
              : item
          ),
        },
      };
    });
  },
  
  addNote: (id, note) => {
    set((state) => {
      const { currentType, checklists } = state;
      
      return {
        checklists: {
          ...checklists,
          [currentType]: checklists[currentType].map(item => 
            item.id === id 
              ? { ...item, notes: note } 
              : item
          ),
        },
      };
    });
  },
  
  resetChecklist: (type) => {
    set((state) => {
      const { checklists } = state;
      
      return {
        checklists: {
          ...checklists,
          [type]: checklists[type].map(item => ({
            ...item,
            isCompleted: false,
            hasPhoto: false,
            hasIssue: false,
            issueDescription: undefined,
            notes: undefined,
          })),
        },
      };
    });
  },
  
  submitChecklist: async (type) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would send the checklist data to the server
      
      set({ isLoading: false });
      
      return Promise.resolve();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to submit checklist',
        isLoading: false,
      });
      
      return Promise.reject(error);
    }
  },
}));