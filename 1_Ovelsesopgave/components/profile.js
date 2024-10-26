import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import globalStyles from '../globalStyles'; // Import global styles
import { getAuth, signOut } from 'firebase/auth'; // Import signOut from Firebase Auth
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: 'Client', // Default role
  });
  const [isEditing, setIsEditing] = useState(false);
  const db = getFirestore();
  const auth = getAuth(); // Initialize Firebase Auth
  const userId = auth.currentUser?.uid; // Get current user ID

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data()); // Pre-fill form with user data
      } else {
        console.log('No such document! Creating a new profile.');
        setProfile({
          name: '',
          email: '',
          role: 'Client', // Default role
        });
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, profile, { merge: true }); // Merge to keep existing data

      alert('Profile saved successfully!');
      setIsEditing(false);
    } catch (e) {
      console.error('Error saving profile: ', e);
      alert('Failed to save profile');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      Alert.alert('Logged out successfully!'); // Optional alert for confirmation
    } catch (error) {
      console.error('Error during logout: ', error);
      alert('Failed to log out');
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}>Profile Page</Text>

      <TextInput
        style={globalStyles.input} // Ensure input style is defined in your globalStyles
        value={profile.name}
        editable={isEditing}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
        placeholder="Name"
      />
      <TextInput
        style={globalStyles.input}
        value={profile.email}
        editable={isEditing}
        onChangeText={(text) => setProfile({ ...profile, email: text })}
        placeholder="Email"
      />
      
      {/* Picker for Role Selection */}
      {isEditing && (
        <Picker
          selectedValue={profile.role}
          style={{ height: 50, width: '100%' }} // Ensure the Picker has a defined height and width
          onValueChange={(itemValue) => setProfile({ ...profile, role: itemValue })}
        >
          <Picker.Item label="Trainer" value="Trainer" />
          <Picker.Item label="Client" value="Client" />
        </Picker>
      )}

      {isEditing ? (
        <Button title="Save" onPress={handleSave} />
      ) : (
        <Button title="Edit" onPress={() => setIsEditing(true)} />
      )}

      {/* Logout Button */}
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
}
