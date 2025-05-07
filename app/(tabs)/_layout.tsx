import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, CheckSquare, BarChart2, Settings, Wrench, Bell, Map, Anchor } from 'lucide-react-native';
import { useNotificationStore } from '@/store/notification-store';
import Animated, { useAnimatedStyle, withSequence, withTiming, useSharedValue, withRepeat } from 'react-native-reanimated';
import theme from '@/constants/theme';
import { Colors } from '@/constants/colors';

interface TabIconProps {
  color: string;
  size: number;
  icon: React.ElementType;
  showBadge?: boolean;
  badgeCount?: number;
}

// Custom tab icon component with badge
function TabIcon({ color, size, icon: Icon, showBadge = false, badgeCount = 0 }: TabIconProps) {
  // Animation for badge
  const badgeScale = useSharedValue(1);
  
  if (showBadge) {
    badgeScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      2,
      true
    );
  }
  
  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }]
  }));
  
  return (
    <View style={styles.iconContainer}>
      <Icon size={size} color={color} />
      {showBadge && (
        <Animated.View style={[styles.badge, badgeAnimatedStyle]}>
          {badgeCount > 0 && (
            <Animated.Text style={styles.badgeText}>
              {badgeCount > 99 ? '99+' : badgeCount}
            </Animated.Text>
          )}
        </Animated.View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { unreadCount = 0, maintenanceAlerts = 0 } = useNotificationStore();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          height: 60 + (insets.bottom > 0 ? insets.bottom : 16),
          paddingTop: 8,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
          backgroundColor: Colors.background,
          borderTopColor: 'rgba(203, 213, 225, 0.3)', // Very subtle border
          ...theme.shadow.sm,
        },
        tabBarLabelStyle: {
          fontSize: theme.fontSize.xs,
          fontWeight: "500",
          marginTop: theme.spacing.xxs,
        },
        headerStyle: {
          backgroundColor: Colors.background,
          ...theme.shadow.sm,
        },
        headerTitleStyle: {
          fontSize: theme.fontSize.xl,
          fontWeight: "600",
          color: Colors.textPrimary,
        },
        headerTintColor: Colors.textPrimary,
        headerShadowVisible: false,
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <TabIcon 
              icon={Bell} 
              color={Colors.textPrimary} 
              size={24} 
              showBadge={unreadCount > 0} 
              badgeCount={unreadCount}
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <TabIcon 
              icon={Home} 
              color={color} 
              size={size}
            />
          ),
          headerTitle: "Vessel Dashboard",
        }}
      />
      <Tabs.Screen
        name="checklists"
        options={{
          title: "Checklists",
          tabBarIcon: ({ color, size }) => (
            <TabIcon 
              icon={CheckSquare} 
              color={color} 
              size={size}
            />
          ),
          headerTitle: "Vessel Checklists",
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: "Maintenance",
          tabBarIcon: ({ color, size }) => (
            <TabIcon 
              icon={Wrench} 
              color={color} 
              size={size} 
              showBadge={maintenanceAlerts > 0}
              badgeCount={maintenanceAlerts}
            />
          ),
          headerTitle: "Maintenance Tasks",
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, size }) => (
            <TabIcon 
              icon={BarChart2} 
              color={color} 
              size={size}
            />
          ),
          headerTitle: "Vessel Reports",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <TabIcon 
              icon={Settings} 
              color={color} 
              size={size}
            />
          ),
          headerTitle: "App Settings",
        }}
      />
      <Tabs.Screen
        name="design-system"
        options={{
          title: "Design",
          tabBarIcon: ({ color, size }) => (
            <TabIcon 
              icon={Anchor} 
              color={color} 
              size={size}
            />
          ),
          headerTitle: "Sailor Luxe Theme",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.accent, // Using our accent color for badges
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  badgeText: {
    color: Colors.primary, // Dark text on light badge for contrast
    fontSize: 10,
    fontWeight: "700",
  },
  headerRightContainer: {
    marginRight: 16,
  }
});