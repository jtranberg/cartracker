import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function VehicleDetails({ route }) {
  const { vehicleId } = route.params; // Get vehicleId from route parameters
  const [vehicleData, setVehicleData] = useState(null);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const vehicleRef = doc(db, 'Vehicles', vehicleId);
        const docSnap = await getDoc(vehicleRef);

        if (docSnap.exists()) {
          setVehicleData(docSnap.data());
        } else {
          console.log('No such Item');
        }
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
      }
    };

    if (vehicleId) {
      fetchVehicleData();
    }
  }, [vehicleId]);

  if (!vehicleData) {
    return <Text>Loading vehicle details...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicle Details: {vehicleId}</Text>
      <Text>Assigned Tech: {vehicleData.assignedTech || 'N/A'}</Text>
      <Text>Status: {vehicleData.status || 'N/A'}</Text>
      <Text>Location: {vehicleData.location || 'N/A'}</Text>
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
});
