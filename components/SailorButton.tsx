import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  View
} from 'react-native';
import theme from '@/constants/theme';
import { Colors } from '@/constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface SailorButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  label: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const SailorButton: React.FC<SailorButtonProps> = ({ 
  variant = 'primary',
  label, 
  isLoading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  ...props 
}) => {
  const buttonStyles = [
    styles.button,
    variant === 'primary' ? styles.primaryButton : 
    variant === 'secondary' ? styles.secondaryButton : styles.ghostButton,
    disabled && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    variant === 'primary' ? styles.primaryText : 
    variant === 'secondary' ? styles.secondaryText : styles.ghostText,
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity 
      style={buttonStyles} 
      disabled={isLoading || disabled}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'ghost' ? Colors.secondary : Colors.background} 
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={textStyles}>{label}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    ...theme.shadow.sm,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
    ...theme.shadow.sm,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: theme.fontSize.md,
    fontWeight: '500',
  },
  primaryText: {
    color: Colors.background,
  },
  secondaryText: {
    color: Colors.background,
  },
  ghostText: {
    color: Colors.secondary,
  },
  disabledText: {
    opacity: 0.7,
  },
  iconLeft: {
    marginRight: theme.spacing.xs,
  },
  iconRight: {
    marginLeft: theme.spacing.xs,
  },
});

export default SailorButton; 