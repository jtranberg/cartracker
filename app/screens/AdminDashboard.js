import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Alert } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/AdminDashboardStyles'; // Adjust the path to your styles

function AdminDashboard() {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');
  const [createDbKey, setCreateDbKey] = useState('');
  const [createDbLock, setCreateDbLock] = useState('');
  const [fetchDbKey, setFetchDbKey] = useState('');
  const [fetchDbLock, setFetchDbLock] = useState('');
  const [items, setItems] = useState([]);
  const [userUsername, setUserUsername] = useState('Unknown User'); // Store user username
  const [userEmail, setUserEmail] = useState('Unknown Email'); // Store user email
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch the user username and email from AsyncStorage
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedEmail = await AsyncStorage.getItem('userEmail');
        
        if (storedUsername) {
          setUserUsername(storedUsername);  // Set the username if found
        } else {
          console.warn('Username not found in AsyncStorage');
        }

        if (storedEmail) {
          setUserEmail(storedEmail);  // Set the email if found
        } else {
          console.warn('Email not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Failed to fetch user details from AsyncStorage:', error);
      }
    };

    fetchUserDetails(); // Fetch user details on component mount
  }, []);

  // Create a new item
  const handleCreateItem = async () => {
    if (!itemName || !category || !createDbKey || !createDbLock) {
      alert('Please enter all required fields including database key and lock.');
      return;
    }

    try {
      const response = await axios.post('http://10.0.0.167:5000/api/items', {
        itemName,
        category,
        status,
        location,
        databaseKey: createDbKey,
        databaseLock: createDbLock,
        createdBy: userUsername, // Include the user username in the item creation
        userEmail: userEmail // Attach the user email to the item
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      alert('Item created successfully');
      setItemName('');
      setCategory('');
      setStatus('');
      setLocation('');
      setCreateDbKey('');
      setCreateDbLock('');
      fetchItems(); // Fetch the newly created items
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item');
    }
  };

  // Fetch items based on dbKey and dbLock
  const fetchItems = async () => {
    if (!fetchDbKey || !fetchDbLock) {
      alert('Please enter both database key and lock to fetch items.');
      return;
    }

    try {
      const response = await axios.get(`http://10.0.0.167:5000/api/items?dbKey=${fetchDbKey}&dbLock=${fetchDbLock}&isAdmin=true`);
      setItems(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch items');
      console.error('Error fetching items:', error);
    }
  };

  // Toggle item selected/unselected
  const toggleItemSelected = async (itemId) => {
    try {
      const selectedItem = items.find(item => item._id === itemId);
      const toggledByUser = selectedItem.isSelected ? null : userUsername;

      const response = await axios.put(
        `http://10.0.0.167:5000/api/items/${itemId}/toggle-selected`,
        {
          user: toggledByUser,
          isAdmin: true,
          dbKey: fetchDbKey,
          dbLock: fetchDbLock
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const updatedItem = response.data;
      setItems(prevItems =>
        prevItems.map(item => (item._id === updatedItem._id ? updatedItem : item))
      );
    } catch (error) {
      console.error('Error toggling item selected state:', error);
      alert('Failed to toggle item selected state.');
    }
  };

  // Delete an item
  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`http://10.0.0.167:5000/api/items/${itemId}`);
      setItems(prevItems => prevItems.filter(item => item._id !== itemId));
      alert('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item.');
    }
  };

  return (
    <LinearGradient colors={['#007BFF88', '#00C6FF88']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <BlurView intensity={100} style={styles.glassContainer}>
          <Text style={styles.title}>Admin Dashboard</Text>

          {/* Display User Username and Email */}
          <Text style={styles.usernameText}>Logged in as: {userUsername}</Text>
          <Text style={styles.emailText}>Email: {userEmail}</Text>

          <Pressable onPress={() => setShowCreateForm(!showCreateForm)} style={styles.button}>
            <Text style={styles.buttonText}>
              {showCreateForm ? 'Hide Create Item Form' : 'Show Create Item Form'}
            </Text>
          </Pressable>

          {showCreateForm && (
            <View>
              <TextInput
                placeholder="Item Name"
                value={itemName}
                onChangeText={setItemName}
                style={styles.input}
              />
              <TextInput
                placeholder="Description"
                value={category}
                onChangeText={setCategory}
                style={styles.input}
              />
              <TextInput
                placeholder="Details"
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
              <TextInput
                placeholder="Database Key for Creation"
                value={createDbKey}
                onChangeText={setCreateDbKey}
                style={styles.input}
              />
              <TextInput
                placeholder="Database Lock for Creation"
                value={createDbLock}
                onChangeText={setCreateDbLock}
                style={styles.input}
              />
              {/* Display the user's email in the form, but keep it disabled */}
              <TextInput
                placeholder="User Email"
                value={userEmail}
                editable={false} // Make this field uneditable
                style={[styles.input, { backgroundColor: '#f0f0f0' }]} // Slightly different styling to indicate it's disabled
              />
              <Pressable onPress={handleCreateItem} style={styles.button}>
                <Text style={styles.buttonText}>Create Item</Text>
              </Pressable>
            </View>
          )}

          <Text style={styles.title}>Enter Database Lock and Key to View Items</Text>
          <TextInput
            placeholder="Database Key for Fetching"
            value={fetchDbKey}
            onChangeText={setFetchDbKey}
            style={styles.input}
          />
          <TextInput
            placeholder="Database Lock for Fetching"
            value={fetchDbLock}
            onChangeText={setFetchDbLock}
            style={styles.input}
          />

          <Pressable onPress={fetchItems} style={styles.button}>
            <Text style={styles.buttonText}>Fetch Items</Text>
          </Pressable>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <FlatList
            data={items}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.detailBox,
                  item.isSelected ? styles.selected : styles.unselected,
                  item.isAdminSelected ? styles.adminSelected : null
                ]}
              >
                <Pressable onPress={() => toggleItemSelected(item._id)} style={styles.toggleItem}>
                  <Text style={styles.detailsText}>Name: {item.itemName}</Text>
                  <Text style={styles.detailsText}>Category: {item.category}</Text>
                  <Text style={styles.detailsText}>Status: {item.status}</Text>
                  <Text style={styles.detailsText}>Location: {item.location}</Text>
                  <Text style={styles.detailsText}>Selected: {item.isSelected ? 'Yes' : 'No'}</Text>
                  <Text style={styles.detailsText}>Toggled By: {item.toggledBy || 'Unknown'}</Text>
                </Pressable>

                <View style={styles.buttonContainer}>
                  <Pressable onPress={() => deleteItem(item._id)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Delete Item</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        </BlurView>
      </View>
    </LinearGradient>
  );
}

export default AdminDashboard;
