import React, { useEffect, useState, useRef } from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
      style={{ marginHorizontal: 10, zIndex: 1000 }}
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
        <View style={styles.textContainer}>
          <Animated.Text
            style={[styles.text]}
            numberOfLines={1}
            // ellipsizeMode={'clip'}
          >
            {customName}
          </Animated.Text>
        </View>
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
    top: '45%',
    right: '50%',
    transform: [{ translateX: 25 }, { translateY: -35 }],
  },
  textContainer: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    left: 0,
    height: 30,
    width: '130%',
    overflow: 'hidden',
  },
  text: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 15,
    width: '100%',
  },
});
