import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      checkInitialRoute();
    }
  }, [fontsLoaded]);

  const checkInitialRoute = async () => {
    try {
      const hasCompletedOnboarding = await AsyncStorage.getItem('onboardingComplete');
      if (hasCompletedOnboarding === 'true') {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error checking initial route:', error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen 
          name="index"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="onboarding"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="(tabs)"
          options={{
            gestureEnabled: false,
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}