import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  Platform
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/Button';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronLeft,
  Wrench,
  Trash2,
  Edit3,
  Image as ImageIcon,
  FileText
} from 'lucide-react-native';
import { useMaintenanceStore } from '@/store/maintenance-store';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';

// Animated section component for staggered animations
const AnimatedSection = ({ 
  children, 
  index = 0, 
  style 
}: { 
  children: React.ReactNode, 
  index?: number, 
  style?: any 
}) => {
  if (Platform.OS === 'web') {
    return <View style={style}>{children}</View>;
  }
  
  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).duration(600).springify()} 
      style={style}
    >
      {children}
    </Animated.View>
  );
};

export default function MaintenanceDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, updateItemStatus, deleteMaintenanceItem } = useMaintenanceStore();
  
  // Find the maintenance item by id
  const item = items.find(item => item.id === id);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{
            title: "Maintenance Details",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <ChevronLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.notFoundContainer}>
          <Text style={typography.h2}>Item Not Found</Text>
          <Text style={[typography.body, styles.notFoundText]}>
            The maintenance item you're looking for doesn't exist or has been removed.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.goBackButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateItemStatus(item.id, newStatus);
      Alert.alert("Success", "Maintenance status updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update maintenance status");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Maintenance Item",
      "Are you sure you want to delete this maintenance item? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteMaintenanceItem(item.id);
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to delete maintenance item");
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return colors.error;
      case 'high':
        return colors.warning;
      case 'medium':
        return colors.accent;
      case 'low':
        return colors.success;
      default:
        return colors.gray;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={20} color={colors.success} />;
      case 'in-progress':
        return <Clock size={20} color={colors.accent} />;
      case 'pending':
        return <AlertTriangle size={20} color={colors.warning} />;
      case 'cancelled':
        return <XCircle size={20} color={colors.error} />;
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Maintenance Details",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push(`/edit-maintenance?id=${item.id}`)}
              >
                <Edit3 size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <AnimatedSection index={0}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={typography.h2}>{item.title}</Text>
              <StatusBadge status={item.status} />
            </View>
            
            <Text style={[typography.body, styles.description]}>
              {item.description}
            </Text>
          </View>
        </AnimatedSection>
        
        <AnimatedSection index={1}>
          <Card style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Calendar size={18} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Due Date</Text>
                  <Text style={styles.detailValue}>{item.dueDate}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Clock size={18} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Estimated Time</Text>
                  <Text style={styles.detailValue}>{item.estimatedTime}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <View style={[styles.detailIcon, { backgroundColor: getPriorityColor(item.priority) + '15' }]}>
                  <AlertTriangle size={18} color={getPriorityColor(item.priority)} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Priority</Text>
                  <Text style={[styles.detailValue, { color: getPriorityColor(item.priority) }]}>
                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Wrench size={18} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{item.category || 'General'}</Text>
                </View>
              </View>
            </View>
          </Card>
        </AnimatedSection>
        
        {item.instructions && item.instructions.length > 0 && (
          <AnimatedSection index={2}>
            <View style={styles.sectionHeader}>
              <FileText size={20} color={colors.text} />
              <Text style={typography.h3}>Instructions</Text>
            </View>
            
            <Card style={styles.instructionsCard}>
              {item.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </Card>
          </AnimatedSection>
        )}
        
        {item.images && item.images.length > 0 && (
          <AnimatedSection index={3}>
            <View style={styles.sectionHeader}>
              <ImageIcon size={20} color={colors.text} />
              <Text style={typography.h3}>Images</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
              {item.images.map((image, index) => (
                <TouchableOpacity key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: image }} style={styles.image} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </AnimatedSection>
        )}
        
        <AnimatedSection index={4} style={styles.actionsContainer}>
          <Text style={[typography.subtitle, styles.actionsTitle]}>Update Status</Text>
          
          <View style={styles.statusButtons}>
            <Button
              title="Mark as Pending"
              onPress={() => handleStatusChange('pending')}
              variant={item.status === 'pending' ? 'primary' : 'outline'}
              size="small"
              style={styles.statusButton}
              loading={isUpdating && item.status !== 'pending'}
              disabled={item.status === 'pending'}
            />
            
            <Button
              title="In Progress"
              onPress={() => handleStatusChange('in-progress')}
              variant={item.status === 'in-progress' ? 'primary' : 'outline'}
              size="small"
              style={styles.statusButton}
              loading={isUpdating && item.status !== 'in-progress'}
              disabled={item.status === 'in-progress'}
            />
            
            <Button
              title="Completed"
              onPress={() => handleStatusChange('completed')}
              variant={item.status === 'completed' ? 'primary' : 'outline'}
              size="small"
              style={styles.statusButton}
              loading={isUpdating && item.status !== 'completed'}
              disabled={item.status === 'completed'}
            />
            
            <Button
              title="Cancel Task"
              onPress={() => handleStatusChange('cancelled')}
              variant={item.status === 'cancelled' ? 'danger' : 'ghost'}
              size="small"
              style={styles.statusButton}
              loading={isUpdating && item.status !== 'cancelled'}
              disabled={item.status === 'cancelled'}
            />
          </View>
        </AnimatedSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  description: {
    color: colors.textSecondary,
  },
  detailsCard: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  instructionsCard: {
    marginBottom: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.primary,
  },
  instructionText: {
    ...typography.body,
    flex: 1,
  },
  imagesContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  imageWrapper: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: 160,
    height: 120,
    borderRadius: 12,
  },
  actionsContainer: {
    marginTop: 8,
  },
  actionsTitle: {
    marginBottom: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusButton: {
    width: '48%',
    marginBottom: 12,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
    color: colors.textSecondary,
  },
  goBackButton: {
    width: 200,
  },
});