import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SailorButton from '@/components/SailorButton';
import { Colors } from '@/constants/colors';
import Animated, { 
  FadeIn
} from 'react-native-reanimated';
import { Platform } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  
  const handleGetStarted = () => {
    router.push('/auth/register');
  };
  
  const handleLogin = () => {
    router.push('/auth/login');
  };
  
  // Content for both web and native
  const content = (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1575633185690-5a91f9145a76?q=80&w=1200&auto=format&fit=crop' }} 
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.logoContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop' }} 
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Welcome to VST</Text>
              <Text style={styles.subtitle}>
                The complete vessel management solution for owners, captains, and maintenance crews
              </Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <SailorButton
                label="Get Started"
                onPress={handleGetStarted}
                style={styles.button}
              />
              
              <TouchableOpacity onPress={handleLogin} style={styles.loginLink}>
                <Text style={styles.loginText}>
                  Already have an account? <Text style={styles.loginTextBold}>Log In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
  
  // Use Animated.View for native platforms
  if (Platform.OS !== 'web') {
    return (
      <Animated.View 
        style={styles.animatedContainer}
        entering={FadeIn.duration(800)}
      >
        {content}
      </Animated.View>
    );
  }
  
  // Regular view for web
  return content;
}

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: Colors.white,
    marginBottom: 32,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
    maxWidth: '85%',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 24,
  },
  button: {
    marginBottom: 16,
  },
  loginLink: {
    alignItems: 'center',
    padding: 12,
  },
  loginText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loginTextBold: {
    fontWeight: "700",
  },
});