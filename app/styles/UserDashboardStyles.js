import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    background: {
      flex: 1,
      justifyContent: 'center',
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
      borderRadius: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderWidth: 1,
      overflow: 'hidden',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: '#fff',
    },
    usernameText: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 15,
      color: '#fff',
    },
    input: {
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.5)',
      padding: 15,
      marginBottom: 15,
      borderRadius: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      color: '#333',
      fontSize: 18,
    },
    button: {
      backgroundColor: '#1E90FF',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 5,
      marginBottom: 15,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    dataBox: {
      padding: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      marginVertical: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    selected: {
      backgroundColor: '#d3f9d8',
    },
    dataText: {
      fontSize: 16,
      color: '#333',
    },
    toggleButton: {
      backgroundColor: '#00BFFF',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      alignItems: 'center',
    },
    requestButton: {
      backgroundColor: '#FF4500',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      alignItems: 'center',
    },
    errorText: {
      color: 'red',
      textAlign: 'center',
    },
    adminSelected: {
      backgroundColor: '#FFD700', /* Gold background for admin-selected items */
    },
    userSelected: {
      backgroundColor: 'FF6347', /* Tomato background for user-selected items */
    }
    
    
  });
  export default styles;