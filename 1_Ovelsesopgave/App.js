import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { getFirestore } from 'firebase/firestore';
import { View, Text, TextInput, Button } from 'react-native';
import globalStyles from './globalStyles';
import dashboard from './components/home'; 
import booking from './components/book';
import history from './components/history';
import profile from './components/profile';
import settings from './components/settings';

const firebaseConfig = {
  apiKey: "AIzaSyADvL16QaGmXg8ezO35f2SHfuS7b-JOvfE",
  authDomain: "ovelseinnt.firebaseapp.com",
  projectId: "ovelseinnt",
  storageBucket: "ovelseinnt.appspot.com",
  messagingSenderId: "650756283665",
  appId: "1:650756283665:web:3aedccd7112f60a494c0b0",
};

// Opstart af Firebase
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const auth = getAuth();
const db = getFirestore();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

//Login function
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => onLogin(userCredential.user))
      .catch(error => console.error('Login error:', error));
  };

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => onLogin(userCredential.user))
      .catch(error => console.error('Sign-up error:', error));
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
      <TextInput style={globalStyles.input} placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput style={globalStyles.input} placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry />
      <Button title={isSignUp ? "Sign Up" : "Login"} onPress={isSignUp ? handleSignUp : handleLogin} />
      <Button 
        title={isSignUp ? "Have an account? Login" : "New user? Sign Up"} 
        onPress={() => setIsSignUp(!isSignUp)} 
      />
    </View>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => setUser(user));
    return unsubscribe;
  }, []);

  //Navigationen er herunder
  const StackNavigation = () => (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={dashboard} />
      <Stack.Screen name="Booking" component={booking} />
      <Stack.Screen name="History" component={history} />
      <Stack.Screen name="Profile" component={profile} />
      <Stack.Screen name="Settings" component={settings} />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator>
          <Tab.Screen 
            name="Home" 
            component={dashboard} 
            options={{
              tabBarIcon: () => (<Ionicons name="home" size={20} />),
              headerShown: false
            }} 
          />
          <Tab.Screen 
            name="Book new time" 
            component={booking} 
            options={{
              tabBarIcon: () => (<Ionicons name="add" size={20} />),
              headerShown: false
            }} 
          />
          <Tab.Screen 
            name="See past bookings" 
            component={history} 
            options={{
              tabBarIcon: () => (<Ionicons name="book" size={20} />),
              headerShown: false
            }} 
          />
          <Tab.Screen 
            name="Profile" 
            component={profile} 
            options={{
              tabBarIcon: () => (<Ionicons name="person" size={20} />),
              headerShown: false
            }} 
          />
          <Tab.Screen 
            name="Settings" 
            component={settings} 
            options={{
              tabBarIcon: () => (<Ionicons name="settings" size={20} />),
              headerShown: false
            }} 
          />
        </Tab.Navigator>
      ) : (
        <Login onLogin={setUser} />
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
