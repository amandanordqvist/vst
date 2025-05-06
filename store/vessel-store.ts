import { create } from 'zustand';
import { vessels } from '@/mocks/vessels';

interface VesselState {
  vessels: typeof vessels;
  selectedVesselId: string | null;
  isLoading: boolean;
  error: string | null;
  
  fetchVessels: () => Promise<void>;
  selectVessel: (id: string) => void;
  clearSelectedVessel: () => void;
}

export const useVesselStore = create<VesselState>((set, get) => ({
  vessels: [],
  selectedVesselId: null,
  isLoading: false,
  error: null,
  
  fetchVessels: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({
        vessels,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch vessels',
        isLoading: false,
      });
    }
  },
  
  selectVessel: (id) => {
    set({ selectedVesselId: id });
  },
  
  clearSelectedVessel: () => {
    set({ selectedVesselId: null });
  },
}));