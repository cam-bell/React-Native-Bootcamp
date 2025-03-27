import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { differenceInDays, differenceInHours, differenceInMinutes, isBefore } from 'date-fns';

interface TripCountdownProps {
  startDate: string;
}

export function TripCountdown({ startDate }: TripCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tripDate = new Date(startDate);

      if (isBefore(tripDate, now)) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = differenceInDays(tripDate, now);
      const hours = differenceInHours(tripDate, now) % 24;
      const minutes = differenceInMinutes(tripDate, now) % 60;

      setTimeLeft({ days, hours, minutes });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000 * 60); // Update every minute

    return () => clearInterval(interval);
  }, [startDate]);

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time until trip</Text>
      <View style={styles.timeContainer}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeValue}>{timeLeft.days}</Text>
          <Text style={styles.timeLabel}>days</Text>
        </View>
        <Text style={styles.timeSeparator}>:</Text>
        <View style={styles.timeBlock}>
          <Text style={styles.timeValue}>{timeLeft.hours}</Text>
          <Text style={styles.timeLabel}>hours</Text>
        </View>
        <Text style={styles.timeSeparator}>:</Text>
        <View style={styles.timeBlock}>
          <Text style={styles.timeValue}>{timeLeft.minutes}</Text>
          <Text style={styles.timeLabel}>min</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#000000',
  },
  timeLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  timeSeparator: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#000000',
    marginHorizontal: 8,
  },
});