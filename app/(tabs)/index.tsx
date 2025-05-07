import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import Card from '@/components/Card';
import StatusBadge from '@/components/StatusBadge';
import ProgressBar from '@/components/ProgressBar';
import VesselCard from '@/components/VesselCard';
import WeatherCard from '@/components/WeatherCard';
import MaintenanceItem from '@/components/MaintenanceItem';
import { typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';
import { 
  Bell, 
  Calendar, 
  ChevronRight, 
  Clipboard, 
  Clock, 
  BarChart3, 
  Anchor,
  AlertTriangle
} from 'lucide-react-native';
import { useVesselStore } from '@/store/vessel-store';
import { useMaintenanceStore } from '@/store/maintenance-store';
import { useChecklistStore } from '@/store/checklist-store';
import { useTripLogStore } from '@/store/trip-log-store';
import { useWeatherStore } from '@/store/weather-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';

// Animated section component for staggered animations
const AnimatedSection = ({ 
  children, 
  index = 0, 
  style 
}: { 
  children: React.ReactNode, 
  index?: number, 
  style?: any 
}) => {
  if (Platform.OS === 'web') {
    return <View style={style}>{children}</View>;
  }
  
  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).duration(600).springify()} 
      style={style}
    >
      {children}
    </Animated.View>
  );
};

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { vessels, isLoading: vesselsLoading, fetchVessels } = useVesselStore();
  const { items: maintenanceItems, isLoading: maintenanceLoading, fetchMaintenanceItems } = useMaintenanceStore();
  const { checklists, isLoading: checklistsLoading, fetchChecklists } = useChecklistStore();
  const { trips, isLoading: tripsLoading, fetchTrips } = useTripLogStore();
  const { weather, isLoading: weatherLoading, fetchWeather } = useWeatherStore();
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const notificationScale = useSharedValue(1);
  
  useEffect(() => {
    loadData();
    
    if (Platform.OS !== 'web') {
      headerOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
    } else {
      headerOpacity.value = 1;
    }
  }, []);
  
  // Notification badge animation
  useEffect(() => {
    if (Platform.OS !== 'web' && criticalItems.length > 0) {
      notificationScale.value = withSequence(
        withTiming(1.3, { duration: 300, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) })
      );
    }
  }, [maintenanceItems]);
  
  // Define animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });
  
  const notificationAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: notificationScale.value }],
    };
  });
  
  const loadData = async () => {
    try {
      await Promise.all([
        fetchVessels(),
        fetchMaintenanceItems(),
        fetchChecklists(),
        fetchTrips(),
        fetchWeather()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  // Calculate upcoming maintenance
  const upcomingMaintenance = maintenanceItems
    .filter(item => item.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 2);
  
  // Calculate checklist completion
  const preDepartureCompletion = checklists.preDeparture.length > 0
    ? checklists.preDeparture.filter(item => item.isCompleted).length / checklists.preDeparture.length
    : 0;
  
  const postTripCompletion = checklists.postTrip.length > 0
    ? checklists.postTrip.filter(item => item.isCompleted).length / checklists.postTrip.length
    : 0;
  
  // Get recent trips
  const recentTrips = trips
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);
  
  // Calculate total fuel consumption
  const totalFuelUsed = trips.reduce((total, trip) => total + (trip.fuelUsed || 0), 0);
  
  // Calculate total distance traveled
  const totalDistance = trips.reduce((total, trip) => total + (trip.distance || 0), 0);
  
  // Calculate average fuel efficiency
  const avgFuelEfficiency = totalDistance > 0 ? totalFuelUsed / totalDistance : 0;
  
  // Get active vessel
  const activeVessel = vessels.length > 0 ? vessels[0] : null;
  
  // Get critical maintenance items
  const criticalItems = maintenanceItems.filter(item => item.priority === 'critical' && item.status !== 'completed');
  
  // Format weather data for the WeatherCard component
  const weatherCardData = weather ? {
    temperature: `${weather.temperature}°`,
    condition: weather.condition,
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png', // Placeholder icon
    windSpeed: `${weather.windSpeed} knots`,
    windDirection: weather.windDirection,
    waveHeight: `${weather.waveHeight} ft`,
    precipitation: weather.advisories && weather.advisories.length > 0 ? 'Active advisories' : 'No advisories'
  } : null;
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 16 }
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {Platform.OS === 'web' ? (
        <View style={styles.header}>
          <Text style={typography.h2}>Dashboard</Text>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={24} color={Colors.textPrimary} />
            {criticalItems.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{criticalItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <Text style={typography.h2}>Dashboard</Text>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={24} color={Colors.textPrimary} />
            {criticalItems.length > 0 && (
              <Animated.View style={[styles.notificationBadge, notificationAnimatedStyle]}>
                <Text style={styles.notificationCount}>{criticalItems.length}</Text>
              </Animated.View>
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
      
      {activeVessel && (
        <AnimatedSection index={0}>
          <VesselCard 
            vessel={activeVessel}
            onPress={() => router.push(`/vessel-details?id=${activeVessel.id}`)}
          />
        </AnimatedSection>
      )}
      
      {weatherCardData && (
        <AnimatedSection index={1}>
          <WeatherCard 
            temperature={weatherCardData.temperature}
            condition={weatherCardData.condition}
            iconUrl={weatherCardData.iconUrl}
            windSpeed={weatherCardData.windSpeed}
            windDirection={weatherCardData.windDirection}
            waveHeight={weatherCardData.waveHeight}
            precipitation={weatherCardData.precipitation}
            onPress={() => router.push('/weather-forecast')}
          />
        </AnimatedSection>
      )}
      
      <AnimatedSection index={2} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={typography.h3}>Checklists</Text>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => router.push('/(tabs)/checklists')}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        <Card style={styles.checklistCard}>
          <View style={styles.checklistItem}>
            <View style={styles.checklistIcon}>
              <Clipboard size={20} color={Colors.primary} />
            </View>
            <View style={styles.checklistContent}>
              <Text style={typography.subtitle}>Pre-Departure</Text>
              <View style={styles.progressContainer}>
                <ProgressBar 
                  progress={preDepartureCompletion}
                  progressColor={Colors.primary}
                  height={6}
                  animationDelay={500}
                />
                <Text style={styles.progressText}>
                  {Math.round(preDepartureCompletion * 100)}% Complete
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.checklistItem}>
            <View style={styles.checklistIcon}>
              <Anchor size={20} color={Colors.primary} />
            </View>
            <View style={styles.checklistContent}>
              <Text style={typography.subtitle}>Post-Trip</Text>
              <View style={styles.progressContainer}>
                <ProgressBar 
                  progress={postTripCompletion}
                  progressColor={Colors.primary}
                  height={6}
                  animationDelay={700}
                />
                <Text style={styles.progressText}>
                  {Math.round(postTripCompletion * 100)}% Complete
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </AnimatedSection>
      
      <AnimatedSection index={3} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={typography.h3}>Upcoming Maintenance</Text>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => router.push('/(tabs)/maintenance')}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        {upcomingMaintenance.length > 0 ? (
          upcomingMaintenance.map((item, index) => (
            <MaintenanceItem
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              dueDate={item.dueDate}
              priority={item.priority}
              status={item.status}
              estimatedTime={item.estimatedTime}
              onPress={(id) => router.push(`/maintenance-details?id=${id}`)}
            />
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No upcoming maintenance tasks</Text>
          </Card>
        )}
      </AnimatedSection>
      
      <AnimatedSection index={4} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={typography.h3}>Recent Trips</Text>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => router.push('/trip-logs')}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        {recentTrips.length > 0 ? (
          recentTrips.map((trip, index) => (
            <Card 
              key={trip.id} 
              style={styles.tripCard}
              onPress={() => router.push(`/trip-details?id=${trip.id}`)}
            >
              <Text style={typography.subtitle}>{trip.title}</Text>
              <View style={styles.tripMeta}>
                <View style={styles.tripMetaItem}>
                  <Calendar size={16} color={Colors.textSecondary} />
                  <Text style={styles.tripMetaText}>{trip.date}</Text>
                </View>
                <View style={styles.tripMetaItem}>
                  <Clock size={16} color={Colors.textSecondary} />
                  <Text style={styles.tripMetaText}>{trip.duration}</Text>
                </View>
              </View>
              <View style={styles.tripDetails}>
                <View style={styles.tripDetail}>
                  <Text style={styles.tripDetailLabel}>Distance</Text>
                  <Text style={styles.tripDetailValue}>{trip.distance} nm</Text>
                </View>
                <View style={styles.tripDetail}>
                  <Text style={styles.tripDetailLabel}>Fuel Used</Text>
                  <Text style={styles.tripDetailValue}>{trip.fuelUsed} gal</Text>
                </View>
              </View>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No recent trips recorded</Text>
          </Card>
        )}
      </AnimatedSection>
      
      <AnimatedSection index={5} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={typography.h3}>Analytics</Text>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => router.push('/(tabs)/reports')}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        <Card style={styles.analyticsCard}>
          <View style={styles.analyticsHeader}>
            <BarChart3 size={24} color={Colors.primary} />
            <Text style={[typography.subtitle, { marginLeft: 12 }]}>Performance Summary</Text>
          </View>
          
          <View style={styles.analyticsGrid}>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>Total Distance</Text>
              <Text style={styles.analyticsValue}>{totalDistance.toFixed(1)} nm</Text>
            </View>
            
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>Total Fuel</Text>
              <Text style={styles.analyticsValue}>{totalFuelUsed.toFixed(1)} gal</Text>
            </View>
            
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>Avg. Efficiency</Text>
              <Text style={styles.analyticsValue}>
                {avgFuelEfficiency > 0 ? avgFuelEfficiency.toFixed(2) : 'N/A'} gal/nm
              </Text>
            </View>
            
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>Total Trips</Text>
              <Text style={styles.analyticsValue}>{trips.length}</Text>
            </View>
          </View>
        </Card>
      </AnimatedSection>
      
      {criticalItems.length > 0 && (
        <AnimatedSection index={6}>
          <Card style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <AlertTriangle size={24} color={Colors.accent} />
              <Text style={styles.alertTitle}>Critical Alerts</Text>
            </View>
            
            {criticalItems.map(item => (
              <TouchableOpacity 
                key={item.id}
                style={styles.alertItem}
                onPress={() => router.push(`/maintenance-details?id=${item.id}`)}
              >
                <StatusBadge status={item.priority} />
                <Text style={styles.alertText} numberOfLines={1}>
                  {item.title} - Due {item.dueDate}
                </Text>
                <ChevronRight size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </Card>
        </AnimatedSection>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  notificationCount: {
    fontSize: 12, fontWeight: "400", lineHeight: 16, letterSpacing: 0.4,
    color: Colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
  section: {
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  seeAllText: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    color: Colors.primary,
    fontWeight: "600",
    marginRight: 4,
  },
  checklistCard: {
    padding: 0,
    overflow: 'hidden',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  checklistIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  checklistContent: {
    flex: 1,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressText: {
    fontSize: 12, fontWeight: "400", lineHeight: 16, letterSpacing: 0.4,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.textSecondary,
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    color: Colors.textSecondary,
  },
  tripCard: {
    marginBottom: 12,
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
    marginLeft: 6,
  },
  tripDetails: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.textSecondary,
  },
  tripDetail: {
    flex: 1,
  },
  tripDetailLabel: {
    fontSize: 12, fontWeight: "400", lineHeight: 16, letterSpacing: 0.4,
    color: Colors.textSecondary,
  },
  tripDetailValue: {
    fontSize: 16, fontWeight: "600", lineHeight: 24, letterSpacing: 0.15,
    marginTop: 4,
  },
  analyticsCard: {
    marginBottom: 12,
  },
  analyticsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  analyticsItem: {
    width: '50%',
    marginBottom: 20,
  },
  analyticsLabel: {
    fontSize: 12, fontWeight: "400", lineHeight: 16, letterSpacing: 0.4,
    color: Colors.textSecondary,
  },
  analyticsValue: {
    fontSize: 16, fontWeight: "600", lineHeight: 24, letterSpacing: 0.15,
    marginTop: 4,
  },
  alertCard: {
    marginTop: 28,
    backgroundColor: `${Colors.accent}08`,
    borderWidth: 1,
    borderColor: `${Colors.accent}20`,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 18, fontWeight: "600", lineHeight: 26, letterSpacing: 0.15,
    color: Colors.accent,
    marginLeft: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: `${Colors.accent}20`,
  },
  alertText: {
    fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15,
    flex: 1,
    marginHorizontal: 12,
  },
});