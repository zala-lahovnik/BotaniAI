import React from 'react';
import { Animated, ScrollView, View } from 'react-native';
import { PlantItemCard } from '../PlantItemCard/PlantItemCard';
// @ts-ignore
import imageSrc from '../../assets/sample_plant.png';
import FlatList = Animated.FlatList;

const plants = [
  {
    id: 1,
    plantName: 'Plant 1 Plant 1',
    plantDescription: 'Plant 1 description',
    plantImage: imageSrc,
    plantWaterPercent: 40,
  },
  {
    id: 2,
    plantName: 'Plant 2',
    plantDescription: 'Plant 2 description',
    plantImage: imageSrc,
    plantWaterPercent: 60,
  },
  {
    id: 3,
    plantName: 'Plant 3',
    plantDescription: 'Plant 3 description',
    plantImage: imageSrc,
    plantWaterPercent: 80,
  },
  {
    id: 4,
    plantName: 'Plant 4',
    plantDescription: 'Plant 4 description',
    plantImage: imageSrc,
    plantWaterPercent: 100,
  },
  {
    id: 5,
    plantName: 'Plant 5',
    plantDescription: 'Plant 5 description',
    plantImage: imageSrc,
    plantWaterPercent: 0,
  },
];

type Props = {
  filter: [string, string];
  navigation: any;
  route: any;
};

export const PlantItemsList = ({ filter, navigation, route }: Props) => {
  // TODO: Filter plants based on filter from backend
  const [isVerticalScroll, setIsVerticalScroll] = React.useState(false);

  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const isScrollingUp =
      contentOffset.y > 0 &&
      contentOffset.y + layoutMeasurement.height < contentSize.height;
    setIsVerticalScroll(isScrollingUp);
  };

  return (
    <FlatList
      data={plants}
      keyExtractor={(item) => item.id.toString()}
      onScroll={handleScroll}
      renderItem={({ item }) => (
        <PlantItemCard
          route={route}
          navigation={navigation}
          setIsVerticalScroll={setIsVerticalScroll}
          isVerticalScroll={isVerticalScroll}
          {...item}
          onSwipeLeft={() => console.log('swipped')}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};
