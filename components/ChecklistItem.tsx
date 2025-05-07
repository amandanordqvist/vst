import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import Card from './Card';
import StatusBadge from './StatusBadge';
import { typography } from '@/constants/typography';
import { colors, statusColors } from '@/constants/colors';
import { Camera, AlertTriangle, Check } from 'lucide-react-native';

export interface ChecklistItemProps {
  id: string;
  title: string;
  isCompleted: boolean;
  hasIssue: boolean;
  requiresPhoto: boolean;
  hasPhoto: boolean;
  onToggle?: (id: string, value: boolean) => void;
  onReportIssue?: (id: string) => void;
  onTakePhoto?: (id: string) => void;
  onPress?: (id: string) => void;
}

export default function ChecklistItem({
  id,
  title,
  isCompleted,
  hasIssue,
  requiresPhoto,
  hasPhoto,
  onToggle,
  onReportIssue,
  onTakePhoto,
  onPress,
}: ChecklistItemProps) {
  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={onPress ? 0.8 : 1}
      onPress={handlePress}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text 
              style={[
                typography.body, 
                isCompleted ? styles.completedText : null
              ]}
              numberOfLines={2}
            >
              {title}
            </Text>
            
            {hasIssue && (
              <StatusBadge 
                status="critical" 
                label="Issue Reported" 
                style={styles.issueBadge}
              />
            )}
          </View>
          
          <Switch
            value={isCompleted}
            onValueChange={(value) => onToggle && onToggle(id, value)}
            trackColor={{ false: colors.lightGray, true: colors.primaryLight }}
            thumbColor={isCompleted ? colors.primary : colors.gray}
          />
        </View>
        
        {(requiresPhoto || hasIssue) && (
          <View style={styles.actions}>
            {requiresPhoto && (
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  hasPhoto ? styles.actionButtonCompleted : null
                ]}
                onPress={() => onTakePhoto && onTakePhoto(id)}
              >
                <Camera size={16} color={hasPhoto ? statusColors.good : colors.text} />
                <Text style={styles.actionText}>
                  {hasPhoto ? 'Photo Added' : 'Add Photo'}
                </Text>
              </TouchableOpacity>
            )}
            
            {!hasIssue && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onReportIssue && onReportIssue(id)}
              >
                <AlertTriangle size={16} color={colors.text} />
                <Text style={styles.actionText}>Report Issue</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {isCompleted && !hasIssue && (
          <View style={styles.completedIndicator}>
            <Check size={16} color={statusColors.good} />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  completedText: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  issueBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  actionButtonCompleted: {
    backgroundColor: `${statusColors.good}20`,
  },
  actionText: {
    fontSize: 12, fontWeight: "400", lineHeight: 16, letterSpacing: 0.4,
    marginLeft: 4,
  },
  completedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
});