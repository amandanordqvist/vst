import { WeatherData } from '@/store/weather-store';

// Weather data mock
export const weatherData = {
  location: 'Marina Bay',
  temperature: 78,
  feelsLike: 80,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  windDirection: 'NE',
  windGusts: 18,
  visibility: 10,
  waveHeight: 2.5,
  waveDirection: 'SE',
  sunrise: '6:45 AM',
  sunset: '7:30 PM',
  advisories: [
    'Small Craft Advisory in effect until 8:00 PM',
    'High Surf Advisory for coastal areas'
  ],
  tides: [
    { time: '4:30 AM', height: 0.5, type: 'low' },
    { time: '10:45 AM', height: 3.2, type: 'high' },
    { time: '5:15 PM', height: 0.7, type: 'low' },
    { time: '11:30 PM', height: 2.8, type: 'high' }
  ]
};

// Extended forecast mock
export const extendedForecastData = [
  {
    date: '2023-08-15',
    highTemp: 82,
    lowTemp: 68,
    condition: 'Sunny',
    windSpeed: 10,
    windDirection: 'NE',
    precipitation: 0,
    waveHeight: 2.0
  },
  {
    date: '2023-08-16',
    highTemp: 80,
    lowTemp: 70,
    condition: 'Partly Cloudy',
    windSpeed: 12,
    windDirection: 'E',
    precipitation: 10,
    waveHeight: 2.5
  },
  {
    date: '2023-08-17',
    highTemp: 79,
    lowTemp: 71,
    condition: 'Cloudy',
    windSpeed: 15,
    windDirection: 'SE',
    precipitation: 30,
    waveHeight: 3.0
  },
  {
    date: '2023-08-18',
    highTemp: 77,
    lowTemp: 69,
    condition: 'Rain',
    windSpeed: 18,
    windDirection: 'S',
    precipitation: 80,
    waveHeight: 3.5
  },
  {
    date: '2023-08-19',
    highTemp: 75,
    lowTemp: 68,
    condition: 'Showers',
    windSpeed: 14,
    windDirection: 'SW',
    precipitation: 60,
    waveHeight: 3.0
  },
  {
    date: '2023-08-20',
    highTemp: 78,
    lowTemp: 67,
    condition: 'Partly Cloudy',
    windSpeed: 10,
    windDirection: 'W',
    precipitation: 20,
    waveHeight: 2.5
  },
  {
    date: '2023-08-21',
    highTemp: 81,
    lowTemp: 69,
    condition: 'Sunny',
    windSpeed: 8,
    windDirection: 'NW',
    precipitation: 0,
    waveHeight: 2.0
  }
];