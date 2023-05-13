import { StyleSheet } from 'react-native';
// accent color: red
export const global: Record<string, StyleSheet.NamedStyles<any>> = {
  // spacing
  spacing: {
    margin: {
      marginHorizontal: 10,
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
      color: 'rgba(255, 255, 255, 0.5)',
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

// export type global = typeof global;
