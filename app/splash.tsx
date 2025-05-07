import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/Button';
import { typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { Platform } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);
  
  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // If user is already authenticated, redirect to main app
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);
  
  // Initialize animations
  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Logo animation
      logoOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
      logoScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
      
      // Content animation with delay
      contentOpacity.value = withDelay(400, withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) }));
      contentTranslateY.value = withDelay(400, withTiming(0, { duration: 800, easing: Easing.out(Easing.quad) }));
    } else {
      // Set values directly for web
      logoOpacity.value = 1;
      logoScale.value = 1;
      contentOpacity.value = 1;
      contentTranslateY.value = 0;
    }
  }, []);
  
  // Define animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });
  
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });
  
  // Use regular Views for web
  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop' }} 
                style={styles.logo} 
                resizeMode="contain"
              />
              <Text style={styles.title}>VST</Text>
              <Text style={styles.subtitle}>
                Monitor and manage your vessel operations
              </Text>
              <ActivityIndicator size="large" color={Colors.white} style={styles.loader} />
            </View>
            
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
  
  // Use Animated.View for native platforms
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop' }} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={styles.title}>VST</Text>
            <Text style={styles.subtitle}>
              Monitor and manage your vessel operations
            </Text>
            <ActivityIndicator size="large" color={Colors.white} style={styles.loader} />
          </Animated.View>
          
          <Animated.View style={[styles.versionContainer, contentAnimatedStyle]}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 32,
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32, fontWeight: "700", lineHeight: 40, letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 16,
    color: Colors.white,
  },
  subtitle: {
    textAlign: 'center',
    color: Colors.white,
    maxWidth: '80%',
    fontSize: 18,
  },
  loader: {
    marginTop: 40,
  },
  versionContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 12, fontWeight: "400", lineHeight: 16, letterSpacing: 0.4,
    color: Colors.white,
    opacity: 0.7,
  },
});