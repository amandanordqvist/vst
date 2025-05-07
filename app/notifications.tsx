import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Card from '@/components/Card';
import { typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';
import { 
  ChevronLeft, 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar,
  Settings,
  Trash2
} from 'lucide-react-native';
import { useMaintenanceStore } from '@/store/maintenance-store';
import { useChecklistStore } from '@/store/checklist-store';
import { useNotificationStore } from '@/store/notification-store';

export default function NotificationsScreen() {
  const router = useRouter();
  const { items: maintenanceItems } = useMaintenanceStore();
  const { checklists } = useChecklistStore();
  const { 
    notifications, 
    markAsRead, 
    clearAll, 
    settings, 
    updateSettings 
  } = useNotificationStore();
  
  // Get critical maintenance items
  const criticalItems = maintenanceItems.filter(item => 
    item.priority === 'critical' && item.status !== 'completed'
  );
  
  // Get incomplete checklist items
  const incompleteChecklists = {
    preDeparture: checklists.preDeparture.filter(item => !item.isCompleted),
    postTrip: checklists.postTrip.filter(item => !item.isCompleted),
  };
  
  // Sort notifications by date (newest first)
  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const handleNotificationPress = (id: string) => {
    markAsRead(id);
    
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      switch (notification.type) {
        case 'maintenance':
          router.push(`/maintenance-details?id=${notification.itemId}`);
          break;
        case 'checklist':
          router.push(`/checklist-details?id=${notification.itemId}&type=${notification.checklistType || 'preDeparture'}`);
          break;
        case 'trip':
          router.push(`/trip-details?id=${notification.itemId}`);
          break;
        default:
          break;
      }
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <AlertTriangle size={20} color={Colors.accent} />;
      case 'checklist':
        return <CheckCircle size={20} color={Colors.primary} />;
      case 'trip':
        return <Calendar size={20} color={Colors.success} />;
      default:
        return <Bell size={20} color={Colors.textSecondary} />;
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Notifications',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ChevronLeft size={24} color={Colors.textPrimaryPrimaryPrimary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => clearAll()}
              style={styles.headerButton}
            >
              <Trash2 size={20} color={Colors.textPrimaryPrimaryPrimary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        <Card style={styles.settingsCard}>
          <View style={styles.settingsHeader}>
            <Settings size={20} color={Colors.primary} />
            <Text style={[typography.subtitle, { marginLeft: 8 }]}>Notification Settings</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Maintenance Alerts</Text>
            <Switch
              value={settings.maintenance}
              onValueChange={(value) => updateSettings({ ...settings, maintenance: value })}
              trackColor={{ false: Colors.gray, true: Colors.background }}
              thumbColor={settings.maintenance ? Colors.primary : Colors.textSecondary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Checklist Reminders</Text>
            <Switch
              value={settings.checklists}
              onValueChange={(value) => updateSettings({ ...settings, checklists: value })}
              trackColor={{ false: Colors.gray, true: Colors.background }}
              thumbColor={settings.checklists ? Colors.primary : Colors.textSecondary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Trip Logs</Text>
            <Switch
              value={settings.trips}
              onValueChange={(value) => updateSettings({ ...settings, trips: value })}
              trackColor={{ false: Colors.gray, true: Colors.background }}
              thumbColor={settings.trips ? Colors.primary : Colors.textSecondary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Weather Alerts</Text>
            <Switch
              value={settings.weather}
              onValueChange={(value) => updateSettings({ ...settings, weather: value })}
              trackColor={{ false: Colors.gray, true: Colors.background }}
              thumbColor={settings.weather ? Colors.primary : Colors.textSecondary}
            />
          </View>
        </Card>
        
        {criticalItems.length > 0 && (
          <Card style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <AlertTriangle size={20} color={Colors.accent} />
              <Text style={styles.alertTitle}>Critical Maintenance Required</Text>
            </View>
            
            <Text style={styles.alertText}>
              You have {criticalItems.length} critical maintenance {criticalItems.length === 1 ? 'item' : 'items'} that require attention.
            </Text>
            
            <TouchableOpacity 
              style={styles.alertButton}
              onPress={() => router.push('/(tabs)/maintenance')}
            >
              <Text style={styles.alertButtonText}>View Maintenance</Text>
            </TouchableOpacity>
          </Card>
        )}
        
        {(incompleteChecklists.preDeparture.length > 0 || incompleteChecklists.postTrip.length > 0) && (
          <Card style={styles.reminderCard}>
            <View style={styles.alertHeader}>
              <CheckCircle size={20} color={Colors.primary} />
              <Text style={styles.reminderTitle}>Checklist Reminders</Text>
            </View>
            
            <Text style={styles.alertText}>
              {incompleteChecklists.preDeparture.length > 0 && 
                `Pre-Departure: ${incompleteChecklists.preDeparture.length} items remaining\n`}
              {incompleteChecklists.postTrip.length > 0 && 
                `Post-Trip: ${incompleteChecklists.postTrip.length} items remaining`}
            </Text>
            
            <TouchableOpacity 
              style={styles.alertButton}
              onPress={() => router.push('/(tabs)/checklists')}
            >
              <Text style={styles.alertButtonText}>View Checklists</Text>
            </TouchableOpacity>
          </Card>
        )}
        
        <Text style={[typography.h3, styles.sectionTitle]}>Recent Notifications</Text>
        
        <ScrollView style={styles.notificationsList}>
          {sortedNotifications.length > 0 ? (
            sortedNotifications.map(notification => (
              <TouchableOpacity 
                key={notification.id}
                style={[
                  styles.notificationItem,
                  notification.read ? styles.readNotification : styles.unreadNotification
                ]}
                onPress={() => handleNotificationPress(notification.id)}
              >
                <View style={styles.notificationIcon}>
                  {getNotificationIcon(notification.type)}
                </View>
                
                <View style={styles.notificationContent}>
                  <Text style={[
                    styles.notificationTitle,
                    notification.read ? styles.readText : styles.unreadText
                  ]}>
                    {notification.title}
                  </Text>
                  
                  <Text style={styles.notificationMessage} numberOfLines={2}>
                    {notification.message}
                  </Text>
                  
                  <View style={styles.notificationMeta}>
                    <Clock size={12} color={Colors.textSecondary} />
                    <Text style={styles.notificationTime}>
                      {formatTimestamp(notification.timestamp)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Bell size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyStateText}>No notifications</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  headerButton: {
    padding: 8,
  },
  settingsCard: {
    marginBottom: 16,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
  },
  alertCard: {
    marginBottom: 16,
    backgroundColor: `${Colors.accent}10`,
    borderWidth: 1,
    borderColor: `${Colors.accent}30`,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 18, fontWeight: "600", lineHeight: 26, letterSpacing: 0.15,
    color: Colors.accent,
    marginLeft: 8,
  },
  alertText: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    marginBottom: 12,
  },
  alertButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.accent,
    borderRadius: 8,
  },
  alertButtonText: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    color: Colors.white,
    fontWeight: "600",
  },
  reminderCard: {
    marginBottom: 16,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  reminderTitle: {
    fontSize: 18, fontWeight: "600", lineHeight: 26, letterSpacing: 0.15,
    color: Colors.primary,
    marginLeft: 8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  unreadNotification: {
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
  },
  readNotification: {
    borderColor: Colors.textSecondary,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 18, fontWeight: "600", lineHeight: 26, letterSpacing: 0.15,
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: "700",
  },
  readText: {
    fontWeight: "600",
  },
  notificationMessage: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    marginBottom: 8,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTime: {
    fontSize: 12, fontWeight: "400", lineHeight: 16, letterSpacing: 0.4,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    color: Colors.textSecondary,
    marginTop: 16,
  },
});