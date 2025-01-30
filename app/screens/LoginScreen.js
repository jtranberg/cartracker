import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ImageBackground } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants'; // ✅ Import expo-constants

// ✅ Dynamically use local or production API
const API_BASE_URL = __DEV__
  ? Constants.expoConfig?.extra?.LOCAL_API_URL  // Use local API when in dev mode
  : Constants.expoConfig?.extra?.PROD_API_URL;  // Use production API otherwise

console.log('🌍 Using API_BASE_URL:', API_BASE_URL); // ✅ Log the API URL in use

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    try {
      console.log('🔄 Sending login request:', { email, password });

      const response = await axios.post(`${API_BASE_URL}/login`, { // ✅ Uses dynamic URL
        email,
        password,
      });

      console.log('✅ Server response:', response.data);

      if (response.data.success && response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token); // ✅ Store token
        console.log('🔑 Token saved, redirecting to Home...');
        router.replace('/screens/HomeScreen'); // ✅ Redirect to Home
      } else {
        setErrorMessage(response.data.message || 'Login failed');
        console.log('⚠️ Login failed:', response.data.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred during login');
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/office.png')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

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

        <Button title="Log In" onPress={handleLogin} color="#1E90FF" />

        <Text
          style={styles.registerLink}
          onPress={() => router.push('/screens/RegisterScreen')}
        >
          Don't have an account? Register
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  registerLink: {
    marginTop: 20,
    textAlign: 'center',
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
});
