import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import { typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';
import { 
  ChevronLeft, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Calendar,
  Share2,
  Download,
  User
} from 'lucide-react-native';
import { useChecklistStore } from '@/store/checklist-store';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';

export default function ChecklistDetailsScreen() {
  const router = useRouter();
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const { 
    checklists, 
    toggleItem, 
    addPhoto, 
    reportIssue,
    addNote,
    submitChecklist
  } = useChecklistStore();
  
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const checklistType = type as 'preDeparture' | 'postTrip';
  const checklist = checklists[checklistType] || [];
  const checklistItem = checklist.find(item => item.id === id);
  
  if (!checklistItem) {
    return (
      <View style={styles.errorContainer}>
        <Text style={typography.h3}>Checklist item not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }
  
  const handleToggleItem = () => {
    toggleItem(id);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };
  
  const handleAddPhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });
      
      if (!result.canceled) {
        addPhoto(id);
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };
  
  const handleReportIssue = () => {
    Alert.prompt(
      "Report Issue",
      "Please describe the issue:",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Submit",
          onPress: (issueText) => {
            if (issueText && issueText.trim()) {
              reportIssue(id, issueText);
              if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              }
            }
          }
        }
      ]
    );
  };
  
  const handleAddNote = (text: string) => {
    addNote(id, text);
  };
  
  const handleSubmitChecklist = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      submitChecklist(checklistType);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      Alert.alert(
        "Checklist Submitted",
        "Your checklist has been successfully submitted.",
        [
          { text: "OK", onPress: () => router.back() }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit checklist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleShareChecklist = async () => {
    // Fix the type error by changing the condition
    if (Platform.OS !== 'web') {
      try {
        // Create a temporary file with checklist data
        const fileUri = `${FileSystem.cacheDirectory}checklist_${Date.now()}.txt`;
        const checklistText = `
          Checklist: ${checklistType === 'preDeparture' ? 'Pre-Departure' : 'Post-Trip'}
          Item: ${checklistItem.title}
          Status: ${checklistItem.isCompleted ? 'Completed' : 'Pending'}
          Description: ${checklistItem.description}
          ${checklistItem.hasIssue ? `Issue Reported: Yes` : ''}
          ${checklistItem.notes ? `Notes: ${checklistItem.notes}` : ''}
        `;
        
        await FileSystem.writeAsStringAsync(fileUri, checklistText);
        
        // On native platforms, use the share API
        if (typeof navigator !== 'undefined' && navigator.share) {
          await navigator.share({
            title: 'Checklist Details',
            text: checklistText,
          });
        } else {
          Alert.alert("Sharing not available on this device");
        }
      } catch (error) {
        console.error('Error sharing checklist:', error);
        Alert.alert("Error", "Failed to share checklist");
      }
    } else {
      Alert.alert("Sharing not available on web");
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: checklistType === 'preDeparture' ? 'Pre-Departure Check' : 'Post-Trip Check',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ChevronLeft size={24} color={Colors.textPrimaryPrimaryPrimary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleShareChecklist}
              style={styles.headerButton}
            >
              <Share2 size={24} color={Colors.textPrimaryPrimaryPrimary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={typography.h2}>{checklistItem.title}</Text>
            <TouchableOpacity 
              style={[
                styles.statusButton,
                checklistItem.isCompleted ? styles.completedButton : styles.pendingButton
              ]}
              onPress={handleToggleItem}
            >
              {checklistItem.isCompleted ? (
                <CheckCircle size={20} color={Colors.white} />
              ) : (
                <Clock size={20} color={Colors.white} />
              )}
              <Text style={styles.statusButtonText}>
                {checklistItem.isCompleted ? 'Completed' : 'Pending'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[typography.body, styles.description]}>
            {checklistItem.description}
          </Text>
          
          {checklistItem.hasIssue && (
            <View style={styles.issueContainer}>
              <AlertTriangle size={20} color={Colors.accent} />
              <Text style={[typography.body, styles.issueText]}>
                Issue reported: {checklistItem.issueDescription || 'No description provided'}
              </Text>
            </View>
          )}
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Calendar size={16} color={Colors.textSecondary} />
              <Text style={[typography.bodySmall, styles.metaText]}>
                Added: June 15, 2023
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <User size={16} color={Colors.textSecondary} />
              <Text style={[typography.bodySmall, styles.metaText]}>
                Assigned to: Captain
              </Text>
            </View>
          </View>
        </Card>
        
        {checklistItem.requiresPhoto && (
          <Card style={styles.photoCard}>
            <Text style={typography.h3}>Photo Documentation</Text>
            
            {checklistItem.hasPhoto ? (
              <View style={styles.photoContainer}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1575224526242-5661a53a0426?q=80&w=800&auto=format&fit=crop' }} 
                  style={styles.photo}
                  resizeMode="cover"
                />
                <View style={styles.photoOverlay}>
                  <TouchableOpacity style={styles.photoAction}>
                    <Download size={20} color={Colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.photoAction}
                    onPress={handleAddPhoto}
                  >
                    <Camera size={20} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.noPhotoContainer}>
                <Text style={[typography.body, styles.noPhotoText]}>
                  Photo documentation required
                </Text>
                <Button
                  title="Take Photo"
                  icon={<Camera size={20} color={Colors.white} />}
                  onPress={handleAddPhoto}
                  style={styles.photoButton}
                />
              </View>
            )}
          </Card>
        )}
        
        <Card style={styles.notesCard}>
          <Text style={typography.h3}>Notes</Text>
          
          {checklistItem.notes ? (
            <View style={styles.existingNote}>
              <Text style={typography.body}>{checklistItem.notes}</Text>
              <TouchableOpacity 
                style={styles.editNoteButton}
                onPress={() => Alert.prompt(
                  "Edit Note",
                  "Update your note:",
                  [
                    {
                      text: "Cancel",
                      style: "cancel"
                    },
                    {
                      text: "Save",
                      onPress: (text) => {
                        if (text) handleAddNote(text);
                      }
                    }
                  ],
                  "plain-text",
                  checklistItem.notes
                )}
              >
                <Text style={styles.editNoteText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addNoteButton}
              onPress={() => Alert.prompt(
                "Add Note",
                "Enter your note:",
                [
                  {
                    text: "Cancel",
                    style: "cancel"
                  },
                  {
                    text: "Save",
                    onPress: (text) => {
                      if (text) handleAddNote(text);
                    }
                  }
                ]
              )}
            >
              <Text style={styles.addNoteText}>+ Add Note</Text>
            </TouchableOpacity>
          )}
        </Card>
        
        <View style={styles.actionButtons}>
          {!checklistItem.hasIssue && (
            <Button 
              title="Report Issue" 
              variant="outline" 
              icon={<AlertTriangle size={20} color={Colors.accent} />}
              onPress={handleReportIssue}
              textStyle={{ color: Colors.accent }}
              style={[styles.actionButton, { borderColor: Colors.accent }]}
            />
          )}
          
          <Button 
            title={checklistItem.isCompleted ? "Mark as Incomplete" : "Mark as Complete"} 
            variant={checklistItem.isCompleted ? "outline" : "primary"}
            onPress={handleToggleItem}
            style={styles.actionButton}
          />
        </View>
        
        <Button 
          title="Submit Entire Checklist" 
          onPress={handleSubmitChecklist}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.submitButton}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.background,
  },
  headerButton: {
    padding: 8,
  },
  itemCard: {
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  completedButton: {
    backgroundColor: Colors.success,
  },
  pendingButton: {
    backgroundColor: Colors.warning,
  },
  statusButtonText: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    color: Colors.white,
    fontWeight: "600",
    marginLeft: 4,
  },
  description: {
    marginBottom: 16,
  },
  issueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.accent}15`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  issueText: {
    marginLeft: 8,
    color: Colors.accent,
    flex: 1,
  },
  metaContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.textSecondary,
    paddingTop: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    marginLeft: 8,
  },
  photoCard: {
    marginBottom: 16,
  },
  photoContainer: {
    marginTop: 16,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
  },
  photoAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  noPhotoContainer: {
    marginTop: 16,
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  noPhotoText: {
    marginBottom: 16,
    color: Colors.textSecondary,
  },
  photoButton: {
    minWidth: 150,
  },
  notesCard: {
    marginBottom: 16,
  },
  existingNote: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.gray,
    borderRadius: 8,
  },
  editNoteButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  editNoteText: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    color: Colors.primary,
    fontWeight: "600",
  },
  addNoteButton: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
  },
  addNoteText: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    color: Colors.primary,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  submitButton: {
    marginTop: 8,
  },
});