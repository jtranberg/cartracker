import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#2ad0f5',
  },
  glassContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    padding: 3,
    fontSize: 20,    
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: '#333',
  },
  button: {
    padding: 12,
    minWidth:90,
    backgroundColor: '#007BFF',
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  detailBox: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
  },
  selected: {
    backgroundColor: '#d3f9d8',
  },
  hidden: {
    backgroundColor: '#f0e68c',
  },
  detailsText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  hideButton: {
    padding: 10,
    backgroundColor: '#FFA500',
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 10,
  },
  hideButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 10,
    minWidth:90,
    backgroundColor: '#FF6347',
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  shareButton: {
    padding: 10,
    backgroundColor: 'orange',
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 3,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }, 
  untoggleRequest: {
    backgroundColor: '#FFD700', 
  },
  untoggleRequestText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  adminSelected: {
    backgroundColor: '#FFD700',
  },
  username: {
    color: '#333',
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },

  /** ✅ Fullscreen Card Styling **/
  cardContainer: {
    //width: '90%', // Full screen width
    height: "90%", // Almost full screen height
    padding: 50,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0, 
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 1.5,
    textAlign: 'center',
  },
  sliderContainer: {
    marginVertical: 10,
    gap:10,
    
  },
});

export default styles;
