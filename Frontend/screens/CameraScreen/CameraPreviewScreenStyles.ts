import { StyleSheet } from 'react-native';
import { global } from "../../styles/globals";

export const previewStyles = StyleSheet.create({
  photoButtonsContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '90%'
  },
  usePhotoButton: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 25,
    borderStyle: 'solid',
    borderColor: global.color.primary.backgroundColor,
    borderWidth: 2
  },
  resultsContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    width: '100%',
  },
  resultsContent: {
    marginRight: 25,
    marginLeft: 25,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 25,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: global.color.primary.backgroundColor,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  predictionsContainer: {
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
  },
  predictionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: global.color.primary.backgroundColor,
    marginBottom: 11,
  },
  predictionDescription: {
    color: global.color.primary.backgroundColor
  },
  continueButtonContainer: {
    alignSelf: 'center',
    justifyContent: 'flex-end'
  },
  continueButton: {
    backgroundColor: '#124A3F',
    borderRadius: 56,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 14,
    paddingBottom: 14,
  },
  continueButtonImage: {
    width: 20,
    height: 15
  }
});
