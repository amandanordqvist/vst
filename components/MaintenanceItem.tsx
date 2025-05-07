import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextStyle } from 'react-native';
import Card from './Card';
import StatusBadge from './StatusBadge';
import { typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';
import { Calendar, Clock } from 'lucide-react-native';

// Local typography styles with correct fontWeight casting
const localTypography = {
  h4: {
    // Assuming h4 is similar to h3 or a defined style in your global theme
    // If typography.h4 is globally defined and typed, this might not be needed
    // For now, let's assume it needs casting like others if used directly from global theme.ts
    // If it's not in global theme.ts, you'd define its properties here.
    // This example assumes typography.h4 exists in the global theme.ts
    fontSize: typography.h3?.fontSize || 18, // Fallback if h4 undefined
    fontWeight: (typography.h3?.fontWeight || '600') as TextStyle['fontWeight'], 
    color: typography.h3?.color || Colors.textPrimary,
  },
  bodySmall: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.bodySmall.fontWeight as TextStyle['fontWeight'],
    color: typography.bodySmall.color,
  }
};

// This interface should align with the one in the store
export interface MaintenanceItemTypeFromStore {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  estimatedTime?: string;
  // category?: string; // Add if needed from store
  // instructions?: string[]; // Add if needed from store
  // images?: string[]; // Add if needed from store
}

export interface MaintenanceItemProps extends MaintenanceItemTypeFromStore {
  onPress: (id: string) => void;
}

export default function MaintenanceItem({
  id,
  title,
  description,
  dueDate,
  priority,
  status,
  estimatedTime,
  onPress,
}: MaintenanceItemProps) {
  const statusMap = {
    'pending': { label: 'Pending', type: 'info' as const },
    'in-progress': { label: 'In Progress', type: 'warning' as const },
    'completed': { label: 'Completed', type: 'success' as const },
    'cancelled': { label: 'Cancelled', type: 'info' as const },
  };

  const priorityTypeMap = {
    'critical': 'warning' as const, // Or 'error' if you have an error StatusType
    'high': 'warning' as const,
    'medium': 'info' as const,
    'low': 'info' as const,
  };

  const priorityLabel = priority.charAt(0).toUpperCase() + priority.slice(1);
  const actualStatusDetails = statusMap[status];

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={() => onPress(id)}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={localTypography.h4}>{title}</Text>
          <StatusBadge 
            type={priorityTypeMap[priority]} 
            label={priorityLabel} 
          />
        </View>
        
        <Text style={[localTypography.bodySmall, styles.description]} numberOfLines={2}>
          {description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.infoItem}>
            <Calendar size={16} color={Colors.gray} />
            <Text style={[localTypography.bodySmall, styles.infoText]}>{dueDate}</Text>
          </View>
          
          {estimatedTime && (
            <View style={styles.infoItem}>
              <Clock size={16} color={Colors.gray} />
              <Text style={[localTypography.bodySmall, styles.infoText]}>{estimatedTime}</Text>
            </View>
          )}
          
          {actualStatusDetails && (
            <StatusBadge 
              type={actualStatusDetails.type} 
              label={actualStatusDetails.label} 
              style={styles.statusBadge}
            />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 4,
  },
  statusBadge: {
    marginLeft: 'auto',
  },
});