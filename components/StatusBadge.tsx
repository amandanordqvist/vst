import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, statusColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { Platform } from 'react-native';

export type StatusType = 'good' | 'warning' | 'critical' | 'neutral' | 'pending' | 'in-progress' | 'completed' | 'cancelled';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  style?: ViewStyle;
  animated?: boolean;
}

export function StatusBadge({ status, label, style, animated = true }: StatusBadgeProps) {
  // Default status to 'neutral' if undefined
  const safeStatus = status || 'neutral';
  
  // Map maintenance statuses to status colors
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'good':
        return statusColors.good;
      case 'warning':
        return statusColors.warning;
      case 'critical':
        return statusColors.critical;
      case 'neutral':
        return statusColors.neutral;
      case 'pending':
        return statusColors.warning;
      case 'in-progress':
        return statusColors.neutral;
      case 'completed':
        return statusColors.good;
      case 'cancelled':
        return colors.error;
      default:
        return statusColors.neutral;
    }
  };
  
  // Get default label based on status
  const getDefaultLabel = (status: StatusType) => {
    switch (status) {
      case 'good':
        return 'Good';
      case 'warning':
        return 'Warning';
      case 'critical':
        return 'Critical';
      case 'neutral':
        return 'Neutral';
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };
  
  const statusLabel = label || getDefaultLabel(safeStatus);
  const statusColor = getStatusColor(safeStatus);
  
  // Animation for critical status
  const pulseOpacity = useSharedValue(1);
  
  React.useEffect(() => {
    if (animated && (safeStatus === 'critical' || safeStatus === 'pending') && Platform.OS !== 'web') {
      pulseOpacity.value = withRepeat(
        withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [safeStatus, animated]);
  
  const animatedStyle = useAnimatedStyle(() => {
    if (safeStatus === 'critical' || safeStatus === 'pending') {
      return {
        opacity: pulseOpacity.value,
      };
    }
    return {};
  });
  
  // Use regular View for web or when animations are disabled
  if (Platform.OS === 'web' || !animated) {
    return (
      <View style={[
        styles.badge, 
        { backgroundColor: `${statusColor}20` },
        style
      ]}>
        <View style={[styles.dot, { backgroundColor: statusColor }]} />
        <Text style={[
          typography.captionMedium, 
          styles.text, 
          { color: statusColor }
        ]}>
          {statusLabel}
        </Text>
      </View>
    );
  }
  
  // Use Animated.View for native platforms
  return (
    <Animated.View style={[
      styles.badge, 
      { backgroundColor: `${statusColor}20` },
      style, 
      animatedStyle
    ]}>
      <View style={[styles.dot, { backgroundColor: statusColor }]} />
      <Text style={[
        typography.captionMedium, 
        styles.text, 
        { color: statusColor }
      ]}>
        {statusLabel}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontWeight: '600',
  },
});