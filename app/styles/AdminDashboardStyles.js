import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2ad0f5',
    
    
  },
  glassContainer: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent background for glass effect
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent border for glass effect
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent background for inputs
    color: '#fff',
  },
  button: {
    padding: 12,
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
    backgroundColor: '#32CD32',
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }, 
  untoggleRequest: {
    backgroundColor: '#FFD700', // Gold background for items with untoggle requests
  },
  untoggleRequestText: {
    color: '#FF0000', // Red text for untoggle request indicator
    fontWeight: 'bold',
  },
   adminSelected: {
    backgroundColor: 'FFD700',
  }
  
  
});

export default styles;
