import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { CategoryPicker } from '../../components/CategoryPicker';
import { DatePicker } from '../../components/DatePicker';
import { format, isBefore } from 'date-fns';

export default function AddItemScreen() {
  const { id } = useLocalSearchParams();
  const [category, setCategory] = useState('');
  const [itemName, setItemName] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tripStartDate, setTripStartDate] = useState<string | null>(null);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    loadTripDate();
  }, []);

  const loadTripDate = async () => {
    const tripsData = await AsyncStorage.getItem('trips');
    if (tripsData) {
      const trips = JSON.parse(tripsData);
      const trip = trips.find(t => t.id === id);
      if (trip) {
        setTripStartDate(trip.startDate);
      }
    }
  };

  const handleReminderDateSelect = (date: string) => {
    if (tripStartDate && !isBefore(new Date(date), new Date(tripStartDate))) {
      setDateError('Reminder date must be before the trip start date');
      setReminderDate('');
    } else {
      setDateError('');
      setReminderDate(date);
    }
  };

  const handleAdd = async () => {
    if (category && itemName) {
      const tripsData = await AsyncStorage.getItem('trips');
      if (tripsData) {
        const trips = JSON.parse(tripsData);
        const tripIndex = trips.findIndex(t => t.id === id);
        
        if (tripIndex !== -1) {
          const newItem = {
            id: Date.now().toString(),
            name: itemName,
            category: category,
            reminderDate: reminderDate || null,
            packed: false,
          };
          
          if (!trips[tripIndex].items) {
            trips[tripIndex].items = [];
          }
          
          trips[tripIndex].items.unshift(newItem);
          await AsyncStorage.setItem('trips', JSON.stringify(trips));
          router.back();
        }
      }
    }
  };

  const handleCategorySelect = (categoryName: string, subItemName: string) => {
    setCategory(categoryName);
    setItemName(subItemName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Item</Text>
      </View>

      <View style={styles.form}>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowCategoryPicker(true)}
        >
          <Text style={styles.label}>Category & Item</Text>
          <Text style={category && itemName ? styles.selectedText : styles.placeholder}>
            {category && itemName ? `${category} - ${itemName}` : 'Select category and item'}
          </Text>
        </TouchableOpacity>

        <View>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.label}>Reminder Date (Optional)</Text>
            <View style={styles.dateContainer}>
              <Text style={reminderDate ? styles.selectedText : styles.placeholder}>
                {reminderDate ? format(new Date(reminderDate), 'MMM d, yyyy') : 'Set reminder date'}
              </Text>
              <Calendar size={20} color="#666666" />
            </View>
          </TouchableOpacity>
          {dateError ? (
            <Text style={styles.errorText}>{dateError}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!category || !itemName) && styles.buttonDisabled
          ]}
          onPress={handleAdd}
          disabled={!category || !itemName}
        >
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      <CategoryPicker
        isVisible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        onSelect={handleCategorySelect}
      />

      <DatePicker
        isVisible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={handleReminderDateSelect}
        selectedDate={reminderDate}
      />
    </SafeAreaView>
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
  input: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedText: {
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
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 8,
    marginLeft: 16,
  },
});