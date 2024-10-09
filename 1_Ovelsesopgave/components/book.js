import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

export default function BookingComponent() {
  let [selectedSport, setSelectedSport] = useState('');
  let [selectedTime, setSelectedTime] = useState('');
  let [selectedDate, setSelectedDate] = useState('');
  const [futureDates, setFutureDates] = useState([]); // State for future dates
  const dateBooked = new Date();
  const db = getFirestore(); // Initialize Firestore

  const handleBooking = async () => {
    try {
      await addDoc(collection(db, 'bookings'), {
        sport: selectedSport,
        time: selectedTime,
        date: selectedDate,
        dateBooked: dateBooked, // Use the correct variable here
      });
      alert('Booking successful!');
    } catch (e) {
      console.error('Error adding booking: ', e);
      alert('Failed to book time');
    }
  };

  // Function to get dates for 1, 2, 3, and 4 days in the future
  const getFutureDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 4; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      // Format date to a string
      const formattedDate = `${futureDate.getDate()}/${futureDate.getMonth() + 1}/${futureDate.getFullYear()}`; 
      dates.push(formattedDate);
    }

    return dates;
  };

  // Use useEffect to set future dates on component mount
  useEffect(() => {
    setFutureDates(getFutureDates());
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create booking here:</Text>

      <Picker
        selectedValue={selectedSport}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedSport(itemValue)}>
        <Picker.Item label="Select Sport" value="" />
        <Picker.Item label="Soccer" value="soccer" />
        <Picker.Item label="Basketball" value="basketball" />
        <Picker.Item label="Tennis" value="tennis" />
      </Picker>

      <Picker
        selectedValue={selectedTime}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedTime(itemValue)}>
        <Picker.Item label="Select Time" value="" />
        <Picker.Item label="8:00 AM" value="8:00 AM" />
        <Picker.Item label="10:00 AM" value="10:00 AM" />
        <Picker.Item label="12:00 PM" value="12:00 PM" />
        <Picker.Item label="2:00 PM" value="2:00 PM" />
      </Picker>

      <Picker
        selectedValue={selectedDate}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedDate(itemValue)}>
        <Picker.Item label="Select Date" value="" />
        {futureDates.map((date, index) => (
          <Picker.Item key={index} label={date} value={date} />
        ))}
      </Picker>

      <Button title="Book Time" onPress={handleBooking} />
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
    paddingTop: 200, // Added padding to position the form nicely
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, // Space between title and pickers
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15, // Space between pickers
  },
});
