import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { StatusBadge } from './StatusBadge';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { Calendar, Clock } from 'lucide-react-native';

export interface MaintenanceItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'good' | 'warning' | 'critical' | 'neutral';
  status: 'pending' | 'in-progress' | 'completed';
  estimatedTime?: string;
}

export interface MaintenanceItemProps {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'good' | 'warning' | 'critical' | 'neutral';
  status: 'pending' | 'in-progress' | 'completed';
  estimatedTime?: string;
  onPress: (id: string) => void;
}

export function MaintenanceItem({
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
    'pending': { label: 'Pending', status: 'neutral' as const },
    'in-progress': { label: 'In Progress', status: 'warning' as const },
    'completed': { label: 'Completed', status: 'good' as const },
  };

  // Safely capitalize the priority label
  const priorityLabel = priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Unknown';

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={() => onPress(id)}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={typography.h4}>{title}</Text>
          <StatusBadge 
            status={priority} 
            label={priorityLabel} 
          />
        </View>
        
        <Text style={[typography.bodySmall, styles.description]} numberOfLines={2}>
          {description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.infoItem}>
            <Calendar size={16} color={colors.gray} />
            <Text style={[typography.bodySmall, styles.infoText]}>{dueDate}</Text>
          </View>
          
          {estimatedTime && (
            <View style={styles.infoItem}>
              <Clock size={16} color={colors.gray} />
              <Text style={[typography.bodySmall, styles.infoText]}>{estimatedTime}</Text>
            </View>
          )}
          
          <StatusBadge 
            status={statusMap[status].status} 
            label={statusMap[status].label} 
            style={styles.statusBadge}
          />
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