import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  inputEditable: {
    backgroundColor: '#e0f7fa', 
    color: '#00796b',
    borderColor: '#00796b',
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 10,
  },
  button: {
    padding: 10,
    marginVertical: 15,
    borderRadius: 10,
    backgroundColor: '#007BFF',
  },
  buttonPressed: {
    backgroundColor: '#0056b3',
  },
});

export default globalStyles;
