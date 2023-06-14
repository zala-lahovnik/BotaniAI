import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
  getWateringDaysPro,
  getWateringPercentage,
} from '../../utils/plant-watering-calculations';
import { global } from '../../styles/globals';
import { PersonalGardenPlant } from '../../types/_plant';
import { UserActionType, UserContext } from '../../context/UserContext';
import { updatePlant, type UpdatePlant } from '../../api/_user';
import { InternetConnectionContext } from '../../context/InternetConnectionContext';

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
  wateringToday: boolean;
  wateringMissed: boolean;
};

export const PlantWateringInfoCard = ({
  plant,
  wateringToday,
  wateringMissed,
}: Props) => {
  const cardAnimation = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const showWateredButton = wateringToday || wateringMissed;

  const { user, dispatch } = React.useContext(UserContext);
  const { isConnected } = React.useContext(InternetConnectionContext);

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

  const handleUpdateWateringDate = async (plant: PersonalGardenPlant) => {
    let requestPayload: UpdatePlant = {
      customName: plant.customName,
      firstDay: plant.watering.firstDay,
      numberOfDays: plant.watering.numberOfDays,
      amountOfWater: plant.watering.amountOfWater,
      wateringArray: plant.watering.wateringArray,
      image: plant.image,
      description: plant.description,
    };

    try {
      setLoading(true);
      const response = await updatePlant(
        user?.userId,
        plant._id,
        requestPayload
      );
      if (response) {
        let usersPersonalGarden = [...user.personalGarden];
        usersPersonalGarden = usersPersonalGarden.map((item) => {
          if (item._id === plant._id) {
            return plant;
          }
          return item;
        });

        dispatch({
          type: UserActionType.UPDATE_PERSONAL_GARDEN,
          payload: usersPersonalGarden,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
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
          showWateredButton && { transform: [{ translateX: cardTranslateX }] },
        ]}
      >
        <View>
          <PlantImage imageSrc={plant.image || ''} small />
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
              text={`${getNumberBetweenDates(lastWateredDate)} day${
                getNumberBetweenDates(lastWateredDate) > 1 ? 's' : ''
              } ago`}
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
        {!loading ? (
          <TouchableOpacity
            style={styles.wateredButtonTouchable}
            activeOpacity={0.8}
            disabled={!isConnected}
            onPress={() => {
              let wateringArray = plant.watering.wateringArray;
              let today = new Date().toISOString().split('T')[0];
              let lastWateredIndex = getLastWateredDateIndex(wateringArray);
              wateringArray = [
                ...wateringArray.slice(0, lastWateredIndex + 1),
                {
                  date: today,
                  watered: true,
                },
              ];

              let modifiedWateringArray = getWateringDaysPro(
                plant.watering.numberOfDays,
                plant.watering.firstDay,
                wateringArray || []
              );
              let dispatchPlant = {
                ...plant,
                watering: {
                  ...plant.watering,
                  wateringArray: modifiedWateringArray,
                },
              };

              handleUpdateWateringDate(dispatchPlant as PersonalGardenPlant);
            }}
          >
            <Text style={styles.wateredButtonText}>Watered</Text>
            <Checkmark
              name={'checkmark'}
              size={28}
              color={global.color.heading.color}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.wateredButtonTouchable}>
            <ActivityIndicator
              size="small"
              color={global.color.heading.color}
            />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};
