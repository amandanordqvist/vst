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
  Platform,
  TouchableOpacityProps
} from 'react-native';
import { Colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay
} from 'react-native-reanimated';
import theme from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger' | 'ghost';
type ButtonSize = 'large' | 'medium' | 'small';

interface ButtonProps extends TouchableOpacityProps {
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

const Button: React.FC<ButtonProps> = ({
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
  ...props
}) => {
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
    styles[`${variant}Button`],
    disabled && styles.disabledButton,
    fullWidth && styles.fullWidth,
    style,
  ];

  const textStyles = [
    styles.text,
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
          color={variant === 'primary' || variant === 'secondary' || variant === 'accent' || variant === 'danger' ? Colors.white : Colors.primary} 
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
        {...props}
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
};

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
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  accentButton: {
    backgroundColor: Colors.accent,
  },
  dangerButton: {
    backgroundColor: Colors.error,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghostButton: {
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
  disabledButton: {
    backgroundColor: Colors.gray,
    borderColor: Colors.gray,
  },
  disabledText: {
    color: Colors.gray,
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.white,
  },
  accentText: {
    color: Colors.white,
  },
  dangerText: {
    color: Colors.white,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primary,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontSize: theme.fontSize.md,
    fontWeight: "500",
  },
});

export default Button;