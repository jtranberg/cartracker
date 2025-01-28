import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { BlurView } from 'expo-blur'; // Import BlurView for glass effect
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing user choice

export default function HomeScreen() {
  const router = useRouter(); // Initialize useRouter inside the component
  const [showAlert, setShowAlert] = useState(false);

  // Check if the alert should be shown
  useEffect(() => {
    const checkAlertStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('hideAlert');
        if (value === null) {
          // If 'hideAlert' is not set, show the alert
          setShowAlert(true);
        }
      } catch (error) {
        console.error('Error checking alert status:', error);
      }
    };

    checkAlertStatus();
  }, []);

  const handleAlertDismiss = async (hide) => {
    if (hide) {
      try {
        await AsyncStorage.setItem('hideAlert', 'true');
      } catch (error) {
        console.error('Error saving alert status:', error);
      }
    }
    setShowAlert(false);
  };

  // Show the alert if showAlert is true
  useEffect(() => {
    if (showAlert) {
      Alert.alert(
        'Welcome to "I GOT IT!"',
        `This app helps you create and track your business items efficiently. 
Use the Admin Dashboard to create your database and items. 
Then share your Key to allow others access to your Database. 
Use the User Dashboard to see the database. 
Tap to select the item to be tracked. 
Hit refresh to update the Database.`,
        [
          { text: "Got it!", onPress: () => handleAlertDismiss(false) },
          {
            text: "Don't show again",
            onPress: () => handleAlertDismiss(true),
            style: 'destructive',
          },
        ]
      );
    }
  }, [showAlert]);

  return (
    <ImageBackground
      source={require('../../assets/images/office.png')} // Path to your background image
      style={{ flex: 1 }}
      resizeMode="cover" // Ensures the image covers the screen
    >
      <LinearGradient
        colors={['rgba(14,110,126,0.7)', 'rgba(8,159,190,0.7)']} // Blue gradient with transparency
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <BlurView intensity={80} style={styles.innerContainer}>
            <Text style={styles.title}>"I GOT IT!"</Text>
            <Text style={styles.message}>Business Items Tracker.</Text>
            <Text style={styles.message}>
              Create and Track your business items.
            </Text>

            <TouchableOpacity 
              style={styles.button} 
              onPress={() => router.push('../screens/AdminDashboard')}>
              <Text style={styles.buttonText}>Go to Admin Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button} 
              onPress={() => router.push('../screens/UserDashboard')}>
              <Text style={styles.buttonText}>Go to User Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#333' }]} 
              onPress={() => router.replace('/screens/LoginScreen')}>
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent background for glassmorphism
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff', // White text for the title
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff', // White text for the messages
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
