import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  Pressable,
  Platform
} from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay
} from 'react-native-reanimated';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger';
type ButtonSize = 'large' | 'medium' | 'small';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  animated?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
  animated = true,
}: ButtonProps) {
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
    if (animated && !disabled && !loading) {
      scale.value = withTiming(0.96, { duration: 100 });
      opacity.value = withTiming(0.9, { duration: 100 });
    }
  };
  
  const handlePressOut = () => {
    if (animated && !disabled && !loading) {
      scale.value = withTiming(1, { duration: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    }
  };
  
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    style,
  ];

  const textStyles = [
    typography.button,
    styles[`${variant}Text`],
    size === 'small' && typography.buttonSmall,
    disabled && styles.disabledText,
    textStyle,
  ];
  
  const handleButtonPress = () => {
    console.log("Button pressed:", title);
    if (!disabled && !loading) {
      onPress();
    }
  };
  
  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' || variant === 'secondary' || variant === 'accent' || variant === 'danger' ? colors.white : colors.primary} 
          size="small" 
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </>
  );
  
  // Use regular TouchableOpacity for web or when animations are disabled
  if (Platform.OS === 'web' || !animated) {
    return (
      <TouchableOpacity
        style={buttonStyles}
        onPress={handleButtonPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }
  
  // Use Animated.View with Pressable for native platforms
  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleButtonPress}
      disabled={disabled || loading}
    >
      <Animated.View style={[buttonStyles, animatedStyle]}>
        {renderContent()}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  accent: {
    backgroundColor: colors.accent,
  },
  danger: {
    backgroundColor: colors.error,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  small: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  disabled: {
    backgroundColor: colors.lightGray,
    borderColor: colors.lightGray,
  },
  disabledText: {
    color: colors.gray,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  accentText: {
    color: colors.white,
  },
  dangerText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  fullWidth: {
    width: '100%',
  },
});