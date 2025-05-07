import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Anchor, 
  Droplet, 
  Plus, 
  Filter,
  ChevronRight,
  User
} from 'lucide-react-native';
import { useTripLogStore } from '@/store/trip-log-store';
import { useVesselStore } from '@/store/vessel-store';

export default function TripLogsScreen() {
  const router = useRouter();
  const { trips, isLoading, fetchTrips } = useTripLogStore();
  const { vessels } = useVesselStore();
  
  const [filterVesselId, setFilterVesselId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    fetchTrips();
  }, []);
  
  const filteredTrips = filterVesselId 
    ? trips.filter(trip => trip.vesselId === filterVesselId)
    : trips;
  
  const sortedTrips = [...filteredTrips].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const getVesselName = (vesselId: string) => {
    const vessel = vessels.find(v => v.id === vesselId);
    return vessel ? vessel.name : 'Unknown Vessel';
  };
  
  // Calculate total stats
  const totalDistance = trips.reduce((sum, trip) => sum + (trip.distance || 0), 0);
  const totalFuel = trips.reduce((sum, trip) => sum + (trip.fuelUsed || 0), 0);
  const totalEngineHours = trips.reduce((sum, trip) => sum + (trip.engineHours || 0), 0);
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Trip Logs',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ChevronLeft size={24} color={Colors.textPrimaryPrimaryPrimary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Button 
            title="New Trip Log" 
            icon={<Plus size={20} color={Colors.white} />}
            onPress={() => router.push('/trip-log')}
          />
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={Colors.textPrimaryPrimaryPrimary} />
          </TouchableOpacity>
        </View>
        
        {showFilters && (
          <Card style={styles.filtersCard}>
            <Text style={typography.subtitle}>Filter by Vessel</Text>
            
            <TouchableOpacity 
              style={[
                styles.filterOption,
                filterVesselId === null && styles.activeFilterOption
              ]}
              onPress={() => setFilterVesselId(null)}
            >
              <Text style={[
                styles.filterOptionText,
                filterVesselId === null && styles.activeFilterOptionText
              ]}>
                All Vessels
              </Text>
            </TouchableOpacity>
            
            {vessels.map(vessel => (
              <TouchableOpacity 
                key={vessel.id}
                style={[
                  styles.filterOption,
                  filterVesselId === vessel.id && styles.activeFilterOption
                ]}
                onPress={() => setFilterVesselId(vessel.id)}
              >
                <Text style={[
                  styles.filterOptionText,
                  filterVesselId === vessel.id && styles.activeFilterOptionText
                ]}>
                  {vessel.name}
                </Text>
              </TouchableOpacity>
            ))}
          </Card>
        )}
        
        <Card style={styles.statsCard}>
          <Text style={typography.subtitle}>Trip Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalDistance.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Total Distance (nm)</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalFuel.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Total Fuel (gal)</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trips.length}</Text>
              <Text style={styles.statLabel}>Total Trips</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalEngineHours.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Engine Hours</Text>
            </View>
          </View>
        </Card>
        
        <Text style={[typography.h3, styles.sectionTitle]}>Trip History</Text>
        
        <ScrollView style={styles.tripsList}>
          {sortedTrips.length > 0 ? (
            sortedTrips.map(trip => (
              <Card key={trip.id} style={styles.tripCard}>
                <TouchableOpacity 
                  style={styles.tripCardContent}
                  onPress={() => router.push(`/trip-details?id=${trip.id}`)}
                >
                  <View style={styles.tripHeader}>
                    <Text style={typography.subtitle}>{trip.title}</Text>
                    <ChevronRight size={20} color={Colors.textSecondary} />
                  </View>
                  
                  <View style={styles.tripMeta}>
                    <View style={styles.tripMetaItem}>
                      <Calendar size={16} color={Colors.textSecondary} />
                      <Text style={styles.tripMetaText}>{trip.date}</Text>
                    </View>
                    
                    <View style={styles.tripMetaItem}>
                      <Anchor size={16} color={Colors.textSecondary} />
                      <Text style={styles.tripMetaText}>{getVesselName(trip.vesselId)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.tripDetails}>
                    <View style={styles.tripDetailItem}>
                      <Clock size={16} color={Colors.primary} />
                      <Text style={styles.tripDetailText}>{trip.duration}</Text>
                    </View>
                    
                    <View style={styles.tripDetailItem}>
                      <MapPin size={16} color={Colors.primary} />
                      <Text style={styles.tripDetailText} numberOfLines={1}>
                        {trip.departureLocation} to {trip.arrivalLocation}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.tripStats}>
                    <View style={styles.tripStat}>
                      <Text style={styles.tripStatLabel}>Distance</Text>
                      <Text style={styles.tripStatValue}>{trip.distance} nm</Text>
                    </View>
                    
                    <View style={styles.tripStat}>
                      <Text style={styles.tripStatLabel}>Fuel</Text>
                      <Text style={styles.tripStatValue}>{trip.fuelUsed} gal</Text>
                    </View>
                    
                    <View style={styles.tripStat}>
                      <Text style={styles.tripStatLabel}>Engine</Text>
                      <Text style={styles.tripStatValue}>{trip.engineHours} hrs</Text>
                    </View>
                  </View>
                  
                  {trip.crewMembers && trip.crewMembers.length > 0 && (
                    <View style={styles.crewSection}>
                      <View style={styles.crewHeader}>
                        <User size={16} color={Colors.textSecondary} />
                        <Text style={styles.crewTitle}>Crew: </Text>
                        <Text style={styles.crewNames}>
                          {trip.crewMembers.join(', ')}
                        </Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </Card>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No trip logs found</Text>
              <Button 
                title="Create Trip Log" 
                variant="outline"
                onPress={() => router.push('/trip-log')}
                style={{ marginTop: 16 }}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  headerButton: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filtersCard: {
    marginBottom: 16,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  activeFilterOption: {
    backgroundColor: Colors.background,
  },
  filterOptionText: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
  },
  activeFilterOptionText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  statsCard: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  statItem: {
    width: '50%',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24, fontWeight: "600", lineHeight: 32, letterSpacing: 0,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  tripsList: {
    flex: 1,
  },
  tripCard: {
    marginBottom: 12,
    padding: 0,
    overflow: 'hidden',
  },
  tripCardContent: {
    padding: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripMeta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tripMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  tripMetaText: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  tripDetails: {
    marginTop: 12,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripDetailText: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    marginLeft: 8,
  },
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.textSecondary,
  },
  tripStat: {
    alignItems: 'center',
  },
  tripStatLabel: {
    fontSize: 12, fontWeight: "400", lineHeight: 16, letterSpacing: 0.4,
    color: Colors.textSecondary,
  },
  tripStatValue: {
    fontSize: 16, fontWeight: "600", lineHeight: 24, letterSpacing: 0.15,
  },
  crewSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.textSecondary,
  },
  crewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crewTitle: {
    fontSize: 16, fontWeight: "600", lineHeight: 24, letterSpacing: 0.15,
    marginLeft: 4,
  },
  crewNames: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    color: Colors.textSecondary,
  },
});