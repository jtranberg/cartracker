import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/AdminDashboardStyles";
import Constants from "expo-constants";

// Dynamically determine the server URL
const getApiUrl = () => {
  const isDevelopment = __DEV__; // True in development mode
  const extra = Constants.expoConfig?.extra;
  return isDevelopment
    ? extra?.LOCAL_API_URL
    : extra?.PROD_API_URL || "https://igotit-t2uz.onrender.com";
};

const apiUrl = getApiUrl();

const AdminDashboard = () => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [createDbKey, setCreateDbKey] = useState("");
  const [createDbLock, setCreateDbLock] = useState("");
  const [fetchDbKey, setFetchDbKey] = useState("");
  const [fetchDbLock, setFetchDbLock] = useState("");
  const [items, setItems] = useState([]);
  const [userName, setUserName] = useState("Unknown User");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch user details and show welcome alert on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        const dismissed = await AsyncStorage.getItem("welcomeAlertDismissed");
        if (dismissed !== "true") {
          Alert.alert(
            "Welcome to Admin Dashboard",
            "Here you can create items, toggle their selection, and manage your inventory.",
            [
              { text: "Got it" },
              {
                text: "Put Away Forever",
                onPress: async () => {
                  await AsyncStorage.setItem("welcomeAlertDismissed", "true");
                },
                style: "destructive",
              },
            ]
          );
        }

        const storedUserName = await AsyncStorage.getItem("username");
        if (storedUserName) setUserName(storedUserName);
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };

    initialize();
  }, []);

  const handleCreateItem = async () => {
    if (!itemName || !category || !status || !location || !createDbKey || !createDbLock || !email || !userName) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = {
      itemName: itemName.trim(),
      category: category.trim(),
      status: status.trim() || "Available",
      location: location.trim(),
      databaseKey: createDbKey.trim(),
      databaseLock: createDbLock.trim(),
      userName: userName.trim(),
      email: email.trim(),
    };

    try {
      const response = await axios.post(`${apiUrl}/api/items`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        alert("Item created successfully!");
        setItemName("");
        setCategory("");
        setStatus("");
        setLocation("");
        setCreateDbKey("");
        setCreateDbLock("");
        setEmail("");
        fetchItems();
      }
    } catch (err) {
      console.error("Error creating item:", err);
      alert(err.response?.data?.message || "Failed to create the item.");
    }
  };

  const fetchItems = useCallback(async () => {
    console.log("Fetching items with parameters:", { dbKey: fetchDbKey, dbLock: fetchDbLock });
  
    if (!fetchDbKey || !fetchDbLock) {
      alert("Please provide both database key and lock.");
      return;
    }
  
    try {
      const response = await axios.get(`${apiUrl}/api/items`, {
        params: { dbKey: fetchDbKey, dbLock: fetchDbLock, isAdmin: true },
      });
  
      console.log("Response from server:", response.data);
      setItems(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to fetch items.");
    }
  }, [fetchDbKey, fetchDbLock]);
  



  const toggleItemSelected = async (itemId) => {
    if (!fetchDbKey || !fetchDbLock) {
      alert("Database key or lock is missing.");
      return;
    }

    const payload = {
      user: userName || "Admin",
      isAdmin: true,
      dbKey: fetchDbKey.trim(),
      dbLock: fetchDbLock.trim(),
    };

    try {
      const response = await axios.put(`${apiUrl}/api/items/${itemId}/toggle-selected`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setItems((prevItems) =>
        prevItems.map((item) => (item._id === itemId ? response.data : item))
      );
    } catch (err) {
      console.error("Error toggling item:", err);
      alert(err.response?.data?.message || "Failed to toggle the item.");
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`${apiUrl}/api/items/${itemId}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
      alert("Item deleted successfully.");
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete the item.");
    }
  };

  const renderItem = useCallback(
    ({ item }) => (
      <View
        style={[
          styles.detailBox,
          item.isSelected ? styles.selected : styles.unselected,
        ]}
      >
        <Text>Name: {item.itemName}</Text>
        <Text>Category: {item.category}</Text>
        <Text>Status: {item.status}</Text>
        <Text>Location: {item.location}</Text>
        <Text>Selected: {item.isSelected ? "Yes" : "No"}</Text>
        <Text>Toggled By: {item.toggledBy || "None"}</Text>

        <Pressable
          onPress={() => toggleItemSelected(item._id)}
          style={styles.toggleButton}
        >
          <Text>Toggle Selection</Text>
        </Pressable>
        <Pressable
          onPress={() => deleteItem(item._id)}
          style={styles.deleteButton}
        >
          <Text>Delete</Text>
        </Pressable>
      </View>
    ),
    [items]
  );

  return (
    <LinearGradient colors={["#007BFF88", "#00C6FF88"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <BlurView intensity={100} style={styles.glassContainer}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.username}>Logged in as: {userName}</Text>

          <Pressable
            onPress={() => setShowCreateForm(!showCreateForm)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {showCreateForm ? "Hide Create Item Form" : "Show Create Item Form"}
            </Text>
          </Pressable>

          {showCreateForm && (
            <View>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
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
                placeholder="Database Key"
                value={createDbKey}
                onChangeText={setCreateDbKey}
                style={styles.input}
              />
              <TextInput
                placeholder="Database Lock"
                value={createDbLock}
                onChangeText={setCreateDbLock}
                style={styles.input}
              />
              <Pressable onPress={handleCreateItem} style={styles.button}>
                <Text style={styles.buttonText}>Create Item</Text>
              </Pressable>
            </View>
          )}

          <TextInput
            placeholder="Database Key"
            value={fetchDbKey}
            onChangeText={setFetchDbKey}
            style={styles.input}
          />
          <TextInput
            placeholder="Database Lock"
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
  keyExtractor={(item) => item._id || item.id || Math.random().toString()}
  renderItem={renderItem}
  ListEmptyComponent={<Text>No items available.</Text>}
  contentContainerStyle={styles.listContainer} // Add a style for better alignment
/>

        </BlurView>
      </View>
    </LinearGradient>
  );
};

export default AdminDashboard;
