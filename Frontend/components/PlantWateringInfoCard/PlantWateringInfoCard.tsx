import React, { useCallback, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-elements';
import { PlantImage } from '../PlantItemCardOverlay/PlantItemCardOverlay';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Watering from 'react-native-vector-icons/Entypo';
import Water from 'react-native-vector-icons/Ionicons';
import Checkmark from 'react-native-vector-icons/Ionicons';
import Calender from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './PlantWateringInfoCardStyles';
import {
  getLastWateredDateIndex,
  getNumberBetweenDates,
  getWateringPercentage,
} from '../../utils/plant-watering-calculations';
import { global } from '../../styles/globals';
import { PersonalGardenPlant } from '../../types/_plant';
import { UserActionType, UserContext } from '../../context/UserContext';
import { updatePlant } from '../../api/_user';

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
  plant: PersonalGardenPlant;
  showWateredButton?: boolean;
};

export const PlantWateringInfoCard = ({
  navigation,
  route,
  plant,
  showWateredButton,
}: Props) => {
  const cardAnimation = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = React.useState(false);

  const { user, dispatch } = React.useContext(UserContext);

  const lastWateredIndex = getLastWateredDateIndex(
    plant.watering.wateringArray
  );
  const lastWateredDate = new Date(
    plant.watering.wateringArray[lastWateredIndex].date
  );

  const handlePress = () => {
    setExpanded(!expanded);
    let toValue = expanded ? 0 : 1;
    Animated.timing(cardAnimation, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // TODO: FIX DATE UPDATE
  const handleUpdateWateringDate = useCallback(
    async (plant: PersonalGardenPlant) => {
      try {
        const response = await updatePlant(user?.userId, plant._id, plant);
        if (response) {
          dispatch({
            type: UserActionType.UPDATE_PERSONAL_GARDEN,
            payload: plant,
          });
        }
      } catch (e) {
        console.error(e);
      }
    },
    []
  );

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
          showWateredButton && { transform: [{ translateX: cardTranslateX }] },
        ]}
      >
        <View>
          {/*TODO: PLANT IMAGE WRONG FORMAT*/}
          <PlantImage imageSrc={plant.image.buffer || plant.image} small />
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
                lastWateredDate,
                parseInt(plant.watering.numberOfDays)
              )}%`}
            >
              <Water name={'water-sharp'} size={16} color={'#000'} />
            </PlantWateringInfo>
            <PlantWateringInfo
              text={(plant.watering.amountOfWater || '0') + 'ml'}
            >
              <Watering name={'water'} size={16} color={'#000'} />
            </PlantWateringInfo>
            <PlantWateringInfo
              text={`${getNumberBetweenDates(lastWateredDate)} days since last`}
            >
              <Calender name={'calendar-clock'} size={16} color={'#000'} />
            </PlantWateringInfo>
          </View>
        </View>
      </Animated.View>
      <Animated.View
        style={[
          styles.wateredButton,
          showWateredButton && {
            transform: [{ translateX: wateredButtonTranslateX }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.wateredButtonTouchable}
          activeOpacity={0.8}
          onPress={() => {
            // TODO: WHAT IF WATERING IS MISSED

            let dispatchPlant = {
              ...plant,
              watering: {
                ...plant.watering,
                wateringArray: plant.watering.wateringArray.map((item) =>
                  item.date === new Date().toISOString().split('T')[0]
                    ? { ...item, watered: true }
                    : item
                ),
              },
            };
            return handleUpdateWateringDate(dispatchPlant);
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
