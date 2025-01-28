// styles/LoginScreenStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    overlayWrapper: {
      flex: 1,
    },
    gradientOverlay: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.)', // Additional transparent background
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    glassContainer: {
      width: '100%',
      maxWidth: 350,
      padding: 20,
      borderRadius: 20,
      backgroundColor: 'rgba(192, 249, 250, 0.7)', // Adjust transparency for more glass-like appearance
      borderColor: 'rgba(255, 255, 255, 0.7)',
      borderWidth: 1,
      overflow: 'hidden',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: '#333',
    },
    input: {
      borderWidth: 1,
      fontSize: 18,
      borderColor: 'rgba(255, 255, 255, 1)',
      padding: 15,
      marginBottom: 15,
      borderRadius: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.7)', // Slightly more transparent input background
      color: '#333',
    },
    error: {
      color: 'red',
      textAlign: 'center',
      marginBottom: 10,
    },
    button: {
      backgroundColor: '#333',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    registerButton: {
      marginTop: 20,
      alignItems: 'center',
    },
    registerText: {
      color: '#333',
      textDecorationLine: 'underline',
      fontSize: 18,
    },
  });
  export default styles;