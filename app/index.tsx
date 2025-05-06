import React, { useEffect } from 'react';
import { Redirect, useRouter, SplashScreen } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

// Prevent auto hiding splash screen
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function Index() {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();
  
  // Debug logging
  useEffect(() => {
    console.log("Root index rendered with auth state:", { isAuthenticated, isInitialized });
    
    // Only navigate after initialization is complete
    if (isInitialized) {
      try {
        if (isAuthenticated) {
          console.log("User is authenticated, redirecting to tabs");
          // Use setTimeout to ensure this happens after layout is mounted
          setTimeout(() => {
            router.replace('/tabs');
          }, 0);
        } else {
          console.log("User not authenticated, redirecting to splash");
          setTimeout(() => {
            router.replace('/splash');
          }, 0);
        }
      } catch (error) {
        console.error("Navigation error:", error);
      } finally {
        // Hide splash screen after navigation attempt
        SplashScreen.hideAsync().catch(() => {});
      }
    }
  }, [isAuthenticated, isInitialized, router]);
  
  // Show loading indicator while initializing
  if (!isInitialized) {
    console.log("Auth store not initialized yet, showing loading screen");
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  // Return a placeholder view instead of immediate redirects
  // Let the useEffect handle navigation after layout is mounted
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Preparing app...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    gap: 16,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  }
});