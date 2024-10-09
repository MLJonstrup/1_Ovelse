import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';

export default function HomeComponent() {
  const [events, setEvents] = useState([]);
  const db = getFirestore(); // Initialize Firestore

  // Function to fetch upcoming bookings from Firestore
  const fetchBookings = async () => {
    try {
      const bookingsCollection = collection(db, 'bookings');
      const bookingSnapshot = await getDocs(bookingsCollection);
      const bookingList = bookingSnapshot.docs.map(doc => ({
        id: doc.id, // Add Firestore document ID
        ...doc.data(), // Spread the document data
      }));

      // Filter bookings to show only upcoming ones
      const today = new Date();
      const upcomingBookings = bookingList.filter(booking => {
        if (booking.date && typeof booking.date === 'string') {
          const bookingDate = parseDate(booking.date);
          return bookingDate >= today; // Only upcoming bookings
        }
        return false; // Exclude bookings with undefined or invalid date
      });

      setEvents(upcomingBookings);
    } catch (e) {
      console.error('Error fetching bookings: ', e);
    }
  };

  // Function to parse date in dd/mm/yyyy format
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // Month is 0-indexed
  };

  // Fetch bookings on component mount and set up interval for updates
  useEffect(() => {
    fetchBookings(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchBookings(); // Fetch every 10 seconds
    }, 10000); // Adjust the interval time as needed (10000 ms = 10 seconds)

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Bookings:</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventText}>{item.sport} - {item.date} at {item.time}</Text>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 200,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, // Space between title and list
  },
  eventItem: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    width: '100%',
    alignItems: 'flex-start',
  },
  eventText: {
    fontSize: 16,
  },
});
