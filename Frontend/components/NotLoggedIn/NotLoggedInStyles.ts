import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#134b3f',
    color: 'white',
    marginHorizontal: 25,
    borderRadius: 25,
    padding: 15,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    color: 'white',
  },
  button: {
    backgroundColor: 'black',
    width: '70%',
    height: 45,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    textTransform: 'uppercase',
    fontSize: 10,
    color: 'white',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
