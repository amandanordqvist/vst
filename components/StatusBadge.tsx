import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '@/constants/theme';
import { Colors } from '@/constants/colors';

export type StatusType = 'success' | 'warning' | 'info';

interface StatusBadgeProps {
  status?: string;
  label?: string;
  type?: StatusType;
  showDot?: boolean;
  style?: any;
}

/**
 * StatusBadge Component
 * 
 * Used to display status indicators like "Underway", "At dock", "Maintenance due"
 * with appropriate color coding.
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = '',
  label,
  type = 'info',
  showDot = true,
  style,
}) => {
  // Map status to label if not provided
  const badgeLabel = label || mapStatusToLabel(status);
  
  // Map status to type if not explicitly set
  const badgeType = mapStatusToType(status, type);

  const containerStyles = [
    styles.container,
    badgeType === 'success' ? styles.successContainer :
    badgeType === 'warning' ? styles.warningContainer : styles.infoContainer,
    style,
  ];

  const textStyles = [
    styles.text,
    badgeType === 'success' ? styles.successText :
    badgeType === 'warning' ? styles.warningText : styles.infoText,
  ];

  const dotStyles = [
    styles.dot,
    badgeType === 'success' ? styles.successDot :
    badgeType === 'warning' ? styles.warningDot : styles.infoDot,
  ];

  return (
    <View style={containerStyles}>
      {showDot && <View style={dotStyles} />}
      <Text style={textStyles}>{badgeLabel}</Text>
    </View>
  );
};

// Helper function to map status to label
const mapStatusToLabel = (status: string): string => {
  switch (status) {
    case 'good':
      return 'Good';
    case 'warning':
      return 'Warning';
    case 'critical':
      return 'Critical';
    case 'neutral':
      return 'Neutral';
    case 'completed':
      return 'Completed';
    case 'in-progress':
      return 'In Progress';
    case 'pending':
      return 'Pending';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

// Helper function to map status to type
const mapStatusToType = (status: string, defaultType: StatusType): StatusType => {
  switch (status) {
    case 'good':
    case 'completed':
      return 'success';
    case 'warning':
    case 'in-progress':
      return 'warning';
    case 'critical':
      return 'warning';
    default:
      return defaultType;
  }
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.round,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.round,
    marginRight: theme.spacing.xs,
  },
  text: {
    fontSize: theme.fontSize.xs,
    fontWeight: '500',
  },
  // Success styles
  successContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: Colors.success,
  },
  successText: {
    color: Colors.success,
  },
  successDot: {
    backgroundColor: Colors.success,
  },
  // Warning styles
  warningContainer: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: '#F59E0B', // Amber
  },
  warningText: {
    color: '#F59E0B', // Amber
  },
  warningDot: {
    backgroundColor: '#F59E0B', // Amber
  },
  // Info styles
  infoContainer: {
    backgroundColor: 'rgba(112, 161, 255, 0.1)', // Lighter version of secondary color
    borderColor: Colors.secondary,
  },
  infoText: {
    color: Colors.secondary,
  },
  infoDot: {
    backgroundColor: Colors.secondary,
  },
});

export default StatusBadge;