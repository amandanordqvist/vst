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
import { Colors } from '@/constants/colors';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Input({ 
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
    outputRange: [error ? Colors.error : Colors.border, Colors.primary],
  });
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, isFocused && styles.focusedLabel]}>{label}</Text>}
      
      <Animated.View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
        isFocused && styles.inputFocused,
        { borderColor: error ? Colors.error : (isFocused ? Colors.primary : Colors.border) },
        Platform.OS !== 'web' ? { borderColor } : null
      ]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            icon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null
          ]}
          placeholderTextColor={Colors.textPrimaryPrimaryPrimarySecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={Colors.primary}
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
    fontSize: 16, 
    fontWeight: '600',
    lineHeight: 24, 
    letterSpacing: 0.15,
    marginBottom: 8,
    color: Colors.textPrimaryPrimaryPrimarySecondary,
  },
  focusedLabel: {
    color: Colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.background,
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
    fontSize: 16, 
    fontWeight: "400", 
    lineHeight: 24, 
    letterSpacing: 0.15,
    flex: 1,
    height: 52,
    paddingHorizontal: 16,
    color: Colors.textPrimaryPrimaryPrimaryPrimary,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: 12, fontWeight: "400", lineHeight: 16, letterSpacing: 0.4,
    color: Colors.error,
    marginTop: 6,
  },
});