import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Anchor, 
  Droplet, 
  Wind, 
  User,
  Share2,
  Edit,
  Trash2,
  Download
} from 'lucide-react-native';
import { useTripLogStore } from '@/store/trip-log-store';
import { useVesselStore } from '@/store/vessel-store';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';

export default function TripDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, deleteTrip } = useTripLogStore();
  const { vessels } = useVesselStore();
  
  const trip = trips.find(t => t.id === id);
  
  if (!trip) {
    return (
      <View style={styles.errorContainer}>
        <Text style={typography.h3}>Trip not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }
  
  const vessel = vessels.find(v => v.id === trip.vesselId);
  
  const handleDeleteTrip = () => {
    Alert.alert(
      "Delete Trip Log",
      "Are you sure you want to delete this trip log? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTrip(trip.id);
              
              if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
              
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to delete trip log. Please try again.");
            }
          }
        }
      ]
    );
  };
  
  const handleShareTrip = async () => {
    if (Platform.OS !== 'web') {
      try {
        // Create a temporary file with trip data
        const fileUri = `${FileSystem.cacheDirectory}trip_${Date.now()}.txt`;
        const tripText = `
          Trip: ${trip.title}
          Date: ${trip.date}
          Vessel: ${vessel?.name || 'Unknown'}
          Duration: ${trip.duration}
          Route: ${trip.departureLocation} to ${trip.arrivalLocation}
          Distance: ${trip.distance} nm
          Fuel Used: ${trip.fuelUsed} gal
          Engine Hours: ${trip.engineHours}
          Weather: ${trip.weatherConditions}
          Crew: ${trip.crewMembers?.join(', ')}
          Notes: ${trip.notes}
        `;
        
        await FileSystem.writeAsStringAsync(fileUri, tripText);
        
        // On native platforms, use the share API
        if (typeof navigator !== 'undefined' && navigator.share) {
          await navigator.share({
            title: 'Trip Log Details',
            text: tripText,
          });
        } else {
          Alert.alert("Sharing not available on this device");
        }
      } catch (error) {
        console.error('Error sharing trip:', error);
        Alert.alert("Error", "Failed to share trip log");
      }
    } else {
      Alert.alert("Sharing not available on web");
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Trip Details',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                onPress={handleShareTrip}
                style={styles.headerButton}
              >
                <Share2 size={24} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => router.push(`/edit-trip?id=${trip.id}`)}
                style={styles.headerButton}
              >
                <Edit size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.tripHeader}>
          <Text style={typography.h2}>{trip.title}</Text>
          
          <View style={styles.tripMeta}>
            <View style={styles.tripMetaItem}>
              <Calendar size={16} color={colors.gray} />
              <Text style={styles.tripMetaText}>{trip.date}</Text>
            </View>
            
            <View style={styles.tripMetaItem}>
              <Clock size={16} color={colors.gray} />
              <Text style={styles.tripMetaText}>{trip.duration}</Text>
            </View>
          </View>
          
          <View style={styles.vesselInfo}>
            <View style={styles.vesselIcon}>
              <Anchor size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.vesselLabel}>Vessel</Text>
              <Text style={styles.vesselName}>{vessel?.name || 'Unknown Vessel'}</Text>
            </View>
          </View>
        </Card>
        
        <Card style={styles.routeCard}>
          <Text style={typography.h3}>Route Information</Text>
          
          <View style={styles.routeContainer}>
            <View style={styles.routePoint}>
              <View style={[styles.routeMarker, styles.departureMarker]} />
              <View>
                <Text style={styles.routePointLabel}>Departure</Text>
                <Text style={styles.routePointName}>{trip.departureLocation}</Text>
                <Text style={styles.routePointTime}>{trip.startTime}</Text>
              </View>
            </View>
            
            <View style={styles.routeLine} />
            
            <View style={styles.routePoint}>
              <View style={[styles.routeMarker, styles.arrivalMarker]} />
              <View>
                <Text style={styles.routePointLabel}>Arrival</Text>
                <Text style={styles.routePointName}>{trip.arrivalLocation}</Text>
                <Text style={styles.routePointTime}>{trip.endTime}</Text>
              </View>
            </View>
          </View>
        </Card>
        
        <Card style={styles.statsCard}>
          <Text style={typography.h3}>Trip Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trip.distance}</Text>
              <Text style={styles.statLabel}>Distance (nm)</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trip.fuelUsed}</Text>
              <Text style={styles.statLabel}>Fuel Used (gal)</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trip.engineHours}</Text>
              <Text style={styles.statLabel}>Engine Hours</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {trip.distance > 0 && trip.fuelUsed > 0 
                  ? (trip.fuelUsed / trip.distance).toFixed(2) 
                  : 'N/A'}
              </Text>
              <Text style={styles.statLabel}>Fuel Efficiency (gal/nm)</Text>
            </View>
          </View>
        </Card>
        
        {trip.weatherConditions && (
          <Card style={styles.weatherCard}>
            <View style={styles.cardHeader}>
              <Text style={typography.h3}>Weather Conditions</Text>
              <Wind size={20} color={colors.primary} />
            </View>
            
            <Text style={styles.weatherText}>{trip.weatherConditions}</Text>
          </Card>
        )}
        
        {trip.crewMembers && trip.crewMembers.length > 0 && (
          <Card style={styles.crewCard}>
            <View style={styles.cardHeader}>
              <Text style={typography.h3}>Crew</Text>
              <User size={20} color={colors.primary} />
            </View>
            
            <View style={styles.crewList}>
              {trip.crewMembers.map((member, index) => (
                <View key={index} style={styles.crewMember}>
                  <View style={styles.crewAvatar}>
                    <Text style={styles.crewInitial}>{member.charAt(0)}</Text>
                  </View>
                  <Text style={styles.crewName}>{member}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}
        
        {trip.notes && (
          <Card style={styles.notesCard}>
            <Text style={typography.h3}>Notes</Text>
            <Text style={styles.notesText}>{trip.notes}</Text>
          </Card>
        )}
        
        <Card style={styles.photosCard}>
          <View style={styles.cardHeader}>
            <Text style={typography.h3}>Photos</Text>
            <TouchableOpacity style={styles.downloadButton}>
              <Download size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photosContainer}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?q=80&w=800&auto=format&fit=crop' }} 
              style={styles.photo}
            />
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=800&auto=format&fit=crop' }} 
              style={styles.photo}
            />
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1593351415075-3bac9f45c877?q=80&w=800&auto=format&fit=crop' }} 
              style={styles.photo}
            />
          </ScrollView>
        </Card>
        
        <Button 
          title="Delete Trip Log" 
          variant="outline"
          icon={<Trash2 size={20} color={colors.error} />}
          onPress={handleDeleteTrip}
          style={styles.deleteButton}
          textStyle={{ color: colors.error }}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
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
  headerButtons: {
    flexDirection: 'row',
  },
  tripHeader: {
    marginBottom: 16,
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
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  vesselInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  vesselIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vesselLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  vesselName: {
    ...typography.body,
    fontWeight: '600',
  },
  routeCard: {
    marginBottom: 16,
  },
  routeContainer: {
    marginTop: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  departureMarker: {
    backgroundColor: colors.primary,
  },
  arrivalMarker: {
    backgroundColor: colors.success,
  },
  routePointLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  routePointName: {
    ...typography.body,
    fontWeight: '600',
  },
  routePointTime: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  routeLine: {
    width: 2,
    height: 40,
    backgroundColor: colors.border,
    marginLeft: 7,
    marginVertical: 8,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  statItem: {
    width: '50%',
    marginBottom: 16,
  },
  statValue: {
    ...typography.h3,
    color: colors.primary,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  weatherCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherText: {
    ...typography.body,
    marginTop: 8,
  },
  crewCard: {
    marginBottom: 16,
  },
  crewList: {
    marginTop: 16,
  },
  crewMember: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  crewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  crewInitial: {
    ...typography.subtitle,
    color: colors.primary,
  },
  crewName: {
    ...typography.body,
  },
  notesCard: {
    marginBottom: 16,
  },
  notesText: {
    ...typography.body,
    marginTop: 8,
  },
  photosCard: {
    marginBottom: 24,
  },
  downloadButton: {
    padding: 4,
  },
  photosContainer: {
    marginTop: 16,
  },
  photo: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 12,
  },
  deleteButton: {
    borderColor: colors.error,
  },
});