import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../services/firebase'; // Ensure Firebase services are imported

export default function HomeScreen({ navigation }) {
  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.replace('Login'); // Redirect to login after logout
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
      <Text style={styles.subtitle}>You are logged in.</Text>

      {/* Buttons to navigate to the respective dashboards */}
      <Button title="Go to Admin Dashboard" onPress={() => navigation.navigate('AdminDashboard')} />
      <Button title="Go to Tech Dashboard" onPress={() => navigation.navigate('TechDashboard')} />

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
});
