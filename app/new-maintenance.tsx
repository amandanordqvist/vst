import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  Anchor, 
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  X,
} from 'lucide-react-native';
import { useMaintenanceStore } from '@/store/maintenance-store';
import { useVesselStore } from '@/store/vessel-store';

export default function NewMaintenanceScreen() {
  const router = useRouter();
  const { addItem } = useMaintenanceStore();
  const { vessels } = useVesselStore();
  const insets = useSafeAreaInsets();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [priority, setPriority] = useState<'good' | 'warning' | 'critical' | 'neutral'>('neutral');
  const [selectedVesselId, setSelectedVesselId] = useState(vessels.length > 0 ? vessels[0].id : '');
  const [instructions, setInstructions] = useState('');
  const [showVesselPicker, setShowVesselPicker] = useState(false);
  
  const handleSubmit = () => {
    if (!title || !dueDate) {
      // Handle validation error
      return;
    }
    
    const newItem = {
      title,
      description,
      dueDate,
      estimatedTime,
      priority,
      status: 'pending' as const,
      vesselId: selectedVesselId,
      instructions,
      parts: [],
    };
    
    addItem(newItem);
    router.back();
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'New Maintenance Task',
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
      
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 20}
        >
          <ScrollView 
            contentContainerStyle={[
              styles.contentContainer,
              { paddingBottom: insets.bottom > 0 ? insets.bottom : 32 }
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <Input
              label="Title"
              placeholder="Enter maintenance task title"
              value={title}
              onChangeText={setTitle}
            />
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Enter a brief description of the maintenance task"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  label="Due Date"
                  placeholder="MM/DD/YYYY"
                  value={dueDate}
                  onChangeText={setDueDate}
                  leftIcon={<Calendar size={20} color={colors.gray} />}
                />
              </View>
              
              <View style={styles.halfWidth}>
                <Input
                  label="Estimated Time"
                  placeholder="e.g. 2 hours"
                  value={estimatedTime}
                  onChangeText={setEstimatedTime}
                  leftIcon={<Clock size={20} color={colors.gray} />}
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityButtons}>
                <TouchableOpacity 
                  style={[
                    styles.priorityButton,
                    priority === 'good' ? styles.priorityButtonActive : null,
                    { backgroundColor: priority === 'good' ? `${colors.success}20` : colors.lightGray }
                  ]}
                  onPress={() => setPriority('good')}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    priority === 'good' ? { color: colors.success } : null,
                  ]}>
                    Normal
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.priorityButton,
                    priority === 'warning' ? styles.priorityButtonActive : null,
                    { backgroundColor: priority === 'warning' ? `${colors.warning}20` : colors.lightGray }
                  ]}
                  onPress={() => setPriority('warning')}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    priority === 'warning' ? { color: colors.warning } : null,
                  ]}>
                    High
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.priorityButton,
                    priority === 'critical' ? styles.priorityButtonActive : null,
                    { backgroundColor: priority === 'critical' ? `${colors.error}20` : colors.lightGray }
                  ]}
                  onPress={() => setPriority('critical')}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    priority === 'critical' ? { color: colors.error } : null,
                  ]}>
                    Critical
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Vessel</Text>
              <TouchableOpacity 
                style={styles.vesselSelector}
                onPress={() => setShowVesselPicker(!showVesselPicker)}
              >
                <Anchor size={20} color={colors.gray} />
                <Text style={styles.vesselSelectorText}>
                  {selectedVesselId 
                    ? vessels.find(v => v.id === selectedVesselId)?.name || 'Select Vessel'
                    : 'Select Vessel'
                  }
                </Text>
              </TouchableOpacity>
              
              {showVesselPicker && (
                <View style={styles.vesselDropdown}>
                  {vessels.map(vessel => (
                    <TouchableOpacity 
                      key={vessel.id}
                      style={styles.vesselOption}
                      onPress={() => {
                        setSelectedVesselId(vessel.id);
                        setShowVesselPicker(false);
                      }}
                    >
                      <Text style={[
                        styles.vesselOptionText,
                        selectedVesselId === vessel.id ? styles.vesselOptionSelected : null,
                      ]}>
                        {vessel.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Instructions</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Enter detailed instructions for this maintenance task"
                value={instructions}
                onChangeText={setInstructions}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
            
            <TouchableOpacity style={styles.addImagesButton}>
              <ImageIcon size={20} color={colors.primary} />
              <Text style={styles.addImagesText}>Add Reference Images</Text>
            </TouchableOpacity>
            
            <Button
              title="Create Maintenance Task"
              onPress={handleSubmit}
              disabled={!title || !dueDate}
              fullWidth
              style={styles.submitButton}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  headerButton: {
    padding: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: '500',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    ...typography.body,
    minHeight: 100,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: 4,
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  priorityButtonActive: {
    borderWidth: 1,
  },
  priorityButtonText: {
    ...typography.body,
    fontWeight: '500',
  },
  vesselSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
  vesselSelectorText: {
    ...typography.body,
    marginLeft: 8,
  },
  vesselDropdown: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginTop: 4,
    padding: 8,
  },
  vesselOption: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  vesselOptionText: {
    ...typography.body,
  },
  vesselOptionSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  addImagesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  addImagesText: {
    ...typography.button,
    color: colors.primary,
    marginLeft: 8,
  },
  submitButton: {
    marginBottom: 16,
  },
});