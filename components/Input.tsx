import React, { ReactNode, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TextInputProps, 
  ViewStyle,
  Animated,
  Platform
} from 'react-native';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({ 
  label, 
  error, 
  containerStyle, 
  icon,
  rightIcon,
  onFocus,
  onBlur,
  ...props 
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedBorderColor = React.useRef(new Animated.Value(0)).current;
  
  // Handle focus and blur
  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(animatedBorderColor, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    
    if (onFocus) {
      onFocus(e);
    }
  };
  
  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.timing(animatedBorderColor, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    
    if (onBlur) {
      onBlur(e);
    }
  };
  
  // Interpolate border color
  const borderColor = animatedBorderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? colors.error : colors.border, colors.primary],
  });
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, isFocused && styles.focusedLabel]}>{label}</Text>}
      
      <Animated.View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
        isFocused && styles.inputFocused,
        { borderColor: error ? colors.error : (isFocused ? colors.primary : colors.border) },
        Platform.OS !== 'web' ? { borderColor } : null
      ]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon
          ]}
          placeholderTextColor={colors.textTertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={colors.primary}
          {...props}
        />
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </Animated.View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.textSecondary,
  },
  focusedLabel: {
    color: colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  iconContainer: {
    paddingHorizontal: 14,
  },
  rightIconContainer: {
    paddingHorizontal: 14,
  },
  input: {
    ...typography.body,
    flex: 1,
    height: 52,
    paddingHorizontal: 16,
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: 6,
  },
});