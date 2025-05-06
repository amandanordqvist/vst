import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { ChecklistItem } from '@/components/ChecklistItem';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { Plus, Filter, CheckCircle, AlertTriangle } from 'lucide-react-native';
import { useChecklistStore } from '@/store/checklist-store';
import { useVesselStore } from '@/store/vessel-store';

export default function ChecklistsScreen() {
  const router = useRouter();
  const { checklists, isLoading, fetchChecklists, setCurrentType } = useChecklistStore();
  const { vessels } = useVesselStore();
  
  const [activeTab, setActiveTab] = useState<'preDeparture' | 'postTrip'>('preDeparture');
  
  useEffect(() => {
    fetchChecklists();
  }, []);
  
  const handleItemPress = (id: string) => {
    setCurrentType(activeTab);
    router.push(`/checklist-details?id=${id}&type=${activeTab}`);
  };
  
  const handleCreateChecklist = () => {
    // In a real app, this would create a new checklist
    // For now, we'll just navigate to an existing one
    if (checklists[activeTab].length > 0) {
      setCurrentType(activeTab);
      router.push(`/checklist-details?id=${checklists[activeTab][0].id}&type=${activeTab}`);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  // Calculate completion percentage
  const getCompletionPercentage = (type: 'preDeparture' | 'postTrip') => {
    const items = checklists[type];
    if (items.length === 0) return 0;
    
    const completedCount = items.filter(item => item.isCompleted).length;
    return completedCount / items.length;
  };
  
  const preDepartureCompletion = getCompletionPercentage('preDeparture');
  const postTripCompletion = getCompletionPercentage('postTrip');
  
  // Get issues count
  const getIssuesCount = (type: 'preDeparture' | 'postTrip') => {
    return checklists[type].filter(item => item.hasIssue).length;
  };
  
  const preDepartureIssues = getIssuesCount('preDeparture');
  const postTripIssues = getIssuesCount('postTrip');
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.h2}>Checklists</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={colors.text} />
          </TouchableOpacity>
          <Button
            title="New Checklist"
            size="small"
            icon={<Plus size={16} color={colors.white} />}
            onPress={handleCreateChecklist}
          />
        </View>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'preDeparture' && styles.activeTab]}
          onPress={() => setActiveTab('preDeparture')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'preDeparture' && styles.activeTabText
          ]}>
            Pre-Departure
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'postTrip' && styles.activeTab]}
          onPress={() => setActiveTab('postTrip')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'postTrip' && styles.activeTabText
          ]}>
            Post-Trip
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={typography.subtitle}>
              {activeTab === 'preDeparture' ? 'Pre-Departure Checklist' : 'Post-Trip Checklist'}
            </Text>
            {vessels.length > 0 && (
              <Text style={typography.bodySmall}>
                Vessel: {vessels[0].name}
              </Text>
            )}
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Completion</Text>
              <Text style={styles.progressPercentage}>
                {Math.round((activeTab === 'preDeparture' ? preDepartureCompletion : postTripCompletion) * 100)}%
              </Text>
            </View>
            <ProgressBar 
              progress={activeTab === 'preDeparture' ? preDepartureCompletion : postTripCompletion}
              progressColor={colors.primary}
              height={8}
            />
          </View>
          
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.primaryLight }]}>
                <CheckCircle size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.statValue}>
                  {activeTab === 'preDeparture' 
                    ? checklists.preDeparture.filter(item => item.isCompleted).length
                    : checklists.postTrip.filter(item => item.isCompleted).length
                  } / {activeTab === 'preDeparture' ? checklists.preDeparture.length : checklists.postTrip.length}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: `${colors.error}20` }]}>
                <AlertTriangle size={20} color={colors.error} />
              </View>
              <View>
                <Text style={styles.statValue}>
                  {activeTab === 'preDeparture' ? preDepartureIssues : postTripIssues}
                </Text>
                <Text style={styles.statLabel}>Issues</Text>
              </View>
            </View>
          </View>
        </Card>
        
        <Text style={[typography.h3, styles.sectionTitle]}>Checklist Items</Text>
        
        {activeTab === 'preDeparture' ? (
          checklists.preDeparture.length > 0 ? (
            checklists.preDeparture.map(item => (
              <ChecklistItem
                key={item.id}
                id={item.id}
                title={item.title}
                isCompleted={item.isCompleted}
                hasIssue={item.hasIssue}
                requiresPhoto={item.requiresPhoto}
                hasPhoto={item.hasPhoto}
                onPress={handleItemPress}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No pre-departure checklist items</Text>
          )
        ) : (
          checklists.postTrip.length > 0 ? (
            checklists.postTrip.map(item => (
              <ChecklistItem
                key={item.id}
                id={item.id}
                title={item.title}
                isCompleted={item.isCompleted}
                hasIssue={item.hasIssue}
                requiresPhoto={item.requiresPhoto}
                hasPhoto={item.hasPhoto}
                onPress={handleItemPress}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No post-trip checklist items</Text>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  progressPercentage: {
    ...typography.body,
    fontWeight: '600',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statValue: {
    ...typography.body,
    fontWeight: '600',
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: 16,
  },
});