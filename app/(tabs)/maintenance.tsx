import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import MaintenanceItem from '@/components/MaintenanceItem';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';
import { Plus, Filter } from 'lucide-react-native';
import { useMaintenanceStore } from '@/store/maintenance-store';

export default function MaintenanceScreen() {
  const router = useRouter();
  const { items, isLoading, fetchMaintenanceItems } = useMaintenanceStore();
  
  useEffect(() => {
    fetchMaintenanceItems();
  }, []);
  
  const handleItemPress = (id: string) => {
    selectItem(id);
    router.push('/maintenance-details');
  };
  
  const handleAddNew = () => {
    router.push('/new-maintenance');
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
  // Group items by status
  const pendingItems = items.filter(item => item.status === 'pending');
  const inProgressItems = items.filter(item => item.status === 'in-progress');
  const completedItems = items.filter(item => item.status === 'completed');
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.h2 as any}>Maintenance</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Button
            title="New Task"
            size="small"
            icon={<Plus size={16} color={Colors.white} />}
            onPress={handleAddNew}
          />
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <Card style={styles.summaryCard}>
          <Text style={typography.subtitle as any}>Maintenance Summary</Text>
          <View style={styles.summaryItems}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryCount}>{pendingItems.length}</Text>
              <Text style={styles.summaryLabel}>Pending</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryCount}>{inProgressItems.length}</Text>
              <Text style={styles.summaryLabel}>In Progress</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryCount}>{completedItems.length}</Text>
              <Text style={styles.summaryLabel}>Completed</Text>
            </View>
          </View>
        </Card>
        
        <Text style={[typography.h3 as TextStyle, styles.sectionTitle]}>Pending Tasks</Text>
        {pendingItems.length > 0 ? (
          pendingItems.map(item => (
            <MaintenanceItem
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              dueDate={item.dueDate}
              priority={item.priority}
              status={item.status}
              estimatedTime={item.estimatedTime}
              onPress={handleItemPress}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No pending tasks</Text>
        )}
        
        <Text style={[typography.h3 as TextStyle, styles.sectionTitle]}>In Progress</Text>
        {inProgressItems.length > 0 ? (
          inProgressItems.map(item => (
            <MaintenanceItem
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              dueDate={item.dueDate}
              priority={item.priority}
              status={item.status}
              estimatedTime={item.estimatedTime}
              onPress={handleItemPress}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No tasks in progress</Text>
        )}
        
        <Text style={styles.sectionTitle}>Recently Completed</Text>
        {completedItems.length > 0 ? (
          completedItems.slice(0, 3).map(item => (
            <MaintenanceItem
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              dueDate={item.dueDate}
              priority={item.priority}
              status={item.status}
              estimatedTime={item.estimatedTime}
              onPress={handleItemPress}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No completed tasks</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textSecondary,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryCount: {
    fontSize: 28, fontWeight: "700", lineHeight: 36, letterSpacing: -0.25,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: 16,
  },
});

function selectItem(id: string) {
  throw new Error('Function not implemented.');
}
