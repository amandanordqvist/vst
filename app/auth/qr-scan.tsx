import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { ChevronLeft, Scan } from 'lucide-react-native';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const scannerSize = width * 0.7;

export default function QrScanScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  // Animation values for the scanning effect
  const scanLinePosition = useSharedValue(0);
  const scannerOpacity = useSharedValue(0.7);
  
  // Initialize animations
  useEffect(() => {
    // Simulate permission request
    const timer = setTimeout(() => {
      setHasPermission(true);
    }, 1000);
    
    // Animate the scan line to move up and down
    scanLinePosition.value = withRepeat(
      withSequence(
        withTiming(scannerSize, { duration: 2000, easing: Easing.linear }),
        withTiming(0, { duration: 2000, easing: Easing.linear })
      ),
      -1, // -1 for infinite repeat
      false // No reverse
    );
    
    // Pulse animation for the scanner frame
    scannerOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.7, { duration: 1000 })
      ),
      -1,
      true
    );
    
    return () => clearTimeout(timer);
  }, []);
  
  // Define animated styles
  const scanLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scanLinePosition.value }],
    };
  });
  
  const scannerFrameStyle = useAnimatedStyle(() => {
    return {
      opacity: scannerOpacity.value,
    };
  });
  
  const handleManualEntry = () => {
    router.push('/auth/register');
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Scan QR Code',
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
        <View style={styles.cameraContainer}>
          {/* Simulated camera view */}
          <View style={styles.cameraView}>
            {/* Scanner frame */}
            <Animated.View style={[styles.scannerFrame, scannerFrameStyle]}>
              {/* Scanner line */}
              <Animated.View style={[styles.scanLine, scanLineStyle]} />
            </Animated.View>
            
            {/* Scan icon overlay */}
            <View style={styles.scanIconContainer}>
              <Scan size={50} color={Colors.primary} style={styles.scanIcon} />
            </View>
          </View>
        </View>
        
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Scan the QR code on your vessel</Text>
          <Text style={styles.instructionsText}>
            Position the QR code in the center of the frame and hold steady
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.manualEntryButton} 
          onPress={handleManualEntry}
        >
          <Text style={styles.manualEntryText}>No QR code? Enter details manually</Text>
        </TouchableOpacity>
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
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  cameraView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: scannerSize,
    height: scannerSize,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  scanLine: {
    height: 2,
    width: '100%',
    backgroundColor: Colors.primary,
    position: 'absolute',
    left: 0,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 5,
  },
  scanIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 70,
    height: 70,
    marginLeft: -35,
    marginTop: -35,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.2,
  },
  scanIcon: {
    opacity: 0.5,
  },
  instructionsContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  manualEntryButton: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  manualEntryText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "500",
  },
}); 