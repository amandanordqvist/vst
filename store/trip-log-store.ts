import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TripLog {
  id: string;
  title: string;
  date: string;
  vesselId: string;
  startTime: string;
  endTime: string;
  duration: string;
  departureLocation: string;
  arrivalLocation: string;
  distance: number;
  fuelUsed: number;
  engineHours: number;
  weatherConditions?: string;
  notes?: string;
  crewMembers?: string[];
  photos?: string[];
}

interface NewTripLog {
  title: string;
  date: string;
  vesselId: string;
  startTime: string;
  endTime: string;
  duration: string;
  departureLocation: string;
  arrivalLocation: string;
  distance: number;
  fuelUsed: number;
  engineHours: number;
  weatherConditions?: string;
  notes?: string;
  crewMembers?: string[];
  photos?: string[];
}

interface TripLogState {
  trips: TripLog[];
  isLoading: boolean;
  error: string | null;
  
  fetchTrips: () => Promise<void>;
  addTrip: (trip: NewTripLog) => Promise<void>;
  updateTrip: (id: string, updates: Partial<TripLog>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
}

export const useTripLogStore = create<TripLogState>()(
  persist(
    (set, get) => ({
      trips: [
        {
          id: 't1',
          title: 'Weekend Fishing Trip',
          date: '2023-06-10',
          vesselId: '1',
          startTime: '07:30',
          endTime: '14:00',
          duration: '6h 30m',
          departureLocation: 'Marina Bay',
          arrivalLocation: 'Marina Bay',
          distance: 28.5,
          fuelUsed: 12.2,
          engineHours: 6.5,
          weatherConditions: 'Sunny, light winds from the east, calm seas',
          notes: 'Great day for fishing. Caught several bass and a few snappers.',
          crewMembers: ['John Smith', 'Mike Johnson', 'Sarah Williams'],
        },
        {
          id: 't2',
          title: 'Sunset Cruise',
          date: '2023-06-05',
          vesselId: '2',
          startTime: '17:00',
          endTime: '20:30',
          duration: '3h 30m',
          departureLocation: 'Harbor Point',
          arrivalLocation: 'Harbor Point',
          distance: 12.3,
          fuelUsed: 5.8,
          engineHours: 3.5,
          weatherConditions: 'Clear skies, light breeze, calm waters',
          notes: 'Beautiful sunset cruise with family. Perfect conditions.',
          crewMembers: ['Robert Brown', 'Lisa Brown'],
        },
        {
          id: 't3',
          title: 'Maintenance Test Run',
          date: '2023-05-28',
          vesselId: '1',
          startTime: '09:00',
          endTime: '11:30',
          duration: '2h 30m',
          departureLocation: 'Marina Bay',
          arrivalLocation: 'Marina Bay',
          distance: 8.7,
          fuelUsed: 3.2,
          engineHours: 2.5,
          weatherConditions: 'Partly cloudy, moderate winds',
          notes: 'Test run after engine maintenance. Everything running smoothly.',
          crewMembers: ['John Smith'],
        },
      ],
      isLoading: false,
      error: null,
      
      fetchTrips: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, we would fetch from an API
          // Here we're just simulating a delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Data is already loaded from persistence
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch trips',
            isLoading: false,
          });
        }
      },
      
      addTrip: async (trip) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newTrip: TripLog = {
            id: `t${Date.now()}`,
            ...trip,
          };
          
          set(state => ({
            trips: [...state.trips, newTrip],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add trip',
            isLoading: false,
          });
          
          throw error;
        }
      },
      
      updateTrip: async (id, updates) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            trips: state.trips.map(trip => 
              trip.id === id ? { ...trip, ...updates } : trip
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update trip',
            isLoading: false,
          });
          
          throw error;
        }
      },
      
      deleteTrip: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            trips: state.trips.filter(trip => trip.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete trip',
            isLoading: false,
          });
          
          throw error;
        }
      },
    }),
    {
      name: 'trip-log-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);