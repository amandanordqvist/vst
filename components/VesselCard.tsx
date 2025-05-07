import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, TextStyle } from 'react-native';
import Card from './Card';
import StatusBadge from './StatusBadge';
import { typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';
import { Anchor, Droplets, Fuel, Navigation } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';

// Convert typography styles to comply with TextStyle requirements
const typographyStyles = {
  h3: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight as TextStyle['fontWeight'],
    color: typography.h3.color,
    letterSpacing: typography.h3.letterSpacing,
    lineHeight: typography.h3.lineHeight,
  },
  bodySmall: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.bodySmall.fontWeight as TextStyle['fontWeight'],
    color: typography.bodySmall.color,
    letterSpacing: typography.bodySmall.letterSpacing,
    lineHeight: typography.bodySmall.lineHeight,
  }
};

interface VesselCardProps {
  vessel: {
    id: string;
    name: string;
    model: string;
    imageUrl: string;
    status: 'good' | 'warning' | 'critical' | 'neutral';
    fuelLevel: number;
    engineHours: number;
    lastMaintenance: string;
  };
  onPress: () => void;
}

export default function VesselCard({ vessel, onPress }: VesselCardProps) {
  // Animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  
  // Initialize animations
  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) });
      translateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) });
    } else {
      opacity.value = 1;
      translateY.value = 0;
    }
  }, []);
  
  // Define animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });
  
  // Calculate fuel level percentage
  const fuelLevelPercentage = Math.min(Math.max(vessel.fuelLevel, 0), 100);
  
  // Determine fuel level color
  const getFuelLevelColor = () => {
    if (fuelLevelPercentage > 60) return Colors.success;
    if (fuelLevelPercentage > 30) return Colors.warning;
    return Colors.error;
  };
  
  // Use regular View for web
  if (Platform.OS === 'web') {
    return (
      <Card onPress={onPress} style={styles.card} variant="elevated">
        <View style={styles.header}>
          <View>
            <Text style={typographyStyles.h3}>{vessel.name}</Text>
            <Text style={[typographyStyles.bodySmall, styles.model]}>{vessel.model}</Text>
          </View>
          <StatusBadge status={vessel.status} label={vessel.status} />
        </View>
        
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: vessel.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Fuel size={18} color={getFuelLevelColor()} />
            </View>
            <View>
              <Text style={styles.statLabel}>Fuel Level</Text>
              <Text style={styles.statValue}>{fuelLevelPercentage}%</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Navigation size={18} color={Colors.secondary} />
            </View>
            <View>
              <Text style={styles.statLabel}>Engine Hours</Text>
              <Text style={styles.statValue}>{vessel.engineHours}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Anchor size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.statLabel}>Last Maintenance</Text>
              <Text style={styles.statValue}>{vessel.lastMaintenance}</Text>
            </View>
          </View>
        </View>
      </Card>
    );
  }
  
  // Use Animated.View for native platforms
  return (
    <Animated.View style={animatedStyle}>
      <Card onPress={onPress} style={styles.card} variant="elevated">
        <View style={styles.header}>
          <View>
            <Text style={typographyStyles.h3}>{vessel.name}</Text>
            <Text style={[typographyStyles.bodySmall, styles.model]}>{vessel.model}</Text>
          </View>
          <StatusBadge status={vessel.status} label={vessel.status} />
        </View>
        
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: vessel.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${getFuelLevelColor()}20` }]}>
              <Fuel size={18} color={getFuelLevelColor()} />
            </View>
            <View>
              <Text style={styles.statLabel}>Fuel Level</Text>
              <Text style={styles.statValue}>{fuelLevelPercentage}%</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${Colors.secondary}20` }]}>
              <Navigation size={18} color={Colors.secondary} />
            </View>
            <View>
              <Text style={styles.statLabel}>Engine Hours</Text>
              <Text style={styles.statValue}>{vessel.engineHours}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${Colors.primary}20` }]}>
              <Anchor size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.statLabel}>Last Maintenance</Text>
              <Text style={styles.statValue}>{vessel.lastMaintenance}</Text>
            </View>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 16,
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  model: {
    color: Colors.textSecondary,
    marginTop: 4,
  },
  imageContainer: {
    width: '100%',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statLabel: {
    fontSize: 12, 
    fontWeight: "400" as TextStyle['fontWeight'], 
    lineHeight: 16, 
    letterSpacing: 0.4,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24, 
    letterSpacing: 0.15,
  },
});