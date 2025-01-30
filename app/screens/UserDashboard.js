import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Modal,
  Button,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/UserDashboardStyles';
import Constants from 'expo-constants';

// Get screen width for full card display
const { width } = Dimensions.get("window");

// Dynamically determine the server URL
const getApiUrl = () => {
  const isDevelopment = __DEV__;
  const extra = Constants.expoConfig?.extra || {};
  return isDevelopment
    ? extra.LOCAL_API_URL || "http://localhost:5000"
    : extra.PROD_API_URL || "https://igotit-t2uz.onrender.com";
};

const apiUrl = getApiUrl();

const UserDashboard = () => {
  const [dbKey, setDbKey] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [selectedItemEmail, setSelectedItemEmail] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        setUsername(storedUsername || 'Unknown User');
      } catch (err) {
        console.error('Error fetching username:', err);
      }
    };

    fetchUsername();
  }, []);

  // Fetch items from server
  const handleFetchData = async () => {
    if (!dbKey) {
      alert('Please enter the database key');
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/api/items`, {
        params: { dbKey, isAdmin: false },
      });

      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
        setError('');
      } else {
        setError('No data found.');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data.');
    }
  };

  // Toggle item selection
  const toggleItemSelectedForUser = async (itemId) => {
    try {
      const selectedItem = data.find((item) => item._id === itemId);

      if (selectedItem.isSelected) {
        setSelectedItemName(selectedItem.itemName);
        setSelectedItemEmail(selectedItem.email); // Capture the creator's email
        setIsModalVisible(true);
        return;
      }

      const response = await axios.put(
        `${apiUrl}/api/items/${itemId}/toggle-selected`,
        {
          user: username,
          isAdmin: false,
          dbKey,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const updatedItem = response.data;
      setData((prevData) =>
        prevData.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        )
      );
    } catch (err) {
      console.error('Error toggling item:', err);
      alert('Failed to toggle item.');
    }
  };

  // Send email to item's creator
  const handleSendEmail = () => {
    if (!selectedItemEmail) {
      alert("No email available for this item.");
      return;
    }

    const subject = 'Request to Unselect an Item';
    const body = `Dear User,\n\nI would like to request unselecting the item "${selectedItemName}".\n\nThank you.`;
    const mailto = `mailto:${encodeURIComponent(selectedItemEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailto).catch((err) =>
      console.error('Error opening email client:', err)
    );
  };

  // Render card with proper styling
  const renderItem = ({ item }) => (
    <View style={[styles.cardContainer, item.isSelected ? styles.selected : null]}>
      <Text style={styles.cardTitle}>Name: {item.itemName}</Text>
      <Text style={styles.cardText}>Category: {item.category}</Text>
      <Text style={styles.cardText}>Status: {item.status}</Text>
      <Text style={styles.cardText}>Location: {item.location}</Text>
      <Text style={styles.cardText}>
        Selected: {item.isSelected ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.cardText}>
        Toggled By: {item.toggledBy || 'No user'}
      </Text>

      <Pressable
        onPress={() => toggleItemSelectedForUser(item._id)}
        style={styles.toggleButton}
      >
        <Text style={styles.buttonText}>
          {item.isSelected ? 'Unselect' : 'Select Item'}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <LinearGradient colors={['#007BFF', '#00C6FF']} style={styles.background}>
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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Card Slider (One Card Per View) */}
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            snapToAlignment="center"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 20 }}
            getItemLayout={(data, index) => ({
              length: width * 0.8,
              offset: width * 0.8 * index,
              index,
            })}
          />

          {/* Modal for unselecting */}
          <Modal
            animationType="slide"
            transparent
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Only the creator can unselect this item.
              </Text>
              <Button title="Send Email" onPress={handleSendEmail} />
              <Button
                title="Cancel"
                onPress={() => setIsModalVisible(false)}
                color="red"
              />
            </View>
          </Modal>
        </BlurView>
      </View>
    </LinearGradient>
  );
};

export default UserDashboard;
