import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Notification {
  id: string;
  type: 'maintenance' | 'checklist' | 'trip' | 'weather' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  itemId?: string;
  checklistType?: 'preDeparture' | 'postTrip';
}

interface NotificationSettings {
  maintenance: boolean;
  checklists: boolean;
  trips: boolean;
  weather: boolean;
}

interface NotificationState {
  notifications: Notification[];
  settings: NotificationSettings;
  
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  updateSettings: (settings: NotificationSettings) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [
        {
          id: '1',
          type: 'maintenance',
          title: 'Critical Maintenance Due',
          message: 'Engine Oil Change is overdue. Please schedule maintenance as soon as possible.',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          read: false,
          itemId: '1',
        },
        {
          id: '2',
          type: 'checklist',
          title: 'Pre-Departure Checklist Incomplete',
          message: 'You have 8 items remaining on your pre-departure checklist.',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          read: true,
          itemId: 'pd1',
          checklistType: 'preDeparture',
        },
        {
          id: '3',
          type: 'weather',
          title: 'Weather Advisory',
          message: 'Small craft advisory in effect for your area. High winds and choppy waters expected.',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          read: false,
        },
        {
          id: '4',
          type: 'trip',
          title: 'Trip Log Reminder',
          message: "Don't forget to log your recent trip details for better maintenance tracking.",
          timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          read: true,
        },
        {
          id: '5',
          type: 'system',
          title: 'Welcome to Marine Manager',
          message: 'Thank you for using Marine Manager. Set up your vessel profile to get started.',
          timestamp: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
          read: true,
        },
      ],
      settings: {
        maintenance: true,
        checklists: true,
        trips: true,
        weather: true,
      },
      
      addNotification: (notification) => {
        set((state) => ({
          notifications: [
            {
              id: `n${Date.now()}`,
              timestamp: new Date().toISOString(),
              read: false,
              ...notification,
            },
            ...state.notifications,
          ],
        }));
      },
      
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(notification => 
            notification.id === id 
              ? { ...notification, read: true } 
              : notification
          ),
        }));
      },
      
      clearAll: () => {
        set({ notifications: [] });
      },
      
      updateSettings: (settings) => {
        set({ settings });
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);