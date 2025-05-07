import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import theme from '@/constants/theme';
import { Colors } from '@/constants/colors';

interface SailorCardProps extends ViewProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  status?: React.ReactNode;
}

/**
 * A premium card component for the Sailor Luxe Theme
 * 
 * Features:
 * - Clean, rounded design with subtle shadow
 * - Optional title and subtitle
 * - Optional status indicator (like StatusBadge) in top right
 * - Custom content as children
 */
const SailorCard: React.FC<SailorCardProps> = ({
  title,
  subtitle,
  children,
  status,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]} {...props}>
      {(title || status) && (
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {status && <View style={styles.statusContainer}>{status}</View>}
        </View>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.md,
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: theme.spacing.xxs,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: Colors.textSecondary,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  content: {
    // Space for card content
  },
});

export default SailorCard; 