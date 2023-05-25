import React, { useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-elements';
import { PlantImage } from '../PlantItemCardOverlay/PlantItemCardOverlay';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Watering from 'react-native-vector-icons/Entypo';
import Water from 'react-native-vector-icons/Ionicons';
import Checkmark from 'react-native-vector-icons/Ionicons';
import Calender from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './PlantWateringInfoCardStyles';
import { VirtualPlant } from '../../types/_plant';
import {
  getNumberBetweenDates,
  getWateringPercentage,
} from '../../utils/plant-watering-calculations';
import { global } from '../../styles/globals';

const PlantWateringInfo = ({
  children,
  text,
}: React.PropsWithChildren & { text: string }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
      }}
    >
      {children}
      <Text
        style={{
          maxWidth: 80,
          textAlign: 'center',
        }}
      >
        {text}
      </Text>
    </View>
  );
};

type Props = NativeStackScreenProps<any> & {
  plant: VirtualPlant;
};

export const PlantWateringInfoCard = ({ navigation, route, plant }: Props) => {
  const cardAnimation = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = React.useState(false);

  const handlePress = () => {
    setExpanded(!expanded);
    let toValue = expanded ? 0 : 1;
    Animated.timing(cardAnimation, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const cardTranslateX = cardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  const wateredButtonTranslateX = cardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={handlePress}
    >
      <Animated.View
        style={[
          styles.cardLayout,
          { transform: [{ translateX: cardTranslateX }] },
        ]}
      >
        <View>
          {/*TODO: PLANT IMAGE WRONG FORMAT*/}
          <PlantImage imageSrc={plant.image} small />
        </View>
        <View style={styles.cardInfoLayout}>
          <View
            style={{
              alignSelf: 'flex-start',
              position: 'relative',
            }}
          >
            <Text style={styles.cardTitle}>{plant.customName}</Text>
            <Divider
              style={{
                marginVertical: 2,
                position: 'relative',
                left: 0,
                right: 0,
              }}
              orientation="horizontal"
              width={1}
              color="black"
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-start',
              gap: 20,
            }}
          >
            <PlantWateringInfo
              text={`${getWateringPercentage(
                plant.daysWatered[plant.daysWatered.length - 1],
                Number(plant.intervalZalivanja)
              )}%`}
            >
              <Water name={'water-sharp'} size={16} color={'#000'} />
            </PlantWateringInfo>
            <PlantWateringInfo text={`${plant.waterAmount}ml`}>
              <Watering name={'water'} size={16} color={'#000'} />
            </PlantWateringInfo>
            <PlantWateringInfo
              text={`${getNumberBetweenDates(
                plant.daysWatered[plant.daysWatered.length - 1]
              )} days since last`}
            >
              <Calender name={'calendar-clock'} size={16} color={'#000'} />
            </PlantWateringInfo>
          </View>
        </View>
      </Animated.View>
      <Animated.View
        style={[
          styles.wateredButton,
          {
            transform: [{ translateX: wateredButtonTranslateX }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.wateredButtonTouchable}
          activeOpacity={0.8}
          onPress={() => {
            {
              /* TODO: set plant as watered*/
            }
          }}
        >
          <Text style={styles.wateredButtonText}>Watered</Text>
          <Checkmark
            name={'checkmark'}
            size={28}
            color={global.color.heading.color}
          />
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
};
