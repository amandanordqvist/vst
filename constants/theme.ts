import { Colors } from './colors';

// Define FontWeight type based on React Native's TextStyle
export type FontWeight = 
  | 'normal' 
  | 'bold' 
  | '100' 
  | '200' 
  | '300' 
  | '400' 
  | '500' 
  | '600' 
  | '700' 
  | '800' 
  | '900';

/**
 * Sailor Luxe Theme
 * 
 * A premium nautical design system for vessel/yacht crew applications.
 * Modern, clean, and professional with a focus on readability and usability
 * in dynamic maritime environments.
 */

// Spacing system (for margins, padding, etc.)
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius values
export const radius = {
  sm: 8,
  md: 12, 
  lg: 16, // Standard for cards & fields
  xl: 24,
  round: 999, // For circular elements
};

// Font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16, // Base body text
  lg: 18, 
  xl: 20, // Small headings
  xxl: 24, // Main headings
  xxxl: 32, // Hero text
};

// Line heights
export const lineHeight = {
  tight: 1.2,
  base: 1.5,
  relaxed: 1.75,
};

// Font weights
export const fontWeight: { [key: string]: FontWeight } = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Font families
// Note: These need to be loaded using expo-font and linked in your app
export const fontFamily = {
  heading: 'Satoshi', // Fallback: 'System'
  body: 'Inter', // Fallback: 'System'
};

// Shadow intensities
export const shadow = {
  sm: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },
};

// Animation timings and easing
export const animation = {
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    // Define easing functions if needed
    // These would be compatible with React Native's Animated API
  },
};

// Core Typography Styles
export const typography = {
  h1: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xxxl,
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
    color: Colors.textPrimary,
  },
  h2: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xxl,
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
    color: Colors.textPrimary,
  },
  h3: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.semibold,
    color: Colors.textPrimary,
  },
  body: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    lineHeight: lineHeight.base,
    fontWeight: fontWeight.normal,
    color: Colors.textPrimary,
  },
  bodySmall: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.base,
    fontWeight: fontWeight.normal,
    color: Colors.textSecondary,
  },
  label: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.medium,
    color: Colors.textSecondary,
  },
};

// Component Styles
export const components = {
  // Button styles
  button: {
    // Primary button (solid background, white text)
    primary: {
      backgroundColor: Colors.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadow.sm,
    },
    primaryText: {
      color: Colors.background,
      fontFamily: fontFamily.body,
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
    },
    
    // Secondary button (marine blue)
    secondary: {
      backgroundColor: Colors.secondary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadow.sm,
    },
    secondaryText: {
      color: Colors.background,
      fontFamily: fontFamily.body,
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
    },
    
    // Ghost button (transparent with border)
    ghost: {
      backgroundColor: 'transparent',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: Colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ghostText: {
      color: Colors.secondary,
      fontFamily: fontFamily.body,
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
    },
    
    // Disabled state
    disabled: {
      opacity: 0.5,
    },
  },
  
  // Card styles
  card: {
    container: {
      backgroundColor: Colors.background,
      borderRadius: radius.lg,
      padding: spacing.lg,
      ...shadow.md,
    },
    title: {
      ...typography.h3,
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.bodySmall,
      marginBottom: spacing.md,
    },
    content: {
      ...typography.body,
    },
  },
  
  // Input field styles
  input: {
    container: {
      marginBottom: spacing.md,
    },
    label: {
      ...typography.label,
      marginBottom: spacing.xs,
    },
    field: {
      backgroundColor: Colors.background,
      borderWidth: 1,
      borderColor: 'rgba(203, 213, 225, 0.5)', // Subtle border
      borderRadius: radius.lg,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      fontSize: fontSize.md,
      color: Colors.textPrimary,
    },
    focusedField: {
      borderColor: Colors.secondary,
    },
    errorField: {
      borderColor: '#E53E3E', // Red for errors
    },
    errorText: {
      ...typography.bodySmall,
      color: '#E53E3E',
      marginTop: spacing.xs,
    },
    helperText: {
      ...typography.bodySmall,
      marginTop: spacing.xs,
    },
  },
  
  // Status badge styles
  badge: {
    container: {
      paddingVertical: spacing.xxs,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.round,
      alignSelf: 'flex-start',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: radius.round,
      marginRight: spacing.xs,
    },
    text: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
    },
    // Status variations
    success: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)', // Light green background
      borderColor: Colors.success,
      borderWidth: 1,
    },
    successText: {
      color: Colors.success,
    },
    successDot: {
      backgroundColor: Colors.success,
    },
    warning: {
      backgroundColor: 'rgba(245, 158, 11, 0.1)', // Light amber background
      borderColor: '#F59E0B', // Amber
      borderWidth: 1,
    },
    warningText: {
      color: '#F59E0B', // Amber
    },
    warningDot: {
      backgroundColor: '#F59E0B', // Amber
    },
    info: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)', // Light blue background
      borderColor: Colors.secondary,
      borderWidth: 1,
    },
    infoText: {
      color: Colors.secondary,
    },
    infoDot: {
      backgroundColor: Colors.secondary,
    },
  },
  
  // Tab bar styling
  tabBar: {
    container: {
      backgroundColor: Colors.background,
      borderTopWidth: 1,
      borderTopColor: 'rgba(203, 213, 225, 0.3)', // Very subtle border
      height: 60,
      paddingBottom: spacing.xs, // Add some padding at the bottom
      ...shadow.sm,
    },
    tab: {
      paddingVertical: spacing.xs,
    },
    label: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      marginTop: spacing.xxs,
    },
    icon: {
      size: 24,
    },
    activeColor: Colors.secondary,
    inactiveColor: Colors.textSecondary,
  },
};

// Export the complete theme
const sailorLuxeTheme = {
  Colors,
  spacing,
  radius,
  fontSize,
  lineHeight,
  fontWeight,
  fontFamily,
  shadow,
  animation,
  typography,
  components,
};

export default sailorLuxeTheme; 