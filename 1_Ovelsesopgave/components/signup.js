import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; 
import globalStyles from '../globalStyles';

export default function Signup({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('client'); 
  const auth = getAuth();
  const db = getFirestore(); 

  //signup funktion via birebase authenticator
  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

     
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        userType: userType, 
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
      
      {/* Add Picker for user type */}
      <Text style={globalStyles.text}>Select User Type:</Text>
      <Picker
        selectedValue={userType}
        style={globalStyles.input} 
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
