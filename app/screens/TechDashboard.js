// screens/TechDashboard.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { auth } from '../services/firebase'; // Ensure Firebase Auth is properly imported

const TechDashboard = ({ navigation }) => {
  const [checkStatus, setCheckStatus] = useState(null); // State to track check-in/out status
  const [vehicleNumber, setVehicleNumber] = useState(''); // State to track vehicle number
  const [techName, setTechName] = useState(''); // State to track technician's name
  const [signedOutDetails, setSignedOutDetails] = useState([]); // State to track signed-out details

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.replace('SignIn');
    });
  };

  const handleCheckInOut = () => {
    if (checkStatus && vehicleNumber && techName) {
      const timestamp = new Date().toLocaleString(); // Get current date and time
      const details = {
        tech: techName,
        vehicle: vehicleNumber,
        status: checkStatus,
        timestamp: timestamp, // Add timestamp to details
      };
      setSignedOutDetails(prevDetails => [...prevDetails, details]); // Add details to signed-out list
      console.log(details); // Log details
      // Clear inputs after submission
      setVehicleNumber('');
      setTechName('');
      setCheckStatus(null);
    } else {
      alert('Please fill in all fields: technician name, vehicle number, and check-in/out status.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tech Dashboard</Text>

      <TextInput
        placeholder="Enter Technician Name"
        value={techName}
        onChangeText={setTechName}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter Vehicle Number"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
        style={styles.input}
      />

      <View style={styles.checkInOutContainer}>
        <Text style={styles.checkInOutTitle}>Check In/Out:</Text>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setCheckStatus('Out')}
        >
          <Text style={styles.radioButtonText}>Check Out</Text>
          {checkStatus === 'Out' && <Text style={styles.selectedIndicator}>●</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setCheckStatus('In')}
        >
          <Text style={styles.radioButtonText}>Check In</Text>
          {checkStatus === 'In' && <Text style={styles.selectedIndicator}>●</Text>}
        </TouchableOpacity>
      </View>

      <Button title="Submit" onPress={handleCheckInOut} />
      <Button title="Logout" onPress={handleLogout} />

      {/* Display signed-out details in boxes */}
      {signedOutDetails.length > 0 && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>Signed Out Details:</Text>
          {signedOutDetails.map((detail, index) => (
            <View key={index} style={styles.detailBox}>
              <Text style={styles.detailsText}>Tech: {detail.tech}</Text>
              <Text style={styles.detailsText}>Vehicle: {detail.vehicle}</Text>
              <Text style={styles.detailsText}>Status: {detail.status}</Text>
              <Text style={styles.detailsText}>Time: {detail.timestamp}</Text> {/* Display timestamp */}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  checkInOutContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  checkInOutTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
    justifyContent: 'space-between',
  },
  radioButtonText: {
    fontSize: 16,
  },
  selectedIndicator: {
    color: 'green',
    fontSize: 16,
  },
  detailsContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  detailsText: {
    fontSize: 16,
  },
  detailBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
});

export default TechDashboard; // Ensure this line is present
