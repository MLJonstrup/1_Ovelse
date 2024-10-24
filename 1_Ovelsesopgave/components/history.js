import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import globalStyles from '../globalStyles'; // Import global styles
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';

export default function HistoryComponent() {
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const db = getFirestore(); // Initialize Firestore

  // Function to parse date in dd/mm/yyyy format
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // Month is 0-indexed
  };

  // Function to fetch past bookings from Firestore
  const fetchPastBookings = async () => {
    setLoading(true); // Set loading state
    setError(null); // Reset error state
    try {
      const bookingsCollection = collection(db, 'bookings');
      const bookingSnapshot = await getDocs(bookingsCollection);

      // Check if there are any documents
      if (bookingSnapshot.empty) {
        console.warn('No bookings found in Firestore.');
        setPastEvents([]); // Set to empty array if no documents found
        return; // Exit the function early
      }

      const bookingList = bookingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter bookings to show only past ones
      const today = new Date();
      const pastBookings = bookingList.filter(booking => {
        if (booking.date && typeof booking.date === 'string') {
          const bookingDate = parseDate(booking.date);
          return bookingDate < today; // Only past bookings
        }
        return false; // Exclude bookings with undefined or invalid date
      });

      setPastEvents(pastBookings);
    } catch (e) {
      console.error('Error fetching past bookings: ', e);
      setError('Failed to load past bookings. Please try again.'); // Set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Fetch past bookings on component mount and set up interval for updates
  useEffect(() => {
    fetchPastBookings(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchPastBookings(); // Fetch every 10 seconds
    }, 10000); // Adjust the interval time as needed (10000 ms = 10 seconds)

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Show loading spinner
  }

  if (error) {
    return (
      <View style={globalStyles.container}>
        <Text style={[globalStyles.text, { color: 'red', textAlign: 'center' }]}>{error}</Text> // Show error message
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={[globalStyles.text, { fontSize: 24, fontWeight: 'bold' }]}>Past Bookings:</Text>
      <FlatList
        data={pastEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={globalStyles.eventItem}>
            <Text style={[globalStyles.text, globalStyles.eventText]}>
              {item.sport || 'Unknown Sport'} - {item.date || 'Unknown Date'} at {item.time || 'Unknown Time'}
            </Text>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}
