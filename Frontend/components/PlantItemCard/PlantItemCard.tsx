import React from 'react';
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { global } from '../../styles/globals';
import Schedule from 'react-native-vector-icons/MaterialIcons';
import { Divider } from 'react-native-elements';
import { PlantItemCardOverlay } from '../PlantItemCardOverlay/PlantItemCardOverlay';
import { styles } from './PlantItemCardStyles';
import { type PersonalGardenPlant } from '../../types/_plant';
import {
  getLastWateredDateIndex,
  getNumberOfDaysTillNextWatering,
  getWateringPercentage,
} from '../../utils/plant-watering-calculations';

type Props = NativeStackScreenProps<any> & {
  onSwipeLeft?: () => void;
  isVerticalScroll: boolean;
  setIsVerticalScroll: (isVerticalScroll: boolean) => void;
  props: PersonalGardenPlant;
};

const PlantNextWatering = ({
  waterNeededInDays,
}: {
  waterNeededInDays: number;
}) => {
  return (
    <View style={styles.plantNextWatering__container}>
      <View style={styles.plantNextWatering__item}>
        <Schedule
          name={'schedule'}
          size={20}
          color={global.color.secondary.color}
        />
        <Text
          style={{
            color: global.color.secondary.color,
            fontSize: 10,
          }}
        >
          NEXT WATERING
        </Text>
        <Text
          style={{
            color: global.color.secondary.color,
            fontStyle: 'italic',
          }}
        >
          {waterNeededInDays < 0 ? '' : 'In '}
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            {Math.abs(waterNeededInDays)}
          </Text>
          {waterNeededInDays < 0 ? ' days ago' : ' days'}
        </Text>
        <Divider
          style={{ width: '50%' }}
          width={1}
          color={global.color.secondary.color as string}
          orientation="horizontal"
        />
      </View>
    </View>
  );
};

export const PlantItemCard = ({
  navigation,
  route,
  onSwipeLeft,
  setIsVerticalScroll,
  isVerticalScroll,
  props,
}: Props) => {
  let { _id, latin, common, customName, image, description, watering } = props;

  // TODO: FIX WATERING ARRAY FROM {} TO []

  const wateringCopy = watering;

  try {
    watering = {
      ...watering,
      wateringArray: JSON.parse(`[${watering.wateringArray}]`),
    };
  } catch (e) {
    watering = wateringCopy;
  }

  const lastWateredIndex = getLastWateredDateIndex(watering.wateringArray);
  const lastWateredDate = new Date(
    watering.wateringArray[lastWateredIndex].date
  );

  let waterPercent = getWateringPercentage(
    lastWateredDate,
    parseInt(watering.numberOfDays)
  );
  let nextWatering = getNumberOfDaysTillNextWatering(
    new Date(watering.wateringArray[lastWateredIndex + 1].date)
  );

  return (
    <View style={[global.color.primary, styles.plantItemCard__container]}>
      {[1, 2].map((_, index) => (
        <PlantNextWatering key={index} waterNeededInDays={nextWatering} />
      ))}
      <PlantItemCardOverlay
        plantId={_id}
        latin={latin}
        plantCustomName={customName}
        plantWatering={watering}
        plantDescription={description}
        plantImage={image.buffer || image}
        plantCommon={common}
        plantWaterPercent={waterPercent}
        navigation={navigation}
        route={route}
        setIsVerticalScroll={setIsVerticalScroll}
        isVerticalScroll={isVerticalScroll}
      />
    </View>
  );
};
