import { StyleSheet } from 'react-native';
import { global } from '../../styles/globals';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: global.color.primary.backgroundColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
  },
  circle: {
    backgroundColor: 'white',
    width: 63,
    height: 61,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -25,
    left: '46%',
    borderStyle: 'solid',
    borderWidth: 5,
    borderColor: 'white',
  },
  scanButton: {
    backgroundColor: 'black',
    width: 55,
    height: 55,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -25,
    left: '47.3%',
  },
});
