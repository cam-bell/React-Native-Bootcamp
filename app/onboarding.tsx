import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { router, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CountryPicker } from './components/CountryPicker';

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerShown: false,
    });
  }, [navigation]);

  const handleComplete = async () => {
    if (name.trim() && country.trim()) {
      await AsyncStorage.setItem('userName', name.trim());
      await AsyncStorage.setItem('userCountry', country.trim());
      await AsyncStorage.setItem('onboardingComplete', 'true');
      router.replace('/(tabs)');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to TravelPack</Text>
          <Text style={styles.subtitle}>Let's get to know you better</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#666"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Country</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowCountryPicker(true)}
              >
                <Text style={country ? styles.countryText : styles.placeholder}>
                  {country || 'Select your country'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (!name.trim() || !country.trim()) && styles.buttonDisabled
            ]}
            onPress={handleComplete}
            disabled={!name.trim() || !country.trim()}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          <CountryPicker
            isVisible={showCountryPicker}
            onClose={() => setShowCountryPicker(false)}
            onSelect={setCountry}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    color: '#666666',
    marginBottom: 48,
  },
  form: {
    gap: 24,
    marginBottom: 48,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    color: '#000000',
    justifyContent: 'center',
  },
  countryText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#000000',
  },
  placeholder: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#666666',
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
});