import { global } from '../../styles/globals';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    ...global.spacing.container,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  'heading-1': {
    ...global.spacing.container,
    fontSize: 30,
    fontWeight: 'bold',
    color: global.color.primary.backgroundColor,
  },
  'heading-2': {
    color: global.color.primary.backgroundColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
