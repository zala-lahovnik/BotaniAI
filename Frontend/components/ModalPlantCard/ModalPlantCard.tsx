import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import WaterIcon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  latin: string;
  image: string;
  navigation: NativeStackNavigationProp<any>;
};

export const ModalPlantCard = ({ navigation, latin, image }: Props) => {
  return (
    <TouchableOpacity
      style={{ marginHorizontal: 10 }}
      onPress={() => {
        navigation.navigate('Water');
      }}
    >
      <ImageBackground
        blurRadius={1.1}
        // TODO: REPLACE THIS WITH URI
        source={require('../../assets/sample_plant.png')}
        resizeMode={'cover'}
        style={styles.card}
      >
        <WaterIcon
          name={'water'}
          size={70}
          color={'#fff'}
          style={styles.waterIcon}
        />
        <Text style={styles.text}>{latin}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    opacity: 0.9,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 100,
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  waterIcon: {
    position: 'absolute',
    top: '50%',
    right: '50%',
    transform: [{ translateX: 25 }, { translateY: -35 }],
  },
  text: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    fontStyle: 'italic',
  },
});
