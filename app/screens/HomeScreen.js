import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Linking,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";

const API_BASE_URL =
  Constants.expoConfig?.extra?.PROD_API_URL ||
  "https://cartracker-t4bc.onrender.com";

export default function HomeScreen() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [plan, setPlan] = useState(null);
  const [emailForCheckout, setEmailForCheckout] = useState("");

useEffect(() => {
  const checkAuthStatus = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const storedPlan = await AsyncStorage.getItem("plan");
    const savedEmail = await AsyncStorage.getItem("pendingEmail");

    if (!token) {
      router.replace("/screens/LoginScreen");
    } else {
      setIsLoggedIn(true);
      setPlan(storedPlan || "free");

      // Pre-fill email if pending from Stripe
      if (savedEmail) {
        setEmailForCheckout(savedEmail);
        if (storedPlan === "pro") {
          await AsyncStorage.removeItem("pendingEmail"); // ✅ clear if upgraded
        }
      }
    }
  };

  checkAuthStatus();
}, []);


 const handleUpgrade = async () => {
  if (!emailForCheckout) {
    Alert.alert("Missing Email", "Please enter your email to continue.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailForCheckout }),
    });

    const data = await response.json();

    if (data.alreadyPaid) {
      Alert.alert("✅ Already Subscribed", "You've already unlocked Pro features!");
      return;
    }

    if (data.url) {
      Linking.openURL(data.url);
    } else {
      Alert.alert("Error", "Unable to initiate checkout.");
    }
  } catch (err) {
    console.error("Checkout Error:", err);
    Alert.alert("Error", "Something went wrong while starting checkout.");
  }
};


  return (
    <ImageBackground
      source={require("../../assets/images/office.png")}
      style={styles.background}
    >
      <LinearGradient
        colors={["rgba(14,110,126,0.7)", "rgba(8,159,190,0.7)"]}
        style={styles.background}
      >
        <View style={styles.container}>
          <BlurView intensity={80} style={styles.innerContainer}>
            <Text style={styles.title}>The In and Out App</Text>
            <Text style={styles.message}>Business Items Tracker</Text>

            {plan === "pro" ? (
              <>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => router.push("/screens/AdminDashboard")}
                >
                  <Text style={styles.buttonText}>Go to Admin Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => router.push("/screens/UserDashboard")}
                >
                  <Text style={styles.buttonText}>Go to User Dashboard</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.message}>
                  🚫 Premium features are locked
                </Text>
                <TextInput
                  placeholder="Enter your email"
                  value={emailForCheckout}
                  onChangeText={setEmailForCheckout}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#f39c12" }]}
                  onPress={handleUpgrade}
                >
                  <Text style={styles.buttonText}>Get Access</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#333" }]}
              onPress={async () => {
                await AsyncStorage.removeItem("userToken");
                await AsyncStorage.removeItem("plan");
                router.replace("/screens/LoginScreen");
              }}
            >
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  innerContainer: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#fff",
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});
