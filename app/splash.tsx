import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
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
      router.replace('/tabs');
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
              <Text style={styles.title}>VST Boat Management</Text>
              <Text style={styles.subtitle}>
                The complete solution for vessel owners, captains, and maintenance crews
              </Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Get Started"
                onPress={() => router.push('/welcome')}
                fullWidth
                style={styles.button}
              />
              
              <Button
                title="Log In"
                onPress={() => router.push('/auth/login')}
                variant="outline"
                fullWidth
                style={styles.button}
              />
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
            <Text style={styles.title}>VST Boat Management</Text>
            <Text style={styles.subtitle}>
              The complete solution for vessel owners, captains, and maintenance crews
            </Text>
          </Animated.View>
          
          <Animated.View style={[styles.buttonContainer, contentAnimatedStyle]}>
            <Button
              title="Get Started"
              onPress={() => router.push('/welcome')}
              fullWidth
              style={styles.button}
            />
            
            <Button
              title="Log In"
              onPress={() => router.push('/auth/login')}
              variant="outline"
              fullWidth
              style={styles.button}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    borderColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
    maxWidth: '80%',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  button: {
    marginBottom: 16,
  },
});