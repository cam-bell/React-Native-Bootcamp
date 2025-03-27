import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Check, Search, Trash2 } from 'lucide-react-native';
import { format } from 'date-fns';
import { WeatherInfo } from '../components/WeatherInfo';
import { TripCountdown } from '../components/TripCountdown';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const [trip, setTrip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useFocusEffect(() => {
    loadTrip();
  });

  const loadTrip = async () => {
    const tripsData = await AsyncStorage.getItem('trips');
    if (tripsData) {
      const trips = JSON.parse(tripsData);
      const foundTrip = trips.find(t => t.id === id);
      setTrip(foundTrip);
    }
  };

  const toggleItemPacked = async (itemId) => {
    const tripsData = await AsyncStorage.getItem('trips');
    if (tripsData) {
      const trips = JSON.parse(tripsData);
      const tripIndex = trips.findIndex(t => t.id === id);
      
      if (tripIndex !== -1) {
        const itemIndex = trips[tripIndex].items.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
          trips[tripIndex].items[itemIndex].packed = !trips[tripIndex].items[itemIndex].packed;
          await AsyncStorage.setItem('trips', JSON.stringify(trips));
          setTrip(trips[tripIndex]);
        }
      }
    }
  };

  const deleteItem = async (itemId) => {
    const tripsData = await AsyncStorage.getItem('trips');
    if (tripsData) {
      const trips = JSON.parse(tripsData);
      const tripIndex = trips.findIndex(t => t.id === id);
      
      if (tripIndex !== -1) {
        trips[tripIndex].items = trips[tripIndex].items.filter(i => i.id !== itemId);
        await AsyncStorage.setItem('trips', JSON.stringify(trips));
        setTrip(trips[tripIndex]);
      }
    }
  };

  const filteredItems = trip?.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const packedItemsCount = trip?.items.filter(item => item.packed).length || 0;
  const totalItemsCount = trip?.items.length || 0;
  const progress = totalItemsCount > 0 ? (packedItemsCount / totalItemsCount) * 100 : 0;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => toggleItemPacked(item.id)}
    >
      <View style={styles.itemInfo}>
        <Text style={[
          styles.itemName,
          item.packed && styles.itemNamePacked
        ]}>
          {item.name}
        </Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        {item.reminderDate && (
          <Text style={styles.reminderDate}>
            Reminder: {format(new Date(item.reminderDate), 'MMM d, yyyy')}
          </Text>
        )}
      </View>
      <View style={styles.itemActions}>
        <View style={[
          styles.checkBox,
          item.packed && styles.checkBoxChecked
        ]}>
          {item.packed && <Check size={16} color="#ffffff" />}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteItem(item.id)}
        >
          <Trash2 size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (!trip) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.destination}>{trip.destination}</Text>
          <Text style={styles.date}>
            {format(new Date(trip.startDate), 'MMM d, yyyy')}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setShowSearch(!showSearch)}
        >
          <Search size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <TripCountdown startDate={trip.startDate} />

      <WeatherInfo destination={trip.destination} />

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {packedItemsCount} of {totalItemsCount} items packed
        </Text>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search items..."
            placeholderTextColor="#666666"
          />
        </View>
      )}

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.itemsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No items added yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start adding items to your packing list!
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push(`/trip/${id}/add-item`)}
      >
        <Plus color="#ffffff" size={24} />
      </TouchableOpacity>
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
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  destination: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#000000',
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  progressContainer: {
    padding: 24,
    paddingTop: 0,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    color: '#000000',
  },
  itemsList: {
    padding: 24,
    gap: 16,
  },
  itemCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000000',
  },
  itemNamePacked: {
    textDecorationLine: 'line-through',
    color: '#666666',
  },
  itemCategory: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  reminderDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxChecked: {
    backgroundColor: '#000000',
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 48,
  },
  emptyStateText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000000',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#666666',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#000000',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});