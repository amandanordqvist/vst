import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '@/components/Card';
import { typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';
import { 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Moon,
  Globe,
  Smartphone,
  Anchor,
  Wrench,
  LifeBuoy
} from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [locationEnabled, setLocationEnabled] = React.useState(true);
  
  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileSection}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' }} 
          style={styles.profileImage} 
        />
        <View style={styles.profileInfo}>
          <Text style={typography.h2}>John Sailor</Text>
          <Text style={[typography.body, styles.emailText]}>john.sailor@example.com</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      
      <Card style={styles.settingsCard}>
        <Text style={[typography.h3, styles.settingsTitle]}>App Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: Colors.background }]}>
              <Bell size={20} color={Colors.primary} />
            </View>
            <Text style={typography.body}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: Colors.gray, true: `${Colors.primary}80` }}
            thumbColor={notificationsEnabled ? Colors.primary : Colors.textSecondary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: `${Colors.secondary}20` }]}>
              <Moon size={20} color={Colors.secondary} />
            </View>
            <Text style={typography.body}>Dark Mode</Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: Colors.gray, true: `${Colors.primary}80` }}
            thumbColor={darkModeEnabled ? Colors.primary : Colors.textSecondary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: `${Colors.success}20` }]}>
              <Globe size={20} color={Colors.success} />
            </View>
            <Text style={typography.body}>Location Services</Text>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: Colors.gray, true: `${Colors.primary}80` }}
            thumbColor={locationEnabled ? Colors.primary : Colors.textSecondary}
          />
        </View>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: `${Colors.warning}20` }]}>
              <Smartphone size={20} color={Colors.warning} />
            </View>
            <Text style={typography.body}>Device Management</Text>
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </Card>
      
      <Card style={styles.settingsCard}>
        <Text style={[typography.h3, styles.settingsTitle]}>Vessel Settings</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: Colors.background }]}>
              <Anchor size={20} color={Colors.primary} />
            </View>
            <Text style={typography.body}>Manage Vessels</Text>
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: `${Colors.secondary}20` }]}>
              <Wrench size={20} color={Colors.secondary} />
            </View>
            <Text style={typography.body}>Maintenance Schedules</Text>
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: `${Colors.warning}20` }]}>
              <LifeBuoy size={20} color={Colors.warning} />
            </View>
            <Text style={typography.body}>Safety Equipment</Text>
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </Card>
      
      <Card style={styles.settingsCard}>
        <Text style={[typography.h3, styles.settingsTitle]}>Account</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: Colors.background }]}>
              <User size={20} color={Colors.primary} />
            </View>
            <Text style={typography.body}>Account Information</Text>
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: `${Colors.secondary}20` }]}>
              <Shield size={20} color={Colors.secondary} />
            </View>
            <Text style={typography.body}>Privacy & Security</Text>
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </Card>
      
      <Card style={styles.settingsCard}>
        <Text style={[typography.h3, styles.settingsTitle]}>Support</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: `${Colors.success}20` }]}>
              <HelpCircle size={20} color={Colors.success} />
            </View>
            <Text style={typography.body}>Help & Support</Text>
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: `${Colors.warning}20` }]}>
              <Shield size={20} color={Colors.warning} />
            </View>
            <Text style={typography.body}>Terms & Privacy Policy</Text>
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </Card>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <LogOut size={20} color={Colors.accent} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.textPrimaryPrimaryPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  emailText: {
    color: Colors.textSecondary,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  editButtonText: {
    ...typography.buttonSmall,
    color: Colors.primary,
  },
  settingsCard: {
    marginBottom: 16,
  },
  settingsTitle: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textSecondary,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${Colors.accent}15`,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  logoutText: {
    ...typography.button,
    color: Colors.accent,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12, fontWeight: "400", lineHeight: 16, letterSpacing: 0.4,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});