import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import { Platform } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'flat' | 'elevated';
  onPress?: () => void;
  animated?: boolean;
}

export function Card({ 
  children, 
  style, 
  variant = 'default', 
  onPress,
  animated = true
}: CardProps) {
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  // Define animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });
  
  // Handle press animation
  const handlePressIn = () => {
    if (animated && onPress) {
      scale.value = withTiming(0.98, { duration: 150 });
      opacity.value = withTiming(0.95, { duration: 150 });
    }
  };
  
  const handlePressOut = () => {
    if (animated && onPress) {
      scale.value = withTiming(1, { duration: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    }
  };
  
  // Get variant styles
  const getVariantStyle = () => {
    switch (variant) {
      case 'flat':
        return styles.flat;
      case 'elevated':
        return styles.elevated;
      default:
        return styles.default;
    }
  };
  
  // Conditionally use Animated.View for web compatibility
  if (Platform.OS === 'web' || !animated) {
    return (
      <View 
        style={[styles.card, getVariantStyle(), style]}
      >
        {children}
      </View>
    );
  }
  
  // Use Animated.View with press handlers for native platforms
  if (onPress) {
    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Animated.View style={[styles.card, getVariantStyle(), style, animatedStyle]}>
          {children}
        </Animated.View>
      </Pressable>
    );
  }
  
  // Use Animated.View without press handlers
  return (
    <Animated.View style={[styles.card, getVariantStyle(), style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: colors.white,
    marginVertical: 10,
  },
  default: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  flat: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
});