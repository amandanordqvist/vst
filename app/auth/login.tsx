import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Colors } from '@/constants/colors';
import { Mail, Lock, Eye, EyeOff, QrCode, ChevronLeft } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  FadeInDown,
  Easing
} from 'react-native-reanimated';

// Google and Apple Icons as SVG components
const GoogleIcon = () => (
  <View style={styles.socialIcon}>
    <Text style={styles.googleLetter}>G</Text>
  </View>
);

const AppleIcon = () => (
  <View style={styles.socialIcon}>
    <Text style={styles.appleLetter}>A</Text>
  </View>
);

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Animation values
  const formOpacity = useSharedValue(0);
  
  // Initialize animations
  useEffect(() => {
    if (Platform.OS !== 'web') {
      formOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
    } else {
      formOpacity.value = 1;
    }
  }, []);
  
  // Define animated styles
  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
    };
  });
  
  const handleLogin = async () => {
    try {
      console.log("Login attempt with:", email, password);
      const result = await login(email, password);
      console.log("Login result:", result);
      
      // If login is successful, navigate to the main app
      router.replace('/(tabs)');
    } catch (err) {
      console.error("Login error:", err);
      if (Platform.OS === 'web') {
        alert(`Login failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } else {
        Alert.alert(
          "Login Failed",
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    }
  };
  
  const handleQrLogin = () => {
    router.push('/auth/qr-scan');
  };
  
  const handleSocialLogin = (provider: 'google' | 'apple') => {
    // In a real app, this would connect to the provider's OAuth flow
    // For the mock-up, we'll just show an alert and then simulate a successful login
    
    if (Platform.OS === 'web') {
      alert(`Logging in with ${provider} (Mock)`);
    } else {
      Alert.alert(
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login`,
        `This is a mockup of ${provider} authentication. In a real app, this would open the ${provider} authentication flow.`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Simulate Login",
            onPress: () => {
              // Simulate loading
              const loadingMessage = Platform.OS === 'web' 
                ? alert(`Simulating ${provider} login...`) 
                : Alert.alert(`Simulating ${provider} login...`);
              
              // Simulate a successful login after a short delay
              setTimeout(() => {
                login('demo@example.com', 'password')
                  .then(() => {
                    router.replace('/(tabs)');
                  })
                  .catch(err => {
                    console.error(`${provider} login error:`, err);
                  });
              }, 1500);
            }
          }
        ]
      );
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };
  
  const animateItem = (index: number) => {
    if (Platform.OS === 'web') {
      return {};
    }
    return { entering: FadeInDown.delay(100 * index).duration(400) };
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Log In',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ChevronLeft size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={[styles.header, formAnimatedStyle]}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop' }} 
                style={styles.logo} 
                resizeMode="contain"
              />
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Log in to manage your vessels
              </Text>
            </Animated.View>
            
            <Animated.View style={[styles.form, formAnimatedStyle]}>
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity onPress={clearError}>
                    <Text style={styles.dismissText}>Dismiss</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              <Animated.View {...animateItem(0)}>
                <Input
                  label="Email or Username"
                  placeholder="Enter your email or username"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<Mail size={20} color={Colors.textSecondary} />}
                />
              </Animated.View>
              
              <Animated.View {...animateItem(1)}>
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  icon={<Lock size={20} color={Colors.textSecondary} />}
                  rightIcon={
                    <TouchableOpacity onPress={toggleShowPassword}>
                      {showPassword ? (
                        <EyeOff size={20} color={Colors.textSecondary} />
                      ) : (
                        <Eye size={20} color={Colors.textSecondary} />
                      )}
                    </TouchableOpacity>
                  }
                />
              </Animated.View>
              
              <Animated.View {...animateItem(2)} style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={styles.rememberMeContainer} 
                  onPress={toggleRememberMe}
                >
                  <View style={[
                    styles.checkbox,
                    rememberMe ? styles.checkboxChecked : null,
                  ]}>
                    {rememberMe && (
                      <View style={styles.checkboxInner} />
                    )}
                  </View>
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </Animated.View>
              
              <Animated.View {...animateItem(3)}>
                <Button
                  title="Log In"
                  onPress={handleLogin}
                  loading={isLoading}
                  fullWidth
                  style={styles.loginButton}
                />
              </Animated.View>
              
              <Animated.View {...animateItem(4)}>
                <Button
                  title="Log in with QR Code"
                  onPress={handleQrLogin}
                  variant="outline"
                  icon={<QrCode size={20} color={Colors.primary} />}
                  fullWidth
                  style={styles.qrLoginButton}
                />
              </Animated.View>
              
              <Animated.View {...animateItem(5)} style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>or continue with</Text>
                <View style={styles.separatorLine} />
              </Animated.View>
              
              <Animated.View {...animateItem(6)}>
                <Button
                  title="Continue with Google"
                  onPress={() => handleSocialLogin('google')}
                  variant="outline"
                  icon={<GoogleIcon />}
                  fullWidth
                  style={styles.socialLoginButton}
                />
              </Animated.View>
              
              <Animated.View {...animateItem(7)}>
                <Button
                  title="Continue with Apple"
                  onPress={() => handleSocialLogin('apple')}
                  variant="outline"
                  icon={<AppleIcon />}
                  fullWidth
                  style={styles.socialLoginButton}
                />
              </Animated.View>
            </Animated.View>
            
            <Animated.View {...animateItem(8)} style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={styles.registerText}>Register</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerButton: {
    padding: 8,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: `${Colors.accent}15`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  errorText: {
    fontSize: 14,
    color: Colors.accent,
    flex: 1,
  },
  dismissText: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: "600",
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  rememberMeText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  loginButton: {
    marginBottom: 16,
  },
  qrLoginButton: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  registerText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
    marginLeft: 4,
  },
  socialLoginButton: {
    marginBottom: 16,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleLetter: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.background,
  },
  appleLetter: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.background,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.textSecondary,
  },
  separatorText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginHorizontal: 16,
  },
});