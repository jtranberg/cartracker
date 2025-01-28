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
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/UserDashboardStyles';
import Constants from 'expo-constants';

// Dynamically determine the server URL
const getApiUrl = () => {
  const isDevelopment = __DEV__; // True in development mode
  const extra = Constants.expoConfig?.extra;
  return isDevelopment
    ? extra?.LOCAL_API_URL
    : extra?.PROD_API_URL || "https://igotit-t2uz.onrender.com";
};

const apiUrl = getApiUrl();

const UserDashboard = () => {
  const [dbKey, setDbKey] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');

  // Show welcome alert on mount
  useEffect(() => {
    const showWelcomeAlert = async () => {
      try {
        const dismissed = await AsyncStorage.getItem('userDashboardAlertDismissed');
        if (dismissed === 'true') return;

        Alert.alert(
          'Welcome to User Dashboard',
          'Here you can view items, select available ones, and manage your choices using the database key.',
          [
            {
              text: 'Got it',
              onPress: () => console.log('Alert dismissed temporarily'),
            },
            {
              text: 'Don\'t Show Again',
              onPress: async () => {
                await AsyncStorage.setItem('userDashboardAlertDismissed', 'true');
                console.log('Alert dismissed permanently');
              },
              style: 'destructive',
            },
          ]
        );
      } catch (err) {
        console.error('Error showing welcome alert:', err);
      }
    };

    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        setUsername(storedUsername || 'Unknown User');
      } catch (err) {
        console.error('Error fetching username from AsyncStorage:', err);
      }
    };

    showWelcomeAlert();
    fetchUsername();
  }, []);

  // Fetch data from server
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
      setError('Failed to fetch data. Please check your server.');
    }
  };

  // Toggle item selection
  const toggleItemSelectedForUser = async (itemId) => {
    try {
      const selectedItem = data.find((item) => item._id === itemId);

      if (selectedItem.isSelected) {
        setSelectedItemName(selectedItem.itemName);
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
      alert('Failed to toggle item. Please try again.');
    }
  };

  // Send email to item's creator
  const handleSendEmail = () => {
    const subject = 'Request to Unselect an Item';
    const body = `Dear User,\n\nI would like to request unselecting the item "${selectedItemName}".\n\nThank you.`;
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailto).catch((err) =>
      console.error('Error opening email client:', err)
    );
  };

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

          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.dataBox,
                  item.isSelected ? styles.selected : null,
                ]}
              >
                <Text style={styles.dataText}>Name: {item.itemName}</Text>
                <Text style={styles.dataText}>Category: {item.category}</Text>
                <Text style={styles.dataText}>Status: {item.status}</Text>
                <Text style={styles.dataText}>Location: {item.location}</Text>
                <Text style={styles.dataText}>
                  Selected: {item.isSelected ? 'Yes' : 'No'}
                </Text>
                <Text style={styles.dataText}>
                  Toggled By: {item.toggledBy || 'No user'}
                </Text>

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
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No items found</Text>
            }
          />

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
