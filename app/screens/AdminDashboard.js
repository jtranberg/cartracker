import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase'; // Assuming Firebase is set up here

export default function AdminDashboard({ navigation }) {
  const [vehicleId, setVehicleId] = useState(''); // Vehicle ID to update
  const [assignedTech, setAssignedTech] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');

  // Function to handle vehicle update
  const handleUpdateVehicle = async () => {
    if (!vehicleId) {
      alert('Please enter a valid Vehicle ID');
      return;
    }

    try {
      const vehicleRef = doc(db, 'Vehicles', vehicleId);
      const updatedData = {
        assignedTech,
        status,
        location,
      };
      await updateDoc(vehicleRef, updatedData);
      alert('Vehicle updated successfully');
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert('Failed to update vehicle');
    }
  };

  // Navigate to Vehicle Details page with the entered Vehicle ID
  const goToVehicleDetails = () => {
    if (!vehicleId) {
      alert('Please enter a valid Vehicle ID');
      return;
    }
    // Navigate to VehicleDetails and pass vehicleId as route params
    navigation.navigate('VehicleDetails', { vehicleId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard - Update Vehicle Info</Text>

      <TextInput
        placeholder="Vehicle ID"
        value={vehicleId}
        onChangeText={setVehicleId}
        style={styles.input}
      />

      <TextInput
        placeholder="Assigned Tech"
        value={assignedTech}
        onChangeText={setAssignedTech}
        style={styles.input}
      />

      <TextInput
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
        style={styles.input}
      />

      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <Button title="Update Vehicle" onPress={handleUpdateVehicle} />
      {/* Button to navigate to Vehicle Details */}
      <Button title="View Vehicle Details" onPress={goToVehicleDetails} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
