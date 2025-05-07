import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  timestamp: number;
  related?: {
    type: 'maintenance' | 'checklist' | 'vessel' | 'report';
    id: string;
  };
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  maintenanceAlerts: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  maintenanceAlerts: 0,
  isLoading: false,
  error: null,
  
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock data - would be replaced with API call
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Maintenance Due',
          message: 'Engine oil change is due in 3 days',
          type: 'warning',
          isRead: false,
          timestamp: Date.now() - 3600000, // 1 hour ago
          related: {
            type: 'maintenance',
            id: 'maint-123'
          }
        },
        {
          id: '2',
          title: 'Checklist Completed',
          message: 'Pre-departure checklist completed by Captain John',
          type: 'success',
          isRead: true,
          timestamp: Date.now() - 86400000, // 1 day ago
          related: {
            type: 'checklist',
            id: 'check-456'
          }
        },
        {
          id: '3',
          title: 'Critical Alert',
          message: 'Bilge pump requires immediate attention',
          type: 'error',
          isRead: false,
          timestamp: Date.now() - 43200000, // 12 hours ago
          related: {
            type: 'maintenance',
            id: 'maint-789'
          }
        },
        {
          id: '4',
          title: 'Fuel Level Low',
          message: 'Vessel fuel level is below 25%',
          type: 'warning',
          isRead: false,
          timestamp: Date.now() - 7200000, // 2 hours ago
          related: {
            type: 'vessel',
            id: 'vessel-001'
          }
        }
      ];
      
      // Calculate counts
      const unreadCount = mockNotifications.filter(n => !n.isRead).length;
      const maintenanceAlerts = mockNotifications.filter(
        n => !n.isRead && n.related?.type === 'maintenance'
      ).length;
      
      set({
        notifications: mockNotifications,
        unreadCount,
        maintenanceAlerts,
        isLoading: false
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch notifications'
      });
    }
  },
  
  markAsRead: (id: string) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    
    // Recalculate counts
    const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
    const maintenanceAlerts = updatedNotifications.filter(
      n => !n.isRead && n.related?.type === 'maintenance'
    ).length;
    
    set({ 
      notifications: updatedNotifications,
      unreadCount,
      maintenanceAlerts
    });
  },
  
  markAllAsRead: () => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    
    set({
      notifications: updatedNotifications,
      unreadCount: 0,
      maintenanceAlerts: 0
    });
  },
  
  clearAll: () => {
    set({
      notifications: [],
      unreadCount: 0,
      maintenanceAlerts: 0
    });
  },
  
  addNotification: (notification) => {
    const { notifications } = get();
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      isRead: false
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    
    // Recalculate counts
    const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
    const maintenanceAlerts = updatedNotifications.filter(
      n => !n.isRead && n.related?.type === 'maintenance'
    ).length;
    
    set({
      notifications: updatedNotifications,
      unreadCount,
      maintenanceAlerts
    });
  }
}));