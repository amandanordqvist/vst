import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { ChevronRight } from 'lucide-react-native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp, 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming 
} from 'react-native-reanimated';
import { Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  
  const handleGetStarted = () => {
    router.push('/auth/register');
  };
  
  const handleLogin = () => {
    router.push('/auth/login');
  };
  
  // Use regular View for web
  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070&auto=format&fit=crop' }}
          style={styles.backgroundImage}
        >
          <View style={styles.overlay} />
          
          <SafeAreaView style={styles.container}>
            <View style={styles.content}>
              <View style={styles.header}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop' }} 
                  style={styles.logo} 
                  resizeMode="contain"
                />
                <Text style={styles.title}>VST Boat Management</Text>
                <Text style={styles.subtitle}>
                  The complete solution for vessel maintenance, monitoring, and management
                </Text>
              </View>
              
              <View style={styles.features}>
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Text style={styles.featureIconText}>✓</Text>
                  </View>
                  <Text style={styles.featureText}>Comprehensive maintenance tracking</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Text style={styles.featureIconText}>✓</Text>
                  </View>
                  <Text style={styles.featureText}>Real-time vessel monitoring</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Text style={styles.featureIconText}>✓</Text>
                  </View>
                  <Text style={styles.featureText}>Digital checklists and documentation</Text>
                </View>
              </View>
              
              <View style={styles.actions}>
                <Button
                  title="Get Started"
                  onPress={handleGetStarted}
                  size="large"
                  fullWidth
                  style={styles.getStartedButton}
                />
                
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginText}>Already have an account? Log In</Text>
                  <ChevronRight size={16} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </>
    );
  }
  
  // Use Animated.View for native platforms
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070&auto=format&fit=crop' }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Animated.View 
              entering={FadeInDown.duration(800).springify()} 
              style={styles.header}
            >
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop' }} 
                style={styles.logo} 
                resizeMode="contain"
              />
              <Text style={styles.title}>VST Boat Management</Text>
              <Text style={styles.subtitle}>
                The complete solution for vessel maintenance, monitoring, and management
              </Text>
            </Animated.View>
            
            <Animated.View 
              entering={FadeInDown.delay(300).duration(800).springify()} 
              style={styles.features}
            >
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>✓</Text>
                </View>
                <Text style={styles.featureText}>Comprehensive maintenance tracking</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>✓</Text>
                </View>
                <Text style={styles.featureText}>Real-time vessel monitoring</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>✓</Text>
                </View>
                <Text style={styles.featureText}>Digital checklists and documentation</Text>
              </View>
            </Animated.View>
            
            <Animated.View 
              entering={FadeInUp.delay(600).duration(800).springify()} 
              style={styles.actions}
            >
              <Button
                title="Get Started"
                onPress={handleGetStarted}
                size="large"
                fullWidth
                style={styles.getStartedButton}
              />
              
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginText}>Already have an account? Log In</Text>
                <ChevronRight size={16} color={colors.white} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: colors.white,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  features: {
    marginVertical: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIconText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  featureText: {
    ...typography.body,
    color: colors.white,
    flex: 1,
  },
  actions: {
    marginBottom: 40,
  },
  getStartedButton: {
    marginBottom: 20,
  },
  loginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginText: {
    ...typography.body,
    color: colors.white,
    marginRight: 8,
  },
});