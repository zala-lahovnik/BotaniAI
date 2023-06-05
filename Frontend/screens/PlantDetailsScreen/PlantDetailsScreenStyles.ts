import { StyleSheet } from 'react-native';
import { global } from '../../styles/globals';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
    padding: 20,
  },
  latinPlantName: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    color: global.color.primary.backgroundColor,
  },
  commonName: {
    marginBottom: 10,
    fontStyle: 'italic',
    fontSize: 16,
  },
  plantCategoryPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,80,80,0.4)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  plantDescription: {
    fontSize: 14,
    color: 'gray',
    lineHeight: 19,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
    backgroundColor: global.color.primary.backgroundColor,
    borderRadius: 10,
  },
});
