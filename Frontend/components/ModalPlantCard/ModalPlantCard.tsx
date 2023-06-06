import React, { useEffect, useState } from 'react';
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
  const ref = React.useRef(View.prototype)
  const moveAnim = new Animated.Value(0)
  const [xPos, setXPos] = React.useState(0)

  const currentToValue = (customName.length / 25)
  const currentDuration = (customName.length / 13) * 5000

  const loopedFunction = () => {
    if(customName.length >= 12)
      Animated.loop(
        Animated.sequence([
          Animated.delay(2000),
          Animated.timing(moveAnim, {
            toValue: currentToValue,
            easing: Easing.linear,
            duration: currentDuration,
            useNativeDriver: true,
          }),
          Animated.delay(2000),
          Animated.timing(moveAnim, {
            toValue: 0,
            easing: Easing.linear,
            duration: 1000,
            useNativeDriver: true
          })
        ])
      ).start()
  }

  useEffect(() => {
    getOnlineImageUri(image)
      .then((result) => {
        setImageUri(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [image]);

  useEffect(() => {
    ref.current.measure((x, y, w, h, xAbs, yAbs) => {
      setXPos(xAbs)});
    loopedFunction();
  }, [moveAnim]);

  const translateX = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -xPos]
  })

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
          <Animated.View
            ref={ref}
            style={[{transform: [{translateX}], alignItems: 'stretch', justifyContent: 'center'}]}
          >
            <Text style={styles.text}>
              {customName}
            </Text>
          </Animated.View>
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
    alignSelf: 'flex-start',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  text: {
    fontStyle: 'italic',
    width: '500%',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
