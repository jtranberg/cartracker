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
    backgroundColor: 'rgba(242, 124, 13, 0.94)', 
    borderColor: 'rgba(39, 2, 2, 0.96)',
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
    marginTop:2,
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
    width:{width},
    height:{height},
  },
  selected: {
    backgroundColor: 'rgba(14, 245, 245, 0.71)',
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
    justifyContent:"center",
    
    paddingLeft:24,
    minWidth:90,
    height:45,
    backgroundColor: 'rgba(247, 26, 26, 0.86)',
    borderRadius: 6,
    
  },
  
  shareButton: {
    padding: 10,
    backgroundColor: 'rgba(241, 97, 25, 0.96)',
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 5,
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
    width: width * 0.9,
    padding: 15,
    borderRadius: 2, // Slightly rounded for a paper-like feel
    backgroundColor: 'rgb(247, 223, 182)',
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
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    textDecorationLine: 'underline', // Underlined title for a document-like heading
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginVertical: 5,
    textAlign: 'left', // Align left for a structured form look
    paddingHorizontal: 5,
    borderBottomWidth: 1, // Underline each field to mimic a form
    borderBottomColor: '#ccc',
    width: '100%',
  },
  
  sliderContainer: {
    marginVertical: 10,
    gap:10,
    
    
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  
});

export default styles;
