import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      console.log('🔍 Checking user token:', token);
      setIsLoggedIn(!!token);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null; // Prevent flickering

  console.log('🔄 Redirecting to:', isLoggedIn ? '/screens/HomeScreen' : '/screens/LoginScreen');
  return <Redirect href={isLoggedIn ? '/screens/HomeScreen' : '/screens/LoginScreen'} />;
}

