import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

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
    backgroundColor: 'rgba(151, 202, 224, 0.56)',
    borderColor: 'rgba(11, 54, 139, 0.66)',
    borderWidth: 2,
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
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
    fontWeight: '800',
    fontSize:18,
  },
  // dataBox: {
  //   padding: 10,
  //   borderWidth: 1,
  //   borderColor: '#ddd',
  //   borderRadius: 5,
  //   marginVertical: 5,
  //   backgroundColor: 'rgba(255, 255, 255, 0.3)',
  // },
  selected: {
    backgroundColor: 'rgba(246, 173, 114, 0.99)',
    
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
    borderColor: 'rgba(11, 54, 139, 0.66)',
    borderWidth: 2,
  },
  // requestButton: {
  //   backgroundColor: '#FF4500',
  //   padding: 10,
  //   borderRadius: 5,
  //   marginTop: 10,
  //   alignItems: 'center',
  // },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  // adminSelected: {
  //   backgroundColor: '#FFD700', /* Gold background for admin-selected items */
  // },
  // userSelected: {
  //   backgroundColor: '#FF6347', /* Tomato background for user-selected items */
  // },
  /** ✅ Added Card Slider Styles **/
  cardContainer: {
  width: width * 0.74,
  padding: 15,
  borderRadius: 2, // Slightly rounded for a paper-like feel
  backgroundColor: 'rgb(247, 223, 182)', // Updated background color
  borderColor: '#000', // Strong black border like an official document
  borderWidth: 1.5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
  alignItems: 'flex-start',
  marginVertical: 10,
  paddingVertical: 20,
  gap: 5,
},

  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    textDecorationLine: 'underline', // Adds an official document heading look
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginVertical: 5,
    textAlign: 'left', // Left align text for a form-like structure
    paddingHorizontal: 5,
    borderBottomWidth: 1, // Line under text for form structure
    borderBottomColor: '#ccc',
    width: '100%',
  },
  
  sliderContainer: {
    marginVertical: 20,
    
  },
});

export default styles;
