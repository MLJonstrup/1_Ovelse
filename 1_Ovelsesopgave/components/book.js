import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import globalStyles from '../globalStyles'; // Import global styles
import { StatusBar } from 'expo-status-bar';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

export default function BookingComponent() {
  const [selectedSport, setSelectedSport] = useState(''); // State for selected sport
  const [selectedTime, setSelectedTime] = useState(''); // State for selected time
  const [selectedDate, setSelectedDate] = useState(''); // State for selected date
  const [futureDates, setFutureDates] = useState([]); // State for future dates
  const dateBooked = new Date(); // Current date for booking
  const db = getFirestore(); // Initialize Firestore
  const auth = getAuth(); // Initialize Firebase Auth
  const userId = auth.currentUser?.uid; // Get current user ID

  const handleBooking = async () => {
    if (!selectedSport || !selectedTime || !selectedDate) {
      alert('Please select sport, time, and date for booking.'); // Alert if any selection is missing
      return;
    }
    
    try {
      await addDoc(collection(db, 'bookings'), {
        sport: selectedSport,
        time: selectedTime,
        date: selectedDate,
        dateBooked: dateBooked,
        userId: userId, // Add user ID to the booking
      });
      alert('Booking successful!');
    } catch (e) {
      console.error('Error adding booking: ', e);
      alert('Failed to book time');
    }
  };

  const getFutureDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 4; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const formattedDate = `${futureDate.getDate()}/${futureDate.getMonth() + 1}/${futureDate.getFullYear()}`; 
      dates.push(formattedDate);
    }

    return dates;
  };

  useEffect(() => {
    setFutureDates(getFutureDates());
  }, []);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}>Create booking here:</Text>

      <Text style={globalStyles.label}>Select Sport:</Text>
      <Picker
        selectedValue={selectedSport}
        style={{ height: 50, width: '100%' }} // Inline style for Sport Picker
        onValueChange={(itemValue) => setSelectedSport(itemValue)}>
        <Picker.Item label="Select Sport" value="" />
        <Picker.Item label="Soccer" value="soccer" />
        <Picker.Item label="Basketball" value="basketball" />
        <Picker.Item label="Tennis" value="tennis" />
      </Picker>

      <Text style={globalStyles.label}>Select Time:</Text>
      <Picker
        selectedValue={selectedTime}
        style={{ height: 50, width: '100%' }} // Inline style for Time Picker
        onValueChange={(itemValue) => setSelectedTime(itemValue)}>
        <Picker.Item label="Select Time" value="" />
        <Picker.Item label="8:00 AM" value="8:00 AM" />
        <Picker.Item label="10:00 AM" value="10:00 AM" />
        <Picker.Item label="12:00 PM" value="12:00 PM" />
        <Picker.Item label="2:00 PM" value="2:00 PM" />
      </Picker>

      <Text style={globalStyles.label}>Select Date:</Text>
      <Picker
        selectedValue={selectedDate}
        style={{ height: 50, width: '100%' }} // Inline style for Date Picker
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
