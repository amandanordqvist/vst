import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '@/constants/colors';
import ErrorBoundary from './error-boundary';
import { useAuthStore } from '@/store/auth-store';

// Auth check component to handle protected routes
function AuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'tabs';
    const inAuthScreens = segments[0] === 'auth';
    const inPublicScreens = segments[0] === 'splash' || segments[0] === 'welcome';

    console.log('Auth check:', { isAuthenticated, inAuthGroup, segments });

    // Delay navigation to ensure layout is mounted
    const timer = setTimeout(() => {
      if (isAuthenticated && (inAuthScreens || inPublicScreens)) {
        // Redirect to the main app if user is authenticated but on auth or public screens
        router.replace('/tabs');
      } else if (!isAuthenticated && inAuthGroup) {
        // Redirect to splash if user is not authenticated but trying to access protected routes
        router.replace('/splash');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isInitialized, segments, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="dark" />
          <AuthCheck>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: colors.white,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                  fontWeight: '600',
                },
                headerShadowVisible: false,
                contentStyle: {
                  backgroundColor: colors.background,
                },
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="splash" options={{ headerShown: false }} />
              <Stack.Screen name="welcome" options={{ headerShown: false }} />
              <Stack.Screen name="auth/login" options={{ headerShown: false }} />
              <Stack.Screen name="auth/register" options={{ headerShown: false }} />
              <Stack.Screen name="tabs" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </AuthCheck>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}