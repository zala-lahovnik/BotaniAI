import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
// accent color: red
export const global: Record<
  string,
  Record<string, ViewStyle & ImageStyle & TextStyle>
> = {
  // spacing
  spacing: {
    margin: {
      marginHorizontal: 10,
    },
    container: {
      marginHorizontal: 20,
      marginVertical: 10,
    },
  },
  // colors
  color: {
    primary: {
      backgroundColor: '#124A3F',
    },
    secondary: {
      color: '#CDE3D6',
    },
    heading: {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    text: {
      color: 'rgba(255, 255, 255, 0.2)',
    },
    'button-dark': {
      color: '#30312C',
    },
    'button-press': {
      color: 'rgba(255, 255, 255, 0.2)',
    },
  },

  // fonts
  font: {
    primary: {
      /* custom font */
    },
  },
};
