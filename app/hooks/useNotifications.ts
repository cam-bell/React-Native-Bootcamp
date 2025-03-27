import { useEffect } from 'react';
import { Platform } from 'react-native';
import { addDays, isBefore } from 'date-fns';

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  items: Array<{
    id: string;
    name: string;
    category: string;
    reminderDate?: string | null;
    packed: boolean;
  }>;
}

export function useNotifications(trips: Trip[]) {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const requestNotificationPermission = async () => {
      if (!('Notification' in window)) return;

      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        await Notification.requestPermission();
      }
    };

    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' || !('Notification' in window) || Notification.permission !== 'granted') return;

    // Clear existing notifications
    const notificationIds = JSON.parse(localStorage.getItem('notificationIds') || '[]');
    notificationIds.forEach((id: number) => clearTimeout(id));
    localStorage.setItem('notificationIds', '[]');

    const newNotificationIds: number[] = [];

    trips.forEach(trip => {
      const tripDate = new Date(trip.startDate);
      const now = new Date();

      // Trip start notification (1 day before)
      const dayBefore = addDays(tripDate, -1);
      if (isBefore(now, dayBefore)) {
        const timeUntilNotification = dayBefore.getTime() - now.getTime();
        const notificationId = window.setTimeout(() => {
          new Notification('Trip Starting Tomorrow!', {
            body: `Your trip to ${trip.destination} starts tomorrow! Time to start packing!`,
            icon: '/icon.png',
          });
        }, timeUntilNotification);
        newNotificationIds.push(notificationId);
      }

      // Item reminder notifications
      trip.items.forEach(item => {
        if (item.reminderDate && !item.packed) {
          const reminderDate = new Date(item.reminderDate);
          if (isBefore(now, reminderDate)) {
            const timeUntilNotification = reminderDate.getTime() - now.getTime();
            const notificationId = window.setTimeout(() => {
              new Notification('Pack Your Item!', {
                body: `Don't forget to pack your ${item.name} for ${trip.destination}!`,
                icon: '/icon.png',
              });
            }, timeUntilNotification);
            newNotificationIds.push(notificationId);
          }
        }
      });
    });

    localStorage.setItem('notificationIds', JSON.stringify(newNotificationIds));

    return () => {
      newNotificationIds.forEach(id => clearTimeout(id));
    };
  }, [trips]);
}