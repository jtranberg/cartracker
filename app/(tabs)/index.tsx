import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen'; 
import RegisterScreen from '../screens/RegisterScreen'; 
import AdminDashboard from '../screens/AdminDashboard'; 
import TechDashboard from '../screens/TechDashboard'; 
import VehicleDetails from '../screens/VehicleDetails'; 
import HomeScreen from '../screens/HomeScreen'; 

const Stack = createStackNavigator();

export default function AppTabs() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="TechDashboard" component={TechDashboard} />
      <Stack.Screen name="VehicleDetails" component={VehicleDetails} />
    </Stack.Navigator>
  );
}
