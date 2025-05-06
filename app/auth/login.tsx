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
  Dimensions,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { Mail, Lock, Eye, EyeOff, QrCode } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(30);
  
  // Initialize animations
  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Logo animation
      logoOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
      logoScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
      
      // Form animation with delay
      formOpacity.value = withDelay(400, withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) }));
      formTranslateY.value = withDelay(400, withTiming(0, { duration: 800, easing: Easing.out(Easing.quad) }));
    } else {
      // Set values directly for web
      logoOpacity.value = 1;
      logoScale.value = 1;
      formOpacity.value = 1;
      formTranslateY.value = 0;
    }
  }, []);
  
  // Define animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });
  
  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ translateY: formTranslateY.value }],
    };
  });
  
  const handleLogin = async () => {
    try {
      console.log("Login attempt with:", email, password);
      const result = await login(email, password);
      console.log("Login result:", result);
      
      // If login is successful, navigate to the main app
      router.replace('/tabs');
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
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };
  
  // Use regular Views for web
  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop' }} 
                  style={styles.logo} 
                  resizeMode="contain"
                />
                <Text style={typography.h1}>Welcome Back</Text>
                <Text style={[typography.body, styles.subtitle]}>
                  Log in to manage your vessels
                </Text>
              </View>
              
              <View style={styles.form}>
                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={clearError}>
                      <Text style={styles.dismissText}>Dismiss</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<Mail size={20} color={colors.gray} />}
                />
                
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  icon={<Lock size={20} color={colors.gray} />}
                  rightIcon={
                    <TouchableOpacity onPress={toggleShowPassword}>
                      {showPassword ? (
                        <EyeOff size={20} color={colors.gray} />
                      ) : (
                        <Eye size={20} color={colors.gray} />
                      )}
                    </TouchableOpacity>
                  }
                />
                
                <View style={styles.optionsContainer}>
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
                  
                  <TouchableOpacity>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
                
                <Button
                  title="Log In"
                  onPress={handleLogin}
                  loading={isLoading}
                  fullWidth
                  style={styles.loginButton}
                />
                
                <Button
                  title="Log in with QR Code"
                  onPress={() => {}}
                  variant="outline"
                  icon={<QrCode size={20} color={colors.primary} />}
                  fullWidth
                  style={styles.qrLoginButton}
                />
              </View>
              
              <View style={styles.footer}>
                <Text style={typography.body}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.push('/auth/register')}>
                  <Text style={styles.registerText}>Register</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </>
    );
  }
  
  // Use Animated.View for native platforms
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={[styles.header, logoAnimatedStyle]}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop' }} 
                style={styles.logo} 
                resizeMode="contain"
              />
              <Text style={typography.h1}>Welcome Back</Text>
              <Text style={[typography.body, styles.subtitle]}>
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
              
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Mail size={20} color={colors.gray} />}
              />
              
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                icon={<Lock size={20} color={colors.gray} />}
                rightIcon={
                  <TouchableOpacity onPress={toggleShowPassword}>
                    {showPassword ? (
                      <EyeOff size={20} color={colors.gray} />
                    ) : (
                      <Eye size={20} color={colors.gray} />
                    )}
                  </TouchableOpacity>
                }
              />
              
              <View style={styles.optionsContainer}>
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
                
                <TouchableOpacity>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              
              <Button
                title="Log In"
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                style={styles.loginButton}
              />
              
              <Button
                title="Log in with QR Code"
                onPress={() => {}}
                variant="outline"
                icon={<QrCode size={20} color={colors.primary} />}
                fullWidth
                style={styles.qrLoginButton}
              />
            </Animated.View>
            
            <Animated.View style={[styles.footer, formAnimatedStyle]}>
              <Text style={typography.body}>Don't have an account?</Text>
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
    backgroundColor: colors.background,
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
    borderColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: `${colors.error}15`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    flex: 1,
  },
  dismissText: {
    ...typography.bodySmall,
    color: colors.error,
    fontWeight: '600',
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
    borderColor: colors.gray,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  rememberMeText: {
    ...typography.bodySmall,
  },
  forgotPasswordText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
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
  registerText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
});