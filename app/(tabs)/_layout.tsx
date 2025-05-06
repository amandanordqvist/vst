import React from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Home, CheckSquare, BarChart2, Settings, Wrench } from 'lucide-react-native';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 60 + (insets.bottom > 0 ? insets.bottom : 16),
          paddingTop: 8,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 5,
        },
        tabBarLabelStyle: {
          ...typography.caption,
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 5,
        },
        headerTitleStyle: {
          ...typography.h4,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: "Vessel Dashboard",
        }}
      />
      <Tabs.Screen
        name="checklists"
        options={{
          title: "Checklists",
          tabBarIcon: ({ color, size }) => <CheckSquare size={size} color={color} />,
          headerTitle: "Vessel Checklists",
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: "Maintenance",
          tabBarIcon: ({ color, size }) => <Wrench size={size} color={color} />,
          headerTitle: "Maintenance Tasks",
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
          headerTitle: "Vessel Reports",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          headerTitle: "App Settings",
        }}
      />
    </Tabs>
  );
}