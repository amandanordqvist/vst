import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Colors } from '@/constants/colors';
import { Mail, ChevronLeft, Send } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const handleResetPassword = async () => {
    if (!email) {
      if (Platform.OS === 'web') {
        alert("Please enter your email address");
      } else {
        Alert.alert(
          "Email Required",
          "Please enter your email address to reset your password."
        );
      }
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      
      // Show success message
      if (Platform.OS === 'web') {
        alert(`Password reset instructions sent to ${email}`);
      } else {
        Alert.alert(
          "Reset Email Sent",
          `We've sent password reset instructions to ${email}. Please check your inbox.`,
          [
            { 
              text: "OK", 
              onPress: () => router.back() 
            }
          ]
        );
      }
    }, 2000);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Forgot Password',
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
            <View style={styles.header}>
              <Text style={styles.title}>Reset Your Password</Text>
              <Text style={styles.subtitle}>
                Enter your email address below and we'll send you instructions to reset your password.
              </Text>
            </View>
            
            <View style={styles.form}>
              <Input
                label="Email Address"
                placeholder="Enter your email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Mail size={20} color={Colors.textSecondary} />}
              />
              
              <Button
                title={isSent ? "Resend Email" : "Reset Password"}
                onPress={handleResetPassword}
                loading={isLoading}
                fullWidth
                icon={<Send size={20} color={Colors.white} />}
                style={styles.resetButton}
              />
              
              <TouchableOpacity 
                style={styles.backToLoginButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backToLoginText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.info}>
              <Text style={styles.infoText}>
                If you don't receive an email within a few minutes, please check your spam folder or try again.
              </Text>
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
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
  },
  resetButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  backToLoginButton: {
    alignItems: 'center',
    padding: 12,
  },
  backToLoginText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "500",
  },
  info: {
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: Colors.primary,
    lineHeight: 20,
  },
}); 