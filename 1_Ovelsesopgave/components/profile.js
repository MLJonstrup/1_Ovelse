import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import globalStyles from '../globalStyles'; // Import global styles
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const db = getFirestore();
  const userId = 'user-id'; // Replace with actual user ID

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, profile);
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (e) {
      console.error('Error updating profile: ', e);
      alert('Failed to update profile');
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
      <TextInput
        style={globalStyles.input}
        value={profile.phone}
        editable={isEditing}
        onChangeText={(text) => setProfile({ ...profile, phone: text })}
        placeholder="Phone"
      />

      {isEditing ? (
        <Button title="Save" onPress={handleSave} />
      ) : (
        <Button title="Edit" onPress={() => setIsEditing(true)} />
      )}
    </View>
  );
}
