import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { Card } from './Card';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { Wind, Droplets, AlertTriangle } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withDelay,
  Easing
} from 'react-native-reanimated';

interface WeatherCardProps {
  temperature: string;
  condition: string;
  iconUrl: string;
  windSpeed: string;
  windDirection: string;
  waveHeight: string;
  precipitation: string;
  onPress?: () => void;
}

export function WeatherCard({
  temperature,
  condition,
  iconUrl,
  windSpeed,
  windDirection,
  waveHeight,
  precipitation,
  onPress,
}: WeatherCardProps) {
  // Animation values
  const iconRotate = useSharedValue(0);
  const precipitationOpacity = useSharedValue(1);
  
  // Initialize animations
  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      // Subtle wind icon rotation
      iconRotate.value = withRepeat(
        withTiming(10, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      
      // Pulse effect for precipitation warning
      if (precipitation.includes('advisories')) {
        precipitationOpacity.value = withRepeat(
          withTiming(0.7, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          -1,
          true
        );
      }
    }
  }, []);
  
  // Define animated styles
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${iconRotate.value}deg` }],
    };
  });
  
  const precipitationAnimatedStyle = useAnimatedStyle(() => {
    if (precipitation.includes('advisories')) {
      return {
        opacity: precipitationOpacity.value,
      };
    }
    return {};
  });
  
  // Use regular View for web
  if (Platform.OS === 'web') {
    return (
      <Card onPress={onPress} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperature}>{temperature}</Text>
            <Text style={styles.condition}>{condition}</Text>
          </View>
          <Image 
            source={{ uri: iconUrl }} 
            style={styles.weatherIcon}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Wind size={18} color={colors.secondary} />
            </View>
            <View>
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>{windSpeed}</Text>
              <Text style={styles.detailSubvalue}>{windDirection}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Droplets size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.detailLabel}>Waves</Text>
              <Text style={styles.detailValue}>{waveHeight}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <View style={[
              styles.detailIcon,
              precipitation.includes('advisories') ? styles.warningIcon : null
            ]}>
              <AlertTriangle 
                size={18} 
                color={precipitation.includes('advisories') ? colors.warning : colors.gray} 
              />
            </View>
            <View>
              <Text style={styles.detailLabel}>Advisories</Text>
              <Text style={[
                styles.detailValue,
                precipitation.includes('advisories') ? styles.warningText : null
              ]}>
                {precipitation}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    );
  }
  
  // Use Animated.View for native platforms
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.temperatureContainer}>
          <Text style={styles.temperature}>{temperature}</Text>
          <Text style={styles.condition}>{condition}</Text>
        </View>
        <Image 
          source={{ uri: iconUrl }} 
          style={styles.weatherIcon}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Animated.View style={[styles.detailIcon, iconAnimatedStyle]}>
            <Wind size={18} color={colors.secondary} />
          </Animated.View>
          <View>
            <Text style={styles.detailLabel}>Wind</Text>
            <Text style={styles.detailValue}>{windSpeed}</Text>
            <Text style={styles.detailSubvalue}>{windDirection}</Text>
          </View>
        </View>
        
        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <Droplets size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.detailLabel}>Waves</Text>
            <Text style={styles.detailValue}>{waveHeight}</Text>
          </View>
        </View>
        
        <View style={styles.detailItem}>
          <Animated.View style={[
            styles.detailIcon,
            precipitation.includes('advisories') ? styles.warningIcon : null,
            precipitation.includes('advisories') ? precipitationAnimatedStyle : null
          ]}>
            <AlertTriangle 
              size={18} 
              color={precipitation.includes('advisories') ? colors.warning : colors.gray} 
            />
          </Animated.View>
          <View>
            <Text style={styles.detailLabel}>Advisories</Text>
            <Animated.Text style={[
              styles.detailValue,
              precipitation.includes('advisories') ? styles.warningText : null,
              precipitation.includes('advisories') ? precipitationAnimatedStyle : null
            ]}>
              {precipitation}
            </Animated.Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    ...typography.h1,
    fontSize: 36,
    fontWeight: '700',
  },
  condition: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  warningIcon: {
    backgroundColor: `${colors.warning}20`,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.bodyMedium,
    fontWeight: '600',
    marginTop: 2,
  },
  detailSubvalue: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  warningText: {
    color: colors.warning,
  },
});