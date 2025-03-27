import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { DatePicker } from '../components/DatePicker';
import { format } from 'date-fns';

export default function NewTripScreen() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCreate = async () => {
    if (destination.trim() && startDate) {
      const tripsData = await AsyncStorage.getItem('trips');
      const trips = tripsData ? JSON.parse(tripsData) : [];
      
      const newTrip = {
        id: Date.now().toString(),
        destination: destination.trim(),
        startDate: startDate,
        items: [],
      };
      
      trips.push(newTrip);
      await AsyncStorage.setItem('trips', JSON.stringify(trips));
      router.replace('/(tabs)');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.title}>New Trip</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Destination</Text>
            <TextInput
              style={styles.input}
              value={destination}
              onChangeText={setDestination}
              placeholder="Where are you going?"
              placeholderTextColor="#666"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={startDate ? styles.dateText : styles.placeholder}>
                {startDate ? format(new Date(startDate), 'MMM d, yyyy') : 'Select start date'}
              </Text>
              <Calendar size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (!destination.trim() || !startDate) && styles.buttonDisabled
            ]}
            onPress={handleCreate}
            disabled={!destination.trim() || !startDate}
          >
            <Text style={styles.buttonText}>Create Trip</Text>
          </TouchableOpacity>
        </View>

        <DatePicker
          isVisible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSelect={setStartDate}
          selectedDate={startDate}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#000000',
  },
  form: {
    padding: 24,
    gap: 24,
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
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  dateText: {
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
    marginTop: 24,
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