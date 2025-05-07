import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  withDelay
} from 'react-native-reanimated';
import { Platform } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  progressColor?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
  animated?: boolean;
  animationDelay?: number;
}

export default function ProgressBar({
  progress,
  progressColor = Colors.primary,
  backgroundColor = Colors.gray,
  height = 8,
  style,
  animated = true,
  animationDelay = 300,
}: ProgressBarProps) {
  // Clamp progress between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  
  // Animation value
  const widthProgress = useSharedValue(0);
  
  // Update animation when progress changes
  useEffect(() => {
    if (animated && Platform.OS !== 'web') {
      widthProgress.value = withDelay(
        animationDelay,
        withTiming(clampedProgress, {
          duration: 800,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      );
    } else {
      widthProgress.value = clampedProgress;
    }
  }, [clampedProgress, animated]);
  
  // Animated style for progress bar
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${widthProgress.value * 100}%`,
    };
  });
  
  // For web or when animations are disabled
  if (Platform.OS === 'web' || !animated) {
    return (
      <View style={[styles.container, { height }, style]}>
        <View
          style={[
            styles.background,
            { backgroundColor, borderRadius: height / 2 },
          ]}
        >
          <View
            style={[
              styles.progress,
              {
                backgroundColor: progressColor,
                width: `${clampedProgress * 100}%`,
                borderRadius: height / 2,
              },
            ]}
          />
        </View>
      </View>
    );
  }
  
  // For native platforms with animations
  return (
    <View style={[styles.container, { height }, style]}>
      <View
        style={[
          styles.background,
          { backgroundColor, borderRadius: height / 2 },
        ]}
      >
        <Animated.View
          style={[
            styles.progress,
            {
              backgroundColor: progressColor,
              borderRadius: height / 2,
            },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  background: {
    flex: 1,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});