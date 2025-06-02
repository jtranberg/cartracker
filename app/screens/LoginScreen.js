import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_BASE_URL =
  Constants.expoConfig?.extra?.PROD_API_URL ||
  "https://cartracker-t4bc.onrender.com";

console.log("🌍 Using API_BASE_URL:", API_BASE_URL);

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const prefillEmail = async () => {
      const savedEmail = await AsyncStorage.getItem("pendingEmail");
      if (savedEmail) {
        setEmail(savedEmail);
        await AsyncStorage.removeItem("pendingEmail");
      }
    };
    prefillEmail();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    try {
      console.log("🔄 Sending login request to:", `${API_BASE_URL}/login`);
      console.log("📧 Login Data:", { email, password });

      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      console.log("✅ Server response:", response.data);

      if (response.data.success && response.data.token) {
        const userPlan = response.data.plan || "free";

        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem("username", response.data.username || "Unknown");
        await AsyncStorage.setItem("plan", userPlan); // ✅ This line ensures HomeScreen sees correct plan

        console.log(`🔐 Logged in as ${response.data.username}, plan: ${userPlan}`);
        router.replace("/screens/HomeScreen");
      } else {
        setErrorMessage(response.data.message || "Login failed");
        console.log("⚠️ Login failed:", response.data.message);
      }
    } catch (error) {
      console.error("❌ Error during login:", error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred during login"
      );
      console.log("❌ Full Error Response:", error.response?.data);
      console.log("❌ HTTP Status:", error.response?.status);
      console.log("❌ Response Headers:", error.response?.headers);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/office.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Log In" onPress={handleLogin} color="#1E90FF" />

        <Text
          style={styles.registerLink}
          onPress={() => router.push("/screens/RegisterScreen")}
        >
          Don't have an account? Register
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  registerLink: {
    marginTop: 20,
    textAlign: "center",
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
});
