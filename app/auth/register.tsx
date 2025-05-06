import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { Mail, Lock, Eye, EyeOff, User, ChevronLeft } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
      await register(name, email, password);
      // If registration is successful, navigate to the main app
      router.replace('/tabs');
    } catch (err) {
      console.error("Registration error:", err);
      // Error is already handled by the auth store
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleAgreeToTerms = () => {
    setAgreeToTerms(!agreeToTerms);
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
              <ChevronLeft size={24} color={colors.text} />
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
            <View style={styles.header}>
              <Text style={typography.h2}>Join VST Boat Management</Text>
              <Text style={[typography.body, styles.subtitle]}>
                Create an account to get started
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
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                leftIcon={<User size={20} color={colors.gray} />}
              />
              
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={20} color={colors.gray} />}
              />
              
              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                leftIcon={<Lock size={20} color={colors.gray} />}
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
              
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                leftIcon={<Lock size={20} color={colors.gray} />}
              />
              
              <Text style={[typography.bodySmall, styles.roleLabel]}>Select your role</Text>
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
              
              <Button
                title="Create Account"
                onPress={handleRegister}
                loading={isLoading}
                disabled={!name || !email || !password || !confirmPassword || !agreeToTerms}
                fullWidth
                style={styles.registerButton}
              />
            </View>
            
            <View style={styles.footer}>
              <Text style={typography.body}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={styles.loginText}>Log In</Text>
              </TouchableOpacity>
            </View>
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
  },
  headerButton: {
    padding: 8,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 8,
  },
  form: {
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: `${colors.error}20`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  roleLabel: {
    marginBottom: 8,
    color: colors.textSecondary,
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
    borderColor: colors.border,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  roleButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  roleButtonText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  roleButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
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
    borderColor: colors.gray,
    marginRight: 8,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: colors.primary,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  termsText: {
    ...typography.bodySmall,
    flex: 1,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  registerButton: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
});