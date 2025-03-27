import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { format } from 'date-fns';
import { useNotifications } from '../../hooks/useNotifications';

export default function HomeScreen() {
  const [userName, setUserName] = useState('');
  const [trips, setTrips] = useState([]);

  // Use notifications hook
  useNotifications(trips);

  useFocusEffect(() => {
    loadUserData();
    loadTrips();
  });

  const loadUserData = async () => {
    const name = await AsyncStorage.getItem('userName');
    setUserName(name || '');
  };

  const loadTrips = async () => {
    const tripsData = await AsyncStorage.getItem('trips');
    if (tripsData) {
      const parsedTrips = JSON.parse(tripsData);
      // Sort trips by start date
      parsedTrips.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      setTrips(parsedTrips);
    }
  };

  const renderTrip = ({ item }) => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => router.push(`/trip/${item.id}`)}
    >
      <View>
        <Text style={styles.tripDestination}>{item.destination}</Text>
        <Text style={styles.tripDate}>
          {format(new Date(item.startDate), 'MMM d, yyyy')}
        </Text>
        {new Date(item.startDate).getTime() - new Date().getTime() <= 7 * 24 * 60 * 60 * 1000 && (
          <View style={styles.upcomingBadge}>
            <Text style={styles.upcomingText}>Upcoming</Text>
          </View>
        )}
      </View>
      <View style={styles.tripProgress}>
        <Text style={styles.tripProgressText}>
          {item.items?.filter(i => i.packed).length || 0}/{item.items?.length || 0} packed
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName}!</Text>
          <Text style={styles.subtitle}>Plan your next adventure</Text>
        </View>
      </View>

      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tripsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No trips planned yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first trip to start packing!
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/trip/new')}
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
  },
  greeting: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#000000',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  tripsList: {
    padding: 24,
    gap: 16,
  },
  tripCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripDestination: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000000',
  },
  tripDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  upcomingBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  upcomingText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#ffffff',
  },
  tripProgress: {
    backgroundColor: '#000000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tripProgressText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#ffffff',
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