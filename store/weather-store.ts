import { create } from 'zustand';
import { weatherData, extendedForecastData } from '@/mocks/weather';

interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  windGusts: number;
  visibility: number;
  waveHeight: number;
  waveDirection: string;
  sunrise: string;
  sunset: string;
  advisories?: string[];
  tides?: {
    time: string;
    height: number;
    type: 'high' | 'low';
  }[];
}

interface ForecastDay {
  date: string;
  highTemp: number;
  lowTemp: number;
  condition: string;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  waveHeight: number;
}

interface WeatherState {
  weather: WeatherData;
  extendedForecast: ForecastDay[];
  isLoading: boolean;
  error: string | null;
  
  fetchWeather: () => Promise<void>;
  fetchExtendedForecast: () => Promise<void>;
}

// Ensure the mock data conforms to our type definitions
const typedWeatherData: WeatherData = {
  ...weatherData,
  tides: weatherData.tides?.map(tide => ({
    ...tide,
    type: tide.type as 'high' | 'low'
  }))
};

export const useWeatherStore = create<WeatherState>((set) => ({
  weather: typedWeatherData,
  extendedForecast: extendedForecastData,
  isLoading: false,
  error: null,
  
  fetchWeather: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Ensure the tides property is properly typed
      const weatherWithTypedTides: WeatherData = {
        ...weatherData,
        tides: weatherData.tides?.map(tide => ({
          ...tide,
          type: tide.type as 'high' | 'low'
        }))
      };
      
      set({
        weather: weatherWithTypedTides,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch weather data',
        isLoading: false,
      });
    }
  },
  
  fetchExtendedForecast: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({
        extendedForecast: extendedForecastData,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch forecast data',
        isLoading: false,
      });
    }
  },
}));