import React from 'react';
import { Animated, ScrollView, View } from 'react-native';
import { PlantItemCard } from '../PlantItemCard/PlantItemCard';
import FlatList = Animated.FlatList;
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PersonalGardenPlant } from '../../types/_plant';

type Props = NativeStackScreenProps<any> & {
  plants: PersonalGardenPlant[];
};

export const PlantItemsList = ({ navigation, route, plants }: Props) => {
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
      keyExtractor={(item) => item._id}
      onScroll={handleScroll}
      renderItem={({ item }) => (
        <PlantItemCard
          route={route}
          navigation={navigation}
          setIsVerticalScroll={setIsVerticalScroll}
          isVerticalScroll={isVerticalScroll}
          props={item}
          onSwipeLeft={() => console.log('swipped')}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};
