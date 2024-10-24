import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { getApps, initializeApp } from 'firebase/app';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { getFirestore } from 'firebase/firestore';

// Import your components
import dashboard from './components/home'; 
import booking from './components/book';
import history from './components/history';
import profile from './components/profile';
import settings from './components/settings';
import globalStyles from './globalStyles'; // Import global styles

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADvL16QaGmXg8ezO35f2SHfuS7b-JOvfE",
  authDomain: "ovelseinnt.firebaseapp.com",
  projectId: "ovelseinnt",
  storageBucket: "ovelseinnt.appspot.com",
  messagingSenderId: "650756283665",
  appId: "1:650756283665:web:3aedccd7112f60a494c0b0",
};

// Initialize Firebase if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getFirestore();

export default function App() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const StackNavigation = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={dashboard} />
        <Stack.Screen name="Booking" component={booking} />
        <Stack.Screen name="History" component={history} />
        <Stack.Screen name="Profile" component={profile} />
        <Stack.Screen name="Settings" component={settings} />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
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
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
