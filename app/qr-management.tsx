import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, TextInput, Switch, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { ChevronLeft, QrCode, Printer, Download, Plus, Edit2, Trash2 } from 'lucide-react-native';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';

interface QRCode {
  id: string;
  name: string;
  vesselId?: string;
  vesselName?: string;
  dateCreated: string;
  lastPrinted?: string;
  url: string;
}

export default function QRManagementScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'vessel' | 'user' | 'equipment'>('vessel');
  const [searchQuery, setSearchQuery] = useState('');
  const [includeUnassigned, setIncludeUnassigned] = useState(true);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newQRName, setNewQRName] = useState('');

  // Mock data for QR codes
  const qrCodes: QRCode[] = [
    {
      id: 'qr1',
      name: 'Main Vessel QR',
      vesselId: 'v1',
      vesselName: 'Sea Explorer I',
      dateCreated: '2023-09-15',
      lastPrinted: '2023-10-02',
      url: 'https://example.com/qr/v1'
    },
    {
      id: 'qr2',
      name: 'Engine Room Access',
      vesselId: 'v1',
      vesselName: 'Sea Explorer I',
      dateCreated: '2023-09-15',
      url: 'https://example.com/qr/v1/engine'
    },
    {
      id: 'qr3',
      name: 'Bridge Access',
      vesselId: 'v2',
      vesselName: 'Ocean Voyager',
      dateCreated: '2023-08-22',
      lastPrinted: '2023-08-22',
      url: 'https://example.com/qr/v2/bridge'
    },
    {
      id: 'qr4',
      name: 'New Equipment QR',
      dateCreated: '2023-10-01',
      url: 'https://example.com/qr/eq1'
    }
  ];

  // Filter QR codes based on search and filters
  const filteredQRCodes = qrCodes
    .filter(qr => 
      (activeTab === 'vessel' && qr.vesselId) || 
      (activeTab === 'equipment' && !qr.vesselId) ||
      (activeTab === 'user')
    )
    .filter(qr => 
      includeUnassigned || qr.vesselId
    )
    .filter(qr => 
      qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (qr.vesselName && qr.vesselName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleCreateQR = () => {
    if (isCreatingNew) {
      // Simulate QR creation
      console.log(`Creating new QR: ${newQRName}`);
      setIsCreatingNew(false);
      setNewQRName('');
    } else {
      setIsCreatingNew(true);
    }
  };

  const handlePrint = (qrId: string) => {
    console.log(`Printing QR code: ${qrId}`);
  };

  const handleDownload = (qrId: string) => {
    console.log(`Downloading QR code: ${qrId}`);
  };

  const handleDelete = (qrId: string) => {
    console.log(`Deleting QR code: ${qrId}`);
  };

  const handleEdit = (qrId: string) => {
    console.log(`Editing QR code: ${qrId}`);
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'QR Code Management',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ChevronLeft size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tabButton, 
              activeTab === 'vessel' ? styles.activeTab : null
            ]}
            onPress={() => setActiveTab('vessel')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'vessel' ? styles.activeTabText : null
            ]}>
              Vessel QRs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tabButton, 
              activeTab === 'equipment' ? styles.activeTab : null
            ]}
            onPress={() => setActiveTab('equipment')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'equipment' ? styles.activeTabText : null
            ]}>
              Equipment QRs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tabButton, 
              activeTab === 'user' ? styles.activeTab : null
            ]}
            onPress={() => setActiveTab('user')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'user' ? styles.activeTabText : null
            ]}>
              User QRs
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search QR codes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon={<QrCode size={20} color={Colors.textSecondary} />}
            style={styles.searchInput}
          />
          
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Show Unassigned:</Text>
            <Switch
              value={includeUnassigned}
              onValueChange={setIncludeUnassigned}
              trackColor={{ false: Colors.textSecondary, true: Colors.background }}
              thumbColor={includeUnassigned ? Colors.primary : Colors.gray}
            />
          </View>
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {isCreatingNew && (
            <Card style={styles.newQRCard}>
              <Text style={styles.cardTitle}>Create New QR Code</Text>
              <Input
                label="QR Code Name"
                placeholder="Enter name for this QR code"
                value={newQRName}
                onChangeText={setNewQRName}
              />
              
              <View style={styles.buttonsRow}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => setIsCreatingNew(false)}
                  style={styles.cancelButton}
                />
                <Button
                  title="Generate QR"
                  onPress={handleCreateQR}
                  disabled={!newQRName.trim()}
                  style={styles.createButton}
                />
              </View>
            </Card>
          )}
          
          {filteredQRCodes.map(qr => (
            <Card key={qr.id} style={styles.qrCard}>
              <View style={styles.qrCardContent}>
                <View style={styles.qrImageContainer}>
                  {/* Placeholder for actual QR code image */}
                  <View style={styles.qrImagePlaceholder}>
                    <QrCode size={60} color={Colors.primary} />
                  </View>
                </View>
                
                <View style={styles.qrDetails}>
                  <Text style={styles.qrName}>{qr.name}</Text>
                  {qr.vesselName && (
                    <Text style={styles.vesselName}>Assigned to: {qr.vesselName}</Text>
                  )}
                  {!qr.vesselName && (
                    <Text style={styles.unassignedText}>Unassigned</Text>
                  )}
                  <Text style={styles.qrDate}>Created: {qr.dateCreated}</Text>
                  {qr.lastPrinted && (
                    <Text style={styles.qrDate}>Last printed: {qr.lastPrinted}</Text>
                  )}
                </View>
                
                <View style={styles.qrActions}>
                  <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => handlePrint(qr.id)}
                  >
                    <Printer size={22} color={Colors.primary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => handleDownload(qr.id)}
                  >
                    <Download size={22} color={Colors.primary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => handleEdit(qr.id)}
                  >
                    <Edit2 size={22} color={Colors.textSecondary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => handleDelete(qr.id)}
                  >
                    <Trash2 size={22} color={Colors.accent} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))}
          
          {filteredQRCodes.length === 0 && (
            <View style={styles.emptyState}>
              <QrCode size={60} color={Colors.textSecondary} />
              <Text style={styles.emptyStateText}>
                No QR codes found matching your criteria
              </Text>
            </View>
          )}
        </ScrollView>
        
        {!isCreatingNew && (
          <View style={styles.floatingButtonContainer}>
            <TouchableOpacity 
              style={styles.floatingButton}
              onPress={handleCreateQR}
            >
              <Plus size={24} color={Colors.white} />
              <Text style={styles.floatingButtonText}>New QR Code</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textSecondary,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textSecondary,
  },
  searchInput: {
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  qrCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  qrCardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  qrImageContainer: {
    marginRight: 16,
  },
  qrImagePlaceholder: {
    width: 90,
    height: 90,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  qrDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  qrName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  vesselName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  unassignedText: {
    fontSize: 14,
    color: Colors.accent,
    marginBottom: 4,
  },
  qrDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  qrActions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  floatingButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  newQRCard: {
    marginBottom: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    marginRight: 12,
  },
  createButton: {
    minWidth: 120,
  },
}); 