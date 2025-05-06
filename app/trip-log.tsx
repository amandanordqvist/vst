import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
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
  Plus, 
  Trash2,
  Camera,
  Save
} from 'lucide-react-native';
import { useVesselStore } from '@/store/vessel-store';
import { useTripLogStore } from '@/store/trip-log-store';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

export default function TripLogScreen() {
  const router = useRouter();
  const { vessels } = useVesselStore();
  const { addTrip, isLoading } = useTripLogStore();
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('14:30');
  const [departureLocation, setDepartureLocation] = useState('');
  const [arrivalLocation, setArrivalLocation] = useState('');
  const [distance, setDistance] = useState('');
  const [fuelUsed, setFuelUsed] = useState('');
  const [engineHours, setEngineHours] = useState('');
  const [weatherConditions, setWeatherConditions] = useState('');
  const [notes, setNotes] = useState('');
  const [crewMembers, setCrewMembers] = useState<string[]>(['']);
  const [selectedVesselId, setSelectedVesselId] = useState<string | null>(null);
  const [showVesselSelector, setShowVesselSelector] = useState(false);
  
  // Set the first vessel as selected by default
  useEffect(() => {
    if (vessels.length > 0 && !selectedVesselId) {
      setSelectedVesselId(vessels[0].id);
    }
  }, [vessels]);
  
  const selectedVessel = vessels.find(v => v.id === selectedVesselId);
  
  const handleAddCrewMember = () => {
    setCrewMembers([...crewMembers, '']);
  };
  
  const handleRemoveCrewMember = (index: number) => {
    const newCrewMembers = [...crewMembers];
    newCrewMembers.splice(index, 1);
    setCrewMembers(newCrewMembers);
  };
  
  const handleUpdateCrewMember = (text: string, index: number) => {
    const newCrewMembers = [...crewMembers];
    newCrewMembers[index] = text;
    setCrewMembers(newCrewMembers);
  };
  
  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });
      
      if (!result.canceled) {
        // In a real app, we would store the photo
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        Alert.alert("Success", "Photo added to trip log");
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };
  
  const handleSaveTrip = async () => {
    if (!title) {
      Alert.alert("Error", "Please enter a trip title");
      return;
    }
    
    if (!selectedVesselId) {
      Alert.alert("Error", "Please select a vessel");
      return;
    }
    
    try {
      // Calculate duration from start and end time
      const startParts = startTime.split(':').map(Number);
      const endParts = endTime.split(':').map(Number);
      const startMinutes = startParts[0] * 60 + startParts[1];
      const endMinutes = endParts[0] * 60 + endParts[1];
      let durationMinutes = endMinutes - startMinutes;
      if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle overnight trips
      
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      const duration = `${hours}h ${minutes}m`;
      
      await addTrip({
        title,
        date,
        vesselId: selectedVesselId,
        startTime,
        endTime,
        duration,
        departureLocation,
        arrivalLocation,
        distance: distance ? parseFloat(distance) : 0,
        fuelUsed: fuelUsed ? parseFloat(fuelUsed) : 0,
        engineHours: engineHours ? parseFloat(engineHours) : 0,
        weatherConditions,
        notes,
        crewMembers: crewMembers.filter(member => member.trim() !== ''),
      });
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      Alert.alert(
        "Trip Logged",
        "Your trip has been successfully logged.",
        [
          { text: "OK", onPress: () => router.back() }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save trip log. Please try again.");
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Trip Log',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.formCard}>
          <Text style={typography.h3}>Trip Details</Text>
          
          <Input
            label="Trip Title"
            placeholder="e.g., Weekend Fishing Trip"
            value={title}
            onChangeText={setTitle}
            containerStyle={styles.inputContainer}
          />
          
          <View style={styles.vesselSelector}>
            <Text style={styles.inputLabel}>Vessel</Text>
            <TouchableOpacity 
              style={styles.vesselButton}
              onPress={() => setShowVesselSelector(!showVesselSelector)}
            >
              <Text style={styles.vesselButtonText}>
                {selectedVessel ? selectedVessel.name : 'Select a vessel'}
              </Text>
              <ChevronLeft size={20} color={colors.text} style={{ transform: [{ rotate: showVesselSelector ? '90deg' : '-90deg' }] }} />
            </TouchableOpacity>
            
            {showVesselSelector && (
              <View style={styles.vesselDropdown}>
                {vessels.map(vessel => (
                  <TouchableOpacity 
                    key={vessel.id}
                    style={[
                      styles.vesselOption,
                      selectedVesselId === vessel.id && styles.selectedVesselOption
                    ]}
                    onPress={() => {
                      setSelectedVesselId(vessel.id);
                      setShowVesselSelector(false);
                    }}
                  >
                    <Text style={[
                      styles.vesselOptionText,
                      selectedVesselId === vessel.id && styles.selectedVesselOptionText
                    ]}>
                      {vessel.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Date</Text>
              <View style={styles.dateInput}>
                <Calendar size={20} color={colors.gray} />
                <TextInput
                  style={styles.dateTextInput}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>
            
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Start Time</Text>
              <View style={styles.dateInput}>
                <Clock size={20} color={colors.gray} />
                <TextInput
                  style={styles.dateTextInput}
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="HH:MM"
                />
              </View>
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>End Time</Text>
              <View style={styles.dateInput}>
                <Clock size={20} color={colors.gray} />
                <TextInput
                  style={styles.dateTextInput}
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="HH:MM"
                />
              </View>
            </View>
            
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Distance (nm)</Text>
              <TextInput
                style={styles.textInput}
                value={distance}
                onChangeText={setDistance}
                placeholder="e.g., 25"
                keyboardType="numeric"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Departure Location</Text>
            <View style={styles.iconInput}>
              <MapPin size={20} color={colors.gray} />
              <TextInput
                style={styles.iconTextInput}
                placeholder="e.g., Marina Bay"
                value={departureLocation}
                onChangeText={setDepartureLocation}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Arrival Location</Text>
            <View style={styles.iconInput}>
              <Anchor size={20} color={colors.gray} />
              <TextInput
                style={styles.iconTextInput}
                placeholder="e.g., Sunset Harbor"
                value={arrivalLocation}
                onChangeText={setArrivalLocation}
              />
            </View>
          </View>
        </Card>
        
        <Card style={styles.formCard}>
          <Text style={typography.h3}>Additional Information</Text>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Fuel Used (gal)</Text>
              <View style={styles.dateInput}>
                <Droplet size={20} color={colors.gray} />
                <TextInput
                  style={styles.dateTextInput}
                  value={fuelUsed}
                  onChangeText={setFuelUsed}
                  placeholder="e.g., 15"
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Engine Hours</Text>
              <TextInput
                style={styles.textInput}
                value={engineHours}
                onChangeText={setEngineHours}
                placeholder="e.g., 4.5"
                keyboardType="numeric"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Weather Conditions</Text>
            <View style={styles.iconInput}>
              <Wind size={20} color={colors.gray} />
              <TextInput
                style={styles.iconTextInput}
                placeholder="e.g., Sunny, light winds"
                value={weatherConditions}
                onChangeText={setWeatherConditions}
              />
            </View>
          </View>
          
          <Text style={[styles.inputLabel, { marginBottom: 8 }]}>Crew Members</Text>
          {crewMembers.map((member, index) => (
            <View key={index} style={styles.crewMemberContainer}>
              <TextInput
                style={[styles.textInput, styles.crewMemberInput]}
                value={member}
                onChangeText={(text) => handleUpdateCrewMember(text, index)}
                placeholder={`Crew member ${index + 1}`}
              />
              {crewMembers.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveCrewMember(index)}
                >
                  <Trash2 size={16} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddCrewMember}
          >
            <Plus size={16} color={colors.primary} />
            <Text style={styles.addButtonText}>Add Crew Member</Text>
          </TouchableOpacity>
          
          <Text style={[styles.inputLabel, { marginTop: 16 }]}>Notes</Text>
          <TextInput
            style={[styles.textInput, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes about the trip..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Card>
        
        <Card style={styles.formCard}>
          <Text style={typography.h3}>Photos</Text>
          <Text style={[typography.bodySmall, styles.photoDescription]}>
            Add photos from your trip to keep a visual record.
          </Text>
          
          <TouchableOpacity 
            style={styles.photoButton}
            onPress={handleTakePhoto}
          >
            <Camera size={24} color={colors.primary} />
            <Text style={styles.photoButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </Card>
        
        <Button 
          title="Save Trip Log"
          icon={<Save size={20} color={colors.white} />}
          onPress={handleSaveTrip}
          loading={isLoading}
          disabled={isLoading}
          style={styles.saveButton}
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
  headerButton: {
    padding: 8,
  },
  formCard: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    ...typography.bodySmall,
    fontWeight: '500',
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...typography.body,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInput: {
    width: '48%',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateTextInput: {
    marginLeft: 8,
    flex: 1,
    ...typography.body,
  },
  vesselSelector: {
    marginBottom: 16,
    position: 'relative',
  },
  vesselButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  vesselButtonText: {
    ...typography.body,
  },
  vesselDropdown: {
    position: 'absolute',
    top: 74,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
    elevation: 3,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  vesselOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  selectedVesselOption: {
    backgroundColor: colors.primaryLight,
  },
  vesselOptionText: {
    ...typography.body,
  },
  selectedVesselOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  crewMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  crewMemberInput: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  addButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  notesInput: {
    height: 100,
    paddingTop: 12,
  },
  photoDescription: {
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 16,
  },
  photoButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  saveButton: {
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  iconInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  iconTextInput: {
    marginLeft: 8,
    flex: 1,
    ...typography.body,
  },
});