import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';
import { Mail, Lock, Eye, EyeOff, User, ChevronLeft, QrCode, Phone } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import Animated, { FadeInUp } from 'react-native-reanimated';

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

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'owner' | 'captain' | 'maintenance'>('owner');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      if (Platform.OS === 'web') {
        alert("Passwords don't match");
      } else {
        Alert.alert(
          "Password Mismatch",
          "The passwords you entered don't match. Please try again."
        );
      }
      return;
    }
    
    if (!agreeToTerms) {
      if (Platform.OS === 'web') {
        alert("You must agree to the Terms of Service and Privacy Policy");
      } else {
        Alert.alert(
          "Terms Not Accepted",
          "You must agree to the Terms of Service and Privacy Policy to create an account."
        );
      }
      return;
    }
    
    try {
      await register(name, email, password, role);
      // If registration is successful, navigate to the main app
      router.replace('/(tabs)');
    } catch (err) {
      console.error("Registration error:", err);
      // Error is already handled by the auth store
    }
  };
  
  const handleQrCodeRegister = () => {
    router.push('/auth/qr-scan');
  };
  
  const handleSocialRegister = (provider: 'google' | 'apple') => {
    // In a real app, this would connect to the provider's OAuth flow
    // For the mock-up, we'll just show an alert and then simulate a successful registration
    
    if (Platform.OS === 'web') {
      alert(`Registering with ${provider} (Mock)`);
    } else {
      Alert.alert(
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} Registration`,
        `This is a mockup of ${provider} registration. In a real app, this would open the ${provider} authentication flow.`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Simulate Registration",
            onPress: () => {
              // Simulate loading
              const loadingMessage = Platform.OS === 'web' 
                ? alert(`Simulating ${provider} registration...`) 
                : Alert.alert(`Simulating ${provider} registration...`);
              
              // Simulate a successful registration after a short delay
              setTimeout(() => {
                register('Demo User', 'demo@example.com', 'password', 'owner')
                  .then(() => {
                    router.replace('/(tabs)');
                  })
                  .catch(err => {
                    console.error(`${provider} registration error:`, err);
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
  
  const toggleAgreeToTerms = () => {
    setAgreeToTerms(!agreeToTerms);
  };

  const animateItem = (index: number) => {
    if (Platform.OS === 'web') {
      return {};
    }
    return { entering: FadeInUp.delay(100 * index).duration(400) };
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Create Account',
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
      
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View {...animateItem(0)} style={styles.header}>
              <Text style={styles.headerTitle}>Join VST Boat Management</Text>
              <Text style={styles.headerSubtitle}>
                Create an account to get started
              </Text>
            </Animated.View>
            
            <View style={styles.form}>
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity onPress={clearError}>
                    <Text style={styles.dismissText}>Dismiss</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              <Animated.View {...animateItem(1)}>
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  icon={<User size={20} color={Colors.textSecondary} />}
                />
              </Animated.View>
              
              <Animated.View {...animateItem(2)}>
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<Mail size={20} color={Colors.textSecondary} />}
                />
              </Animated.View>
              
              <Animated.View {...animateItem(3)}>
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  icon={<Phone size={20} color={Colors.textSecondary} />}
                />
              </Animated.View>
              
              <Animated.View {...animateItem(4)}>
                <Input
                  label="Password"
                  placeholder="Create a password"
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
              
              <Animated.View {...animateItem(5)}>
                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  icon={<Lock size={20} color={Colors.textSecondary} />}
                />
              </Animated.View>
              
              <Animated.View {...animateItem(6)}>
                <Text style={styles.roleLabel}>Select your role</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.roleButton,
                      role === 'owner' ? styles.roleButtonActive : null,
                    ]}
                    onPress={() => setRole('owner')}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      role === 'owner' ? styles.roleButtonTextActive : null,
                    ]}>
                      Owner
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.roleButton,
                      role === 'captain' ? styles.roleButtonActive : null,
                    ]}
                    onPress={() => setRole('captain')}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      role === 'captain' ? styles.roleButtonTextActive : null,
                    ]}>
                      Captain
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.roleButton,
                      role === 'maintenance' ? styles.roleButtonActive : null,
                    ]}
                    onPress={() => setRole('maintenance')}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      role === 'maintenance' ? styles.roleButtonTextActive : null,
                    ]}>
                      Maintenance
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
              
              <Animated.View {...animateItem(7)}>
                <TouchableOpacity 
                  style={styles.termsContainer} 
                  onPress={toggleAgreeToTerms}
                >
                  <View style={[
                    styles.checkbox,
                    agreeToTerms ? styles.checkboxChecked : null,
                  ]}>
                    {agreeToTerms && (
                      <View style={styles.checkboxInner} />
                    )}
                  </View>
                  <Text style={styles.termsText}>
                    I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              
              <Animated.View {...animateItem(8)}>
                <Button
                  title="Continue"
                  onPress={handleRegister}
                  loading={isLoading}
                  disabled={!name || !email || !password || !confirmPassword || !agreeToTerms}
                  fullWidth
                  style={styles.registerButton}
                />
              </Animated.View>
              
              <Animated.View {...animateItem(9)}>
                <Button
                  title="Register with QR Code"
                  onPress={handleQrCodeRegister}
                  variant="outline"
                  icon={<QrCode size={20} color={Colors.primary} />}
                  fullWidth
                  style={styles.qrButton}
                />
              </Animated.View>
              
              <Animated.View {...animateItem(10)} style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>or continue with</Text>
                <View style={styles.separatorLine} />
              </Animated.View>
              
              <Animated.View {...animateItem(11)}>
                <Button
                  title="Continue with Google"
                  onPress={() => handleSocialRegister('google')}
                  variant="outline"
                  icon={<GoogleIcon />}
                  fullWidth
                  style={styles.socialButton}
                />
              </Animated.View>
              
              <Animated.View {...animateItem(12)}>
                <Button
                  title="Continue with Apple"
                  onPress={() => handleSocialRegister('apple')}
                  variant="outline"
                  icon={<AppleIcon />}
                  fullWidth
                  style={styles.socialButton}
                />
              </Animated.View>
            </View>
            
            <Animated.View {...animateItem(13)} style={styles.footer}>
              <Text>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={styles.loginText}>Log In</Text>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  headerButton: {
    padding: 8,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  form: {
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: `${Colors.accent}20`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.accent,
    fontSize: 14,
    flex: 1,
  },
  dismissText: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: "600",
  },
  roleLabel: {
    marginBottom: 8,
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  roleButtonActive: {
    backgroundColor: Colors.background,
    borderColor: Colors.primary,
  },
  roleButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  roleButtonTextActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    marginRight: 8,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: Colors.primary,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  termsText: {
    fontSize: 14,
    flex: 1,
    color: Colors.textSecondary,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: "600",
  },
  registerButton: {
    marginBottom: 16,
  },
  qrButton: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    color: Colors.primary,
    fontWeight: "600",
    marginLeft: 4,
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
  socialButton: {
    marginBottom: 16,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.textSecondary,
  },
  separatorText: {
    marginHorizontal: 8,
    color: Colors.textSecondary,
    fontSize: 14,
  },
});