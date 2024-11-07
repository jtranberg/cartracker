import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Pressable, Platform, ImageBackground } from 'react-native';
import axios from 'axios';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient'; // For gradient background
import { BlurView } from 'expo-blur'; // For glassmorphism effect

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const navigation = useNavigation();

  // Hide bottom navigation when on the LoginScreen
  useEffect(() => {
    if (Platform.OS !== 'web') {
      navigation.setOptions({ tabBarVisible: false });
    }

    return () => {
      // Reset visibility when leaving the screen
      navigation.setOptions({ tabBarVisible: true });
    };
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://10.0.0.167:5000/login', {
        email,
        password,
      });
  
      if (response.data.success) {
        // Store both username and email in AsyncStorage
        await AsyncStorage.setItem('username', response.data.username);
        await AsyncStorage.setItem('userEmail', email); // Save the email as well
  
        router.replace('/screens/HomeScreen');
      } else {
        setErrorMessage(response.data.message || 'Login failed');
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'An error occurred');
      } else if (error.request) {
        setErrorMessage('No response from server. Check your network.');
      } else {
        setErrorMessage('Error: ' + error.message);
      }
    }
  };
  

  return (
    // <ImageBackground
    //   source={require('../../assets/images/businessit.png')} // Ensure correct path to the image
    //   style={styles.backgroundImage}
    //   resizeMode="cover" // Ensures the image covers the entire background
    // >
      <View style={styles.overlayWrapper}>
        <LinearGradient
          colors={['rgba(0, 123, 255, 0.2)', 'rgba(0, 198, 255, 0.2)']} // More transparent gradient overlay
          style={styles.gradientOverlay}
        >
          <View style={styles.container}>
            <BlurView intensity={50} style={styles.glassContainer}>
              <Text style={styles.title}>I Got It!</Text>
              <Text style={styles.title}>Know where your items are.</Text>
              
              

              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

              <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </Pressable>

              <Pressable onPress={() => router.push('/screens/RegisterScreen')} style={styles.registerButton}>
                <Text style={styles.registerText}>Don't have an account? Register</Text>
              </Pressable>
            </BlurView>
          </View>
        </LinearGradient>
      </View>
    // </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  overlayWrapper: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.)', // Additional transparent background
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  glassContainer: {
    width: '100%',
    maxWidth: 350,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(192, 249, 250, 0.7)', // Adjust transparency for more glass-like appearance
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    fontSize: 18,
    borderColor: 'rgba(255, 255, 255, 1)',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Slightly more transparent input background
    color: '#333',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#333',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
});
