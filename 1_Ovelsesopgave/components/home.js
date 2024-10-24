import { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import globalStyles from '../globalStyles'; // Import global styles
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';

export default function HomeComponent() {
  const [events, setEvents] = useState([]);
  const db = getFirestore();

  const fetchBookings = async () => {
    try {
      const bookingsCollection = collection(db, 'bookings');
      const bookingSnapshot = await getDocs(bookingsCollection);
      const bookingList = bookingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const today = new Date();
      const upcomingBookings = bookingList.filter(booking => {
        if (booking.date && typeof booking.date === 'string') {
          const bookingDate = parseDate(booking.date);
          return bookingDate >= today;
        }
        return false;
      });

      setEvents(upcomingBookings);
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
      <Text style={globalStyles.text}>Upcoming Bookings:</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={globalStyles.eventItem}>
            <Text style={globalStyles.eventText}>{item.sport} - {item.date} at {item.time}</Text>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}
