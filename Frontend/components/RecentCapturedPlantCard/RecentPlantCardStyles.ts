import { StyleSheet } from 'react-native';
import { global } from '../../styles/globals';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  rowLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  customNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: global.color.primary.backgroundColor,
    // maxWidth: '100%',
    position: 'relative',
  },
  latinNameText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  expandButton: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  plantDetailsContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    overflow: 'hidden',
  },
  plantDetailsRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantDetailsHeader: {
    fontWeight: 'bold',
    color: global.color.primary.backgroundColor,
  },
  plantDetailsText: {
    fontStyle: 'italic',
  },
});
