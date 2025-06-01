import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

export default function HomeScreen() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const storedPlan = await AsyncStorage.getItem("plan"); // Get the plan
      if (!token) {
        router.replace("/screens/LoginScreen");
      } else {
        setIsLoggedIn(true);
        setPlan(storedPlan || "free"); // Default to free
      }
    };

    checkAuthStatus();
  }, []);

  if (!isLoggedIn) return null;

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
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#f39c12" }]}
                  onPress={() => Linking.openURL("https://theinandoutapp.com")}
                >
                  <Text style={styles.buttonText}>Upgrade to Pro</Text>
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
