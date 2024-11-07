import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Modal, Button, Linking, ScrollView } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/UserDashboardStyles'; // Import the styles

const UserDashboard = ({ navigation }) => {
  const [dbKey, setDbKey] = useState('');
  const [data, setData] = useState([]);
  const [creatorEmail, setCreatorEmail] = useState(''); // Store the creator's email
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); // For modal visibility
  const [selectedItemName, setSelectedItemName] = useState(''); // Store the selected item's name

  // Fetch the user data from AsyncStorage or another source
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        setUsername(storedUsername || 'Unknown');
      } catch (error) {
        console.error('Failed to fetch username:', error);
        setUsername('Unknown');
      }
    };

    fetchUsername();
  }, []);

  // Toggle item selection (isSelected)
  const toggleItemSelectedForUser = async (itemId) => {
    try {
      const selectedItem = data.find(item => item._id === itemId);

      // Check if the item is already selected
      if (selectedItem.isSelected) {
        setSelectedItemName(selectedItem.itemName); // Store the item's name to include in email
        setCreatorEmail(selectedItem.userEmail); // Get the creator's email from the item (make sure this field exists)
        setIsModalVisible(true); // Show modal instead of alert
        return;
      }

      // Proceed to toggle selection if not already selected
      const response = await axios.put(
        `http://10.0.0.167:5000/api/items/${itemId}/toggle-selected`,
        {
          user: username,
          isAdmin: false,
          dbKey: dbKey, // dbKey as lock
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const updatedItem = response.data;
      setData(prevData =>
        prevData.map(item => (item._id === updatedItem._id ? updatedItem : item))
      );
    } catch (error) {
      console.error('Error toggling item selected state:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Fetch items based on dbKey and get creator email
  const handleFetchData = async () => {
    if (!dbKey) {
      alert('Please enter the database key');
      return;
    }

    try {
      const response = await axios.get(`https://igotit-t2uz.onrender.com/api/items`, {
        params: {
          dbKey: dbKey,
          isAdmin: false,
        },
      });

      setData(response.data); // Ensure that the data includes `userEmail` or `createdByEmail`
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error.response);
      setError(error.response?.data?.message || 'Failed to fetch data. Please try again.');
    }
  };

  // Open the mail app to send an email to the item's creator
  const handleSendEmail = () => {
    const subject = 'Request to Unselect an Item';
    const body = `Dear User,\n\nI would like to request unselecting the item "${selectedItemName}".\n\nThank you.`;

    const recipient = creatorEmail || 'unknown@example.com'; // Use creator's email

    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailto);
  };

  return (
    <LinearGradient colors={['#007BFF', '#00C6FF']} style={styles.background}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <BlurView intensity={80} style={styles.glassContainer}>
            <Text style={styles.title}>User Dashboard</Text>
            <Text style={styles.usernameText}>Logged in as: {username}</Text>

            <TextInput
              placeholder="Enter Database Key"
              value={dbKey}
              onChangeText={setDbKey}
              style={styles.input}
            />

            <Pressable onPress={handleFetchData} style={styles.button}>
              <Text style={styles.buttonText}>Fetch Data</Text>
            </Pressable>

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <FlatList
                data={data}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={[styles.dataBox, item.isSelected ? styles.selected : null]}>
                    <Text style={styles.dataText}>Name: {item.itemName}</Text>
                    <Text style={styles.dataText}>Category: {item.category}</Text>
                    <Text style={styles.dataText}>Status: {item.status}</Text>
                    <Text style={styles.dataText}>Location: {item.location}</Text>
                    <Text style={styles.dataText}>Selected: {item.isSelected ? 'Yes' : 'No'}</Text>
                    <Text style={styles.dataText}>Toggled By: {item.toggledBy || 'No user'}</Text>

                    {/* Button to toggle item selection */}
                    <Pressable
                      onPress={() => toggleItemSelectedForUser(item._id)}
                      style={styles.toggleButton}
                    >
                      <Text style={styles.buttonText}>
                        {item.isSelected ? 'Already Selected' : 'Select Item'}
                      </Text>
                    </Pressable>
                  </View>
                )}
              />
            )}

            {/* Modal for sending email to the item's creator */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => setIsModalVisible(false)}
            >
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Only the creator can unselect this item.</Text>
                <Button title="Send Email to Creator" onPress={handleSendEmail} />
                <Button title="Cancel" onPress={() => setIsModalVisible(false)} color="red" /> 
              </View>
            </Modal>
          </BlurView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default UserDashboard;
