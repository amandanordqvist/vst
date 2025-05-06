import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { 
  ChevronLeft, 
  Cloud, 
  Droplets, 
  Wind, 
  Thermometer, 
  Compass, 
  Sun, 
  CloudRain,
  Waves
} from 'lucide-react-native';
import { useWeatherStore } from '@/store/weather-store';

export default function WeatherForecastScreen() {
  const router = useRouter();
  const { weather, extendedForecast, isLoading, fetchWeather, fetchExtendedForecast } = useWeatherStore();
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      await Promise.all([
        fetchWeather(),
        fetchExtendedForecast()
      ]);
    } catch (error) {
      console.error('Error loading weather data:', error);
    }
  };
  
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun size={24} color={colors.warning} />;
      case 'partly cloudy':
        return <Cloud size={24} color={colors.gray} />;
      case 'cloudy':
        return <Cloud size={24} color={colors.gray} />;
      case 'rain':
      case 'showers':
        return <CloudRain size={24} color={colors.primary} />;
      default:
        return <Cloud size={24} color={colors.gray} />;
    }
  };
  
  const getDayName = (dateString: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Weather Forecast',
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
        <Card style={styles.currentWeatherCard}>
          <View style={styles.currentWeatherHeader}>
            <View>
              <Text style={typography.h2}>{weather.location}</Text>
              <Text style={styles.currentDate}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            <View style={styles.currentWeatherIcon}>
              {getWeatherIcon(weather.condition)}
            </View>
          </View>
          
          <View style={styles.currentWeatherInfo}>
            <Text style={styles.temperature}>{weather.temperature}°</Text>
            <Text style={styles.condition}>{weather.condition}</Text>
          </View>
          
          <View style={styles.weatherDetails}>
            <View style={styles.weatherDetailItem}>
              <Wind size={20} color={colors.gray} />
              <View style={styles.weatherDetailText}>
                <Text style={styles.weatherDetailLabel}>Wind</Text>
                <Text style={styles.weatherDetailValue}>{weather.windSpeed} knots</Text>
              </View>
            </View>
            
            <View style={styles.weatherDetailItem}>
              <Compass size={20} color={colors.gray} />
              <View style={styles.weatherDetailText}>
                <Text style={styles.weatherDetailLabel}>Direction</Text>
                <Text style={styles.weatherDetailValue}>{weather.windDirection}</Text>
              </View>
            </View>
            
            <View style={styles.weatherDetailItem}>
              <Droplets size={20} color={colors.gray} />
              <View style={styles.weatherDetailText}>
                <Text style={styles.weatherDetailLabel}>Humidity</Text>
                <Text style={styles.weatherDetailValue}>{weather.humidity}%</Text>
              </View>
            </View>
            
            <View style={styles.weatherDetailItem}>
              <Thermometer size={20} color={colors.gray} />
              <View style={styles.weatherDetailText}>
                <Text style={styles.weatherDetailLabel}>Feels Like</Text>
                <Text style={styles.weatherDetailValue}>{weather.feelsLike}°</Text>
              </View>
            </View>
          </View>
        </Card>
        
        <Card style={styles.marineConditionsCard}>
          <Text style={typography.h3}>Marine Conditions</Text>
          
          <View style={styles.marineConditionsGrid}>
            <View style={styles.marineConditionItem}>
              <Waves size={20} color={colors.primary} />
              <Text style={styles.marineConditionLabel}>Wave Height</Text>
              <Text style={styles.marineConditionValue}>{weather.waveHeight} ft</Text>
            </View>
            
            <View style={styles.marineConditionItem}>
              <Compass size={20} color={colors.primary} />
              <Text style={styles.marineConditionLabel}>Wave Direction</Text>
              <Text style={styles.marineConditionValue}>{weather.waveDirection}</Text>
            </View>
            
            <View style={styles.marineConditionItem}>
              <Wind size={20} color={colors.primary} />
              <Text style={styles.marineConditionLabel}>Wind Gusts</Text>
              <Text style={styles.marineConditionValue}>{weather.windGusts} knots</Text>
            </View>
            
            <View style={styles.marineConditionItem}>
              <Cloud size={20} color={colors.primary} />
              <Text style={styles.marineConditionLabel}>Visibility</Text>
              <Text style={styles.marineConditionValue}>{weather.visibility} nm</Text>
            </View>
          </View>
          
          <View style={styles.advisoryContainer}>
            <Text style={typography.subtitle}>Marine Advisories</Text>
            {weather.advisories && weather.advisories.length > 0 ? (
              weather.advisories.map((advisory, index) => (
                <View key={index} style={styles.advisoryItem}>
                  <View style={styles.advisoryDot} />
                  <Text style={styles.advisoryText}>{advisory}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noAdvisoryText}>No active advisories</Text>
            )}
          </View>
        </Card>
        
        <Text style={[typography.h3, styles.forecastTitle]}>7-Day Forecast</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.forecastScrollContent}
        >
          {extendedForecast.map((day, index) => (
            <Card key={index} style={styles.forecastCard}>
              <Text style={styles.forecastDay}>{getDayName(day.date)}</Text>
              <Text style={styles.forecastDate}>
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
              
              <View style={styles.forecastIconContainer}>
                {getWeatherIcon(day.condition)}
              </View>
              
              <Text style={styles.forecastTemp}>{day.highTemp}° / {day.lowTemp}°</Text>
              <Text style={styles.forecastCondition}>{day.condition}</Text>
              
              <View style={styles.forecastDetail}>
                <Wind size={16} color={colors.gray} />
                <Text style={styles.forecastDetailText}>{day.windSpeed} knots</Text>
              </View>
              
              <View style={styles.forecastDetail}>
                <Droplets size={16} color={colors.gray} />
                <Text style={styles.forecastDetailText}>{day.precipitation}%</Text>
              </View>
            </Card>
          ))}
        </ScrollView>
        
        <Card style={styles.tideCard}>
          <Text style={typography.h3}>Tide Information</Text>
          
          <View style={styles.tideHeader}>
            <Text style={typography.subtitle}>{weather.location} Harbor</Text>
            <Text style={styles.tideDate}>
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </Text>
          </View>
          
          <View style={styles.tideChart}>
            <View style={styles.tideLine} />
            
            {weather.tides && weather.tides.map((tide, index) => (
              <View 
                key={index} 
                style={[
                  styles.tidePoint,
                  { 
                    left: `${(index / (weather.tides?.length || 1) - 1) * 100}%`,
                    bottom: tide.type === 'high' ? '70%' : '20%'
                  }
                ]}
              >
                <View style={styles.tidePointDot} />
                <Text style={styles.tideTime}>{tide.time}</Text>
                <Text style={styles.tideHeight}>{tide.height} ft</Text>
                <Text style={styles.tideType}>{tide.type}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.sunInfo}>
            <View style={styles.sunInfoItem}>
              <Sun size={20} color={colors.warning} />
              <View>
                <Text style={styles.sunInfoLabel}>Sunrise</Text>
                <Text style={styles.sunInfoValue}>{weather.sunrise}</Text>
              </View>
            </View>
            
            <View style={styles.sunInfoItem}>
              <Sun size={20} color={colors.error} />
              <View>
                <Text style={styles.sunInfoLabel}>Sunset</Text>
                <Text style={styles.sunInfoValue}>{weather.sunset}</Text>
              </View>
            </View>
          </View>
        </Card>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  headerButton: {
    padding: 8,
  },
  currentWeatherCard: {
    marginBottom: 16,
  },
  currentWeatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  currentDate: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  currentWeatherIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentWeatherInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  temperature: {
    ...typography.h1,
    fontSize: 64,
    fontWeight: '300',
  },
  condition: {
    ...typography.subtitle,
    color: colors.textSecondary,
  },
  weatherDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  weatherDetailItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherDetailText: {
    marginLeft: 8,
  },
  weatherDetailLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  weatherDetailValue: {
    ...typography.body,
    fontWeight: '500',
  },
  marineConditionsCard: {
    marginBottom: 16,
  },
  marineConditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  marineConditionItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 16,
  },
  marineConditionLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
  },
  marineConditionValue: {
    ...typography.body,
    fontWeight: '600',
  },
  advisoryContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  advisoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  advisoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    marginRight: 8,
  },
  advisoryText: {
    ...typography.body,
    flex: 1,
  },
  noAdvisoryText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 8,
  },
  forecastTitle: {
    marginTop: 8,
    marginBottom: 12,
  },
  forecastScrollContent: {
    paddingRight: 16,
  },
  forecastCard: {
    width: 120,
    marginRight: 12,
    alignItems: 'center',
  },
  forecastDay: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  forecastDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  forecastIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  forecastTemp: {
    ...typography.body,
    fontWeight: '600',
  },
  forecastCondition: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  forecastDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  forecastDetailText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  tideCard: {
    marginTop: 16,
  },
  tideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  tideDate: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  tideChart: {
    height: 120,
    position: 'relative',
    marginBottom: 24,
  },
  tideLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 2,
    backgroundColor: colors.border,
  },
  tidePoint: {
    position: 'absolute',
    alignItems: 'center',
    width: 40,
    marginLeft: -20,
  },
  tidePointDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  tideTime: {
    ...typography.caption,
    marginTop: 4,
  },
  tideHeight: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  tideType: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sunInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  sunInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sunInfoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  sunInfoValue: {
    ...typography.body,
    fontWeight: '500',
    marginLeft: 8,
  },
});