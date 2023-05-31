import React from 'react';
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { global } from '../../styles/globals';
import Schedule from 'react-native-vector-icons/MaterialIcons';
import { Divider } from 'react-native-elements';
import { PlantItemCardOverlay } from '../PlantItemCardOverlay/PlantItemCardOverlay';
import { styles } from './PlantItemCardStyles';

type Props = NativeStackScreenProps<any> & {
  onSwipeLeft?: () => void;
  isVerticalScroll: boolean;
  setIsVerticalScroll: (isVerticalScroll: boolean) => void;
  props: any;
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
          In{' '}
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            {waterNeededInDays}
          </Text>
          days
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
  const { latin, common, image, description, watering } = props;
  return (
    <View style={[global.color.primary, styles.plantItemCard__container]}>
      <PlantNextWatering waterNeededInDays={2} />
      <PlantNextWatering waterNeededInDays={2} />
      <PlantItemCardOverlay
        plantName={latin}
        plantImage={image.buffer}
        plantDescription={common}
        plantWaterPercent={0}
        navigation={navigation}
        route={route}
        setIsVerticalScroll={setIsVerticalScroll}
        isVerticalScroll={isVerticalScroll}
      />
    </View>
  );
};
