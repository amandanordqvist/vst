import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/Button';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Droplet, 
  Wrench, 
  Clipboard, 
  AlertTriangle,
  ChevronLeft,
  Share2,
} from 'lucide-react-native';
import { useVesselStore } from '@/store/vessel-store';

export default function VesselDetailsScreen() {
  const router = useRouter();
  const { vessels, selectedVesselId } = useVesselStore();
  const insets = useSafeAreaInsets();
  
  // Find the selected vessel
  const vessel = vessels.find(v => v.id === selectedVesselId);
  
  if (!vessel) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={typography.h3}>Vessel not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={{ marginTop: 16 }}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: vessel.name,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <Share2 size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        <ScrollView contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 32 }
        ]}>
          <Image 
            source={{ uri: vessel.imageUrl }} 
            style={styles.vesselImage} 
            resizeMode="cover"
          />
          
          <View style={styles.header}>
            <View>
              <Text style={typography.h1}>{vessel.name}</Text>
              <Text style={[typography.bodySmall, styles.vesselType]}>{vessel.type}</Text>
            </View>
            <StatusBadge status={vessel.status} />
          </View>
          
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={typography.bodySmall}>Registration</Text>
                <Text style={typography.body}>{vessel.registrationNumber}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={typography.bodySmall}>Length</Text>
                <Text style={typography.body}>{vessel.length}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={typography.bodySmall}>Last Check</Text>
                <Text style={typography.body}>{vessel.lastCheck}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={typography.bodySmall}>Engine Hours</Text>
                <Text style={typography.body}>{vessel.engineHours} hrs</Text>
              </View>
            </View>
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.gray} />
              <Text style={[typography.body, styles.locationText]}>{vessel.location}</Text>
            </View>
          </Card>
          
          <Card style={styles.fuelCard}>
            <View style={styles.fuelHeader}>
              <Droplet size={20} color={colors.primary} />
              <Text style={[typography.h3, styles.fuelTitle]}>Fuel Level</Text>
            </View>
            
            <View style={styles.fuelInfo}>
              <Text style={styles.fuelPercentage}>{Math.round(vessel.fuelLevel * 100)}%</Text>
              <Text style={typography.bodySmall}>
                Estimated Range: {Math.round(vessel.fuelLevel * 350)} nm
              </Text>
            </View>
            
            <ProgressBar 
              progress={vessel.fuelLevel} 
              progressColor={colors.primary}
              height={12}
              style={styles.fuelProgressBar}
            />
          </Card>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primaryLight }]}>
                <Clipboard size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Checklists</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: `${colors.secondary}20` }]}>
                <Wrench size={24} color={colors.secondary} />
              </View>
              <Text style={styles.actionText}>Maintenance</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: `${colors.warning}20` }]}>
                <AlertTriangle size={24} color={colors.warning} />
              </View>
              <Text style={styles.actionText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
          
          <Card style={styles.maintenanceCard}>
            <Text style={typography.h3}>Upcoming Maintenance</Text>
            
            <View style={styles.maintenanceItem}>
              <View style={[styles.maintenanceStatus, { backgroundColor: colors.error }]} />
              <View style={styles.maintenanceInfo}>
                <Text style={typography.body}>Engine Oil Change</Text>
                <Text style={typography.bodySmall}>Due in 2 days</Text>
              </View>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.maintenanceItem}>
              <View style={[styles.maintenanceStatus, { backgroundColor: colors.warning }]} />
              <View style={styles.maintenanceInfo}>
                <Text style={typography.body}>Replace Impeller</Text>
                <Text style={typography.bodySmall}>Due in 7 days</Text>
              </View>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
            
            <Button 
              title="View All Maintenance Tasks" 
              variant="outline" 
              onPress={() => {}}
              style={styles.viewAllButton}
            />
          </Card>
          
          <Card style={styles.tripCard}>
            <Text style={typography.h3}>Recent Trips</Text>
            
            <View style={styles.tripItem}>
              <View style={styles.tripDate}>
                <Text style={styles.tripDay}>15</Text>
                <Text style={styles.tripMonth}>Jun</Text>
              </View>
              <View style={styles.tripInfo}>
                <Text style={typography.body}>Sunset Harbor Cruise</Text>
                <Text style={typography.bodySmall}>Duration: 4h 30m • Distance: 28 nm</Text>
              </View>
            </View>
            
            <View style={styles.tripItem}>
              <View style={styles.tripDate}>
                <Text style={styles.tripDay}>10</Text>
                <Text style={styles.tripMonth}>Jun</Text>
              </View>
              <View style={styles.tripInfo}>
                <Text style={typography.body}>Fishing Expedition</Text>
                <Text style={typography.bodySmall}>Duration: 6h 15m • Distance: 42 nm</Text>
              </View>
            </View>
            
            <Button 
              title="View Trip Log" 
              variant="outline" 
              onPress={() => {}}
              style={styles.viewAllButton}
            />
          </Card>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
  },
  headerButton: {
    padding: 8,
  },
  vesselImage: {
    width: '100%',
    height: 240,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  vesselType: {
    marginTop: 4,
  },
  infoCard: {
    marginHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    marginLeft: 8,
  },
  fuelCard: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  fuelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fuelTitle: {
    marginLeft: 8,
  },
  fuelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fuelPercentage: {
    ...typography.h2,
    color: colors.primary,
  },
  fuelProgressBar: {
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    ...typography.bodySmall,
    fontWeight: '500',
  },
  maintenanceCard: {
    marginHorizontal: 16,
  },
  maintenanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  maintenanceStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  maintenanceInfo: {
    flex: 1,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
  },
  viewButtonText: {
    ...typography.buttonSmall,
    color: colors.primary,
  },
  viewAllButton: {
    marginTop: 16,
  },
  tripCard: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  tripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tripDate: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tripDay: {
    ...typography.h3,
    color: colors.primary,
  },
  tripMonth: {
    ...typography.caption,
    color: colors.primary,
  },
  tripInfo: {
    flex: 1,
  },
});