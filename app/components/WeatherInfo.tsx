import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Cloud, CloudRain, Sun, Snowflake, CloudLightning, Wind, Droplets, ChevronDown, ChevronUp } from 'lucide-react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// API configuration
const API_KEY = "bd5e378503939ddaee76f12ad7a97608";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

interface WeatherInfoProps {
  destination: string;
}

interface WeatherRecommendation {
  clothing: string[];
  advice: string;
}

export function WeatherInfo({ destination }: WeatherInfoProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (destination) {
      fetchWeather();
    }
  }, [destination]);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(destination)}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError('Could not load weather information');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weatherId: number) => {
    if (weatherId >= 200 && weatherId < 300) {
      return <CloudLightning size={24} color="#666666" />;
    } else if (weatherId >= 300 && weatherId < 600) {
      return <CloudRain size={24} color="#666666" />;
    } else if (weatherId >= 600 && weatherId < 700) {
      return <Snowflake size={24} color="#666666" />;
    } else if (weatherId >= 801 && weatherId < 900) {
      return <Cloud size={24} color="#666666" />;
    }
    return <Sun size={24} color="#666666" />;
  };

  const getWeatherRecommendations = (temp: number, weatherId: number, humidity: number): WeatherRecommendation => {
    const recommendations: WeatherRecommendation = {
      clothing: [],
      advice: '',
    };

    // Temperature-based recommendations
    if (temp <= 0) {
      recommendations.clothing = ['Heavy winter coat', 'Thermal layers', 'Winter boots', 'Gloves', 'Scarf', 'Winter hat'];
      recommendations.advice = 'Very cold conditions. Layer up well and protect extremities.';
    } else if (temp <= 10) {
      recommendations.clothing = ['Warm coat', 'Sweater', 'Long pants', 'Closed shoes', 'Light gloves'];
      recommendations.advice = 'Cool weather. Bring warm layers that you can remove if needed.';
    } else if (temp <= 20) {
      recommendations.clothing = ['Light jacket', 'Long sleeve shirts', 'Pants', 'Comfortable shoes'];
      recommendations.advice = 'Mild temperatures. Pack versatile clothing that can be layered.';
    } else if (temp <= 30) {
      recommendations.clothing = ['T-shirts', 'Shorts', 'Light clothing', 'Sun hat', 'Sunglasses'];
      recommendations.advice = 'Warm weather. Pack light, breathable clothing and sun protection.';
    } else {
      recommendations.clothing = ['Very light clothing', 'Breathable fabrics', 'Sun hat', 'Sunglasses'];
      recommendations.advice = 'Hot weather. Focus on sun protection and staying cool.';
    }

    // Weather condition specific additions
    if (weatherId >= 200 && weatherId < 600) {
      recommendations.clothing.push('Rain jacket', 'Waterproof shoes');
      recommendations.advice += ' Prepare for rain with waterproof gear.';
    } else if (weatherId >= 600 && weatherId < 700) {
      recommendations.clothing.push('Waterproof boots', 'Snow gear');
      recommendations.advice += ' Expect snow conditions.';
    }

    if (humidity > 80) {
      recommendations.advice += ' High humidity, pack moisture-wicking clothing.';
    }

    return recommendations;
  };

  if (!destination) return null;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.weatherCard}>
          <ActivityIndicator size="small" color="#666666" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.weatherCard}>
          <Text style={styles.error}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!weather) return null;

  const recommendations = getWeatherRecommendations(
    weather.main.temp,
    weather.weather[0].id,
    weather.main.humidity
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.weatherCard}
        onPress={toggleExpand}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <View style={styles.mainWeather}>
            {getWeatherIcon(weather.weather[0].id)}
            <View style={styles.weatherInfo}>
              <Text style={styles.temperature}>
                {Math.round(weather.main.temp)}°C
              </Text>
              <Text style={styles.condition}>
                {weather.weather[0].description}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.expandButton}
            onPress={toggleExpand}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isExpanded ? (
              <ChevronUp size={20} color="#000000" />
            ) : (
              <ChevronDown size={20} color="#000000" />
            )}
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <>
            <View style={styles.detailsContainer}>
              <View style={styles.weatherDetail}>
                <Wind size={16} color="#666666" />
                <Text style={styles.detailText}>
                  {Math.round(weather.wind.speed)} m/s
                </Text>
              </View>
              <View style={styles.weatherDetail}>
                <Droplets size={16} color="#666666" />
                <Text style={styles.detailText}>
                  {weather.main.humidity}%
                </Text>
              </View>
            </View>

            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationTitle}>What to Pack</Text>
              <Text style={styles.recommendationAdvice}>{recommendations.advice}</Text>
              <View style={styles.clothingList}>
                {recommendations.clothing.map((item, index) => (
                  <Text key={index} style={styles.clothingItem}>• {item}</Text>
                ))}
              </View>
            </View>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  weatherCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  weatherInfo: {
    flex: 1,
  },
  temperature: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#000000',
  },
  condition: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  expandButton: {
    width: 32,
    height: 32,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666666',
  },
  recommendationsContainer: {
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  recommendationTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  recommendationAdvice: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  clothingList: {
    gap: 4,
  },
  clothingItem: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#000000',
  },
  error: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#ff4444',
    textAlign: 'center',
  },
});