import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import Firestore methods
import globalStyles from '../globalStyles';

export default function Signup({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('client'); // Default to 'client'
  const auth = getAuth();
  const db = getFirestore(); // Initialize Firestore

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore with userType
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        userType: userType, // Save the selected user type
      });

      alert('Account created successfully!');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      alert('Signup failed: ' + error.message);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}>Signup</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      
      {/* User Type Picker */}
      <Text style={globalStyles.text}>Select User Type:</Text>
      <Picker
        selectedValue={userType}
        style={globalStyles.input} // Style it as an input
        onValueChange={(itemValue) => setUserType(itemValue)}
      >
        <Picker.Item label="Client" value="client" />
        <Picker.Item label="Trainer" value="trainer" />
      </Picker>

      <Button title="Signup" onPress={handleSignup} />
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}
