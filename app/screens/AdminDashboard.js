import React, { useState, useEffect } from "react";
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
import { Linking } from "react-native";

import Constants from "expo-constants";

const isProduction = Constants.expoConfig?.extra?.ENV === "production";
const apiUrl = isProduction
  ? Constants.expoConfig?.extra?.API_URL || "https://igotit-t2uz.onrender.com"
  : "http://localhost:5000"; // Your local backend URL

console.log("API URL:", apiUrl);


function AdminDashboard() {
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
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const showWelcomeAlert = async () => {
      try {
        const dismissed = await AsyncStorage.getItem("welcomeAlertDismissed");
        if (dismissed === "true") return;

        Alert.alert(
          "Welcome to Admin Dashboard",
          "Here you can create items, toggle their selection, and manage your inventory. Use the database key and lock to access your data.",
          [
            {
              text: "Got it",
              onPress: () => console.log("Alert dismissed temporarily"),
            },
            {
              text: "Put Away Forever",
              onPress: async () => {
                await AsyncStorage.setItem("welcomeAlertDismissed", "true");
                console.log("Alert dismissed permanently");
              },
              style: "destructive",
            },
          ]
        );
      } catch (error) {
        console.error("Error showing welcome alert:", error);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem("username");
        if (storedUserName) setUserName(storedUserName);
      } catch (error) {
        console.error("Failed to fetch user details from AsyncStorage:", error);
      }
    };

    showWelcomeAlert();
    fetchUserDetails();
  }, []);

  const handleCreateItem = async () => {
    // Validate all required fields
    if (
      !itemName.trim() ||
      !category.trim() ||
      !status.trim() || // Added status to validation
      !location.trim() || // Added location to validation
      !createDbKey.trim() ||
      !createDbLock.trim() ||
      !userName.trim() ||
      !email.trim()
    ) {
      alert(
        "Please fill out all required fields: Item Name, Category, Status, Location, Database Key, Database Lock, User Name, and Email."
      );
      return;
    }
  
    const payload = {
      itemName: itemName.trim(),
      category: category.trim(),
      status: status.trim() || "Available",
      location: location.trim() || "Unknown",
      databaseKey: createDbKey.trim(),
      databaseLock: createDbLock.trim(),
      createdBy: userName.trim(),
      email: email.trim(),
    };
  
    console.log("Payload being sent to the server:", payload); // Debug payload
  
    try {
      const response = await axios.post(`${apiUrl}/api/items`, payload, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 201) {
        alert("Item created successfully!");
        // Reset fields
        setEmail("");
        setItemName("");
        setCategory("");
        setStatus("");
        setLocation("");
        setCreateDbKey("");
        setCreateDbLock("");
        fetchItems();
      } else {
        console.error("Response error:", response.data);
        alert(response.data.message || "Failed to create item. Please try again.");
      }
    } catch (error) {
      console.error("Error creating item:", error.response || error);
      if (error.response) {
        alert(error.response.data.message || "Validation error occurred.");
      } else {
        alert("Failed to connect to the server. Please check your network.");
      }
    }
  };
  
  
  

  const fetchItems = async () => {
    if (!fetchDbKey || !fetchDbLock) {
      alert("Please enter both database key and lock to fetch items.");
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/api/items`, {
        params: { dbKey: fetchDbKey, dbLock: fetchDbLock, isAdmin: true },
      });
      setItems(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to fetch items. Please try again.");
    }
  };

  const toggleItemSelected = async (itemId) => {
    try {
      const selectedItem = items.find((item) => item._id === itemId);
      const toggledByUser = selectedItem.isSelected ? null : userName;
  
      // Check if admin needs to override
      const isAdminOverride = selectedItem.isSelected && selectedItem.toggledBy !== userName;
  
      const response = await axios.put(
        `${apiUrl}/api/items/${itemId}/toggle-selected`,
        {
          user: toggledByUser,
          isAdmin: true,
          adminOverride: isAdminOverride, // Admin override flag
          dbKey: fetchDbKey,
          dbLock: fetchDbLock,
        },
        { headers: { "Content-Type": "application/json" } }
      );
  
      const updatedItem = response.data;
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        )
      );
    } catch (error) {
      console.error("Error toggling item selected state:", error);
      alert(
        error.response?.data?.message || "Failed to toggle item selected state."
      );
    }
  };
  

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`${apiUrl}/api/items/${itemId}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
      alert("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item.");
    }
  };

  const handleEmailKey = async () => {
    if (!fetchDbKey) {
      alert("Please enter the database key before emailing.");
      return;
    }

    const email = "user@example.com";
    const subject = encodeURIComponent("Your Database Access Key");
    const body = encodeURIComponent(
      `Here is your database key:\n\nKey: ${fetchDbKey}\n\nPlease keep this information secure.`
    );

    try {
      const supported = await Linking.canOpenURL(`mailto:${email}?subject=${subject}&body=${body}`);
      if (supported) {
        await Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
      } else {
        alert("Unable to open email client.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send the email.");
    }
  };

  return (
    <LinearGradient colors={["#007BFF88", "#00C6FF88"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <BlurView intensity={100} style={styles.glassContainer}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.username}>Logged in as: {userName}</Text>

          <Pressable onPress={() => setShowCreateForm(!showCreateForm)} style={styles.button}>
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
          <Pressable onPress={handleEmailKey} style={styles.button}>
            <Text style={styles.buttonText}>Email Database Key</Text>
          </Pressable>

          <FlatList
            data={items}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.detailBox,
                  item.isSelected ? styles.selected : styles.unselected,
                ]}
              >
                <Pressable
                  onPress={() => toggleItemSelected(item._id)}
                  style={styles.toggleItem}
                >
                  <Text style={styles.detailsText}>Name: {item.itemName}</Text>
                  <Text style={styles.detailsText}>Category: {item.category}</Text>
                  <Text style={styles.detailsText}>Status: {item.status}</Text>
                  <Text style={styles.detailsText}>Location: {item.location}</Text>
                  <Text style={styles.detailsText}>
                    Selected: {item.isSelected ? "Yes" : "No"}
                  </Text>
                  <Text style={styles.detailsText}>
                    Toggled By: {item.toggledBy || "Unknown"}
                  </Text>
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
