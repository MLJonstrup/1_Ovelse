import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import globalStyles from '../globalStyles'; // Import global styles
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore'; // Import query and where
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import { StatusBar } from 'expo-status-bar';

export default function HomeComponent() {
  const [pastEvents, setPastEvents] = useState([]);
  const db = getFirestore();
  const auth = getAuth(); // Initialize Firebase Auth
  const userId = auth.currentUser?.uid; // Get current user ID

  const fetchBookings = async () => {
    if (!userId) return; // Exit if no user ID found

    try {
      // Query to filter bookings by user ID
      const bookingsCollection = collection(db, 'bookings');
      const q = query(bookingsCollection, where('userId', '==', userId)); // Filter bookings
      const bookingSnapshot = await getDocs(q); // Get filtered bookings

      const bookingList = bookingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const today = new Date();
      const pastBookings = bookingList.filter(booking => {
        if (booking.date && typeof booking.date === 'string') {
          const bookingDate = parseDate(booking.date);
          return bookingDate < today; // Past bookings
        }
        return false;
      });

      // Sort pastBookings by date (descending)
      pastBookings.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB - dateA; // Descending order
      });

      setPastEvents(pastBookings);
    } catch (e) {
      console.error('Error fetching bookings: ', e);
    }
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    fetchBookings();

    const intervalId = setInterval(() => {
      fetchBookings();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}>Past Bookings:</Text>
      {pastEvents.length === 0 ? (
        <Text style={globalStyles.eventText}>No past bookings available.</Text>
      ) : (
        <View style={{ maxHeight: 300, width: '100%' }}>
          <FlatList
            data={pastEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={globalStyles.eventItem}>
                <Text style={globalStyles.eventText}>
                  {item.sport} - {item.date} at {item.time}
                </Text>
              </View>
            )}
          />
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}
