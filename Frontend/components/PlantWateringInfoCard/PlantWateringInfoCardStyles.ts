import { StyleSheet } from 'react-native';
import { global } from '../../styles/globals';

export const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    height: 100,
    position: 'relative',
    overflow: 'hidden',
  },
  cardLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: global.color.primary.backgroundColor,
  },
  cardInfoLayout: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'space-between',
    height: 70,
  },
  wateredButton: {
    position: 'absolute',
    top: 0,
    right: -80,
    width: 80,
    padding: 10,
    backgroundColor: global.color.primary.backgroundColor,
    height: 100,
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
    zIndex: 1,
  },
  wateredButtonText: {
    color: global.color.heading.color,
    fontSize: 14,
    fontWeight: 'bold',
  },
  wateredButtonTouchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
