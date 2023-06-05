import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import WaterIcon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PersonalGardenPlant } from '../../types/_plant';
import { getOnlineImageUri } from '../../firebase/firebase';

type Props = {
  customName: PersonalGardenPlant['customName'];
  image: PersonalGardenPlant['image'];
  navigation: NativeStackNavigationProp<any>;
};

export const ModalPlantCard = ({ navigation, customName, image }: Props) => {
  const [imageUri, setImageUri] = useState(image || '');

  useEffect(() => {
    getOnlineImageUri(image)
      .then((result) => {
        setImageUri(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [image]);

  return (
    <TouchableOpacity
      style={{ marginHorizontal: 10 }}
      onPress={() => {
        navigation.navigate('Water');
      }}
    >
      <ImageBackground
        blurRadius={1.1}
        source={{ uri: imageUri || '' }}
        resizeMode={'cover'}
        style={styles.card}
      >
        <WaterIcon
          name={'water'}
          size={70}
          color={'#fff'}
          style={styles.waterIcon}
        />
        <Text style={styles.text}>{customName}</Text>
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
    width: 90,
    height: '90%',
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
