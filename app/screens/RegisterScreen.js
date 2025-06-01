import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants'; // ✅ Needed for API URL

// ✅ Use production API fallback directly
const API_BASE_URL = Constants.expoConfig?.extra?.PROD_API_URL || "https://cartracker-t4bc.onrender.com";
console.log("🌐 Using API_BASE_URL:", API_BASE_URL);

export default function RegisterScreen() {
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      console.log('📦 Sending registration data:', { username, email, password });

      const response = await axios.post(`${API_BASE_URL}/register`, {
        username,
        email,
        password
      });

      if (response.data.success) {
        console.log("✅ Registration successful. Redirecting...");
        router.replace('/screens/LoginScreen');
      } else {
        console.log("⚠️ Server responded:", response.data);
        setErrorMessage(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error("❌ Registration error:", error.message);
      setErrorMessage(error.response?.data?.message || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
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
      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button title="Register" onPress={handleRegister} color="#1E90FF" />

      <Text
        style={styles.loginLink}
        onPress={() => router.replace('/screens/LoginScreen')}
      >
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
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
  loginLink: {
    marginTop: 20,
    textAlign: 'center',
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
});
