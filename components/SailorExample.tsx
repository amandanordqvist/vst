import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import SailorButton from './SailorButton';
import SailorCard from './SailorCard';
import StatusBadge from './StatusBadge';
import theme from '@/constants/theme';
import { Colors } from '@/constants/colors';

/**
 * Example screen showcasing the Sailor Luxe Theme components
 */
const SailorExample = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Sailor Luxe UI Components</Text>
        <Text style={styles.subtitle}>A premium command bridge for vessel crews</Text>
        
        {/* Status Badges */}
        <Text style={styles.sectionTitle}>Status Indicators</Text>
        <View style={styles.row}>
          <StatusBadge label="Underway" type="success" />
          <StatusBadge label="Maintenance due" type="warning" />
          <StatusBadge label="At dock" type="info" />
        </View>
        
        {/* Buttons */}
        <Text style={styles.sectionTitle}>Buttons</Text>
        <View style={styles.buttonsContainer}>
          <SailorButton 
            label="Primary Action" 
            variant="primary" 
            onPress={() => {}} 
            style={styles.button}
          />
          <SailorButton 
            label="Secondary Action" 
            variant="secondary" 
            onPress={() => {}} 
            style={styles.button}
          />
          <SailorButton 
            label="Ghost Button" 
            variant="ghost" 
            onPress={() => {}} 
            style={styles.button}
          />
          <SailorButton 
            label="Loading State" 
            variant="primary" 
            isLoading={true} 
            onPress={() => {}} 
            style={styles.button}
          />
        </View>
        
        {/* Cards */}
        <Text style={styles.sectionTitle}>Cards</Text>
        
        <SailorCard 
          title="Vessel Status" 
          subtitle="Last updated: 5 minutes ago"
          status={<StatusBadge label="Underway" type="success" />}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              Current speed: 12 knots
            </Text>
            <Text style={styles.cardText}>
              Heading: 135° SE
            </Text>
            <Text style={styles.cardText}>
              Weather: Calm seas
            </Text>
          </View>
        </SailorCard>
        
        <SailorCard 
          title="Maintenance Alert" 
          subtitle="Engine room inspection"
          status={<StatusBadge label="Required" type="warning" />}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              Schedule maintenance for the main engine before next departure.
            </Text>
            <View style={styles.cardActions}>
              <SailorButton 
                label="Schedule" 
                variant="secondary" 
                onPress={() => {}} 
                style={styles.cardButton}
              />
              <SailorButton 
                label="Dismiss" 
                variant="ghost" 
                onPress={() => {}} 
                style={styles.cardButton}
              />
            </View>
          </View>
        </SailorCard>
        
        <SailorCard 
          title="Crew Schedule" 
          subtitle="Next 24 hours"
          status={<StatusBadge label="4 On duty" type="info" />}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              Captain: On bridge (08:00 - 14:00)
            </Text>
            <Text style={styles.cardText}>
              First Mate: Engine room (10:00 - 16:00)
            </Text>
            <Text style={styles.cardText}>
              Deckhands: Maintenance (09:00 - 17:00)
            </Text>
          </View>
        </SailorCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  buttonsContainer: {
    gap: theme.spacing.md,
  },
  button: {
    marginBottom: theme.spacing.xs,
  },
  cardContent: {
    gap: theme.spacing.sm,
  },
  cardText: {
    fontSize: theme.fontSize.md,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  cardButton: {
    flex: 1,
  },
});

export default SailorExample; 