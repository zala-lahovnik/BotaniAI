import React, { useContext, useLayoutEffect, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomNavigationBar,
  Header,
  PlantWateringInfoCard,
} from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { global } from '../../styles/globals';
import {
  getLastWateredDateIndex,
  getNextWateringDay,
  sortPlantsByWateringStatus,
  WateringStatus,
} from '../../utils/plant-watering-calculations';
import { UserContext } from '../../context/UserContext';
import { PersonalGardenPlant } from '../../types/_plant';

type Props = NativeStackScreenProps<any>;

export const WateringScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const prev_watered_date = useRef('');
  const { user, dispatch } = useContext(UserContext);

  // TODO: FIX BACKEND SO IT DOES NOT RETURN {} INSTEAD OF []
  let personalGardenCopy = [...user.personalGarden];
  let personalGarden: PersonalGardenPlant[] = [];

  try {
    personalGarden = user.personalGarden.map((plant) => {
      return {
        ...plant,
        watering: {
          ...plant.watering,
          wateringArray: JSON.parse(`[${plant.watering.wateringArray}]`),
        },
      };
    }) as PersonalGardenPlant[];
  } catch (error) {
    personalGarden = personalGardenCopy;
  }

  useLayoutEffect(() => {
    prev_watered_date.current = '';
  }, [user.personalGarden]);

  return (
    <View style={{ paddingTop: insets.top, flex: 1 }}>
      <Header
        navigation={navigation}
        route={route}
        text={'Watering'}
        leftAction={() => navigation.navigate('PlantListScreen')}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 30 }}
      >
        <View
          style={[
            global.spacing.container,
            {
              flex: 1,
            },
          ]}
        >
          {sortPlantsByWateringStatus(personalGarden).map((plant, index) => {
            const wateringArray = plant.watering.wateringArray;
            const lastIndex = getLastWateredDateIndex(wateringArray);
            const next_watering_index = lastIndex + 1;

            const next_watering = getNextWateringDay(
              new Date(wateringArray[lastIndex].date),
              new Date(wateringArray[next_watering_index].date)
            );

            if (next_watering !== prev_watered_date.current) {
              prev_watered_date.current = next_watering;
              return (
                <View key={plant._id}>
                  <Text
                    style={[
                      index === 0
                        ? { marginBottom: 10 }
                        : { marginVertical: 10 },
                      {
                        fontSize: 18,
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                        color: global.color.primary.backgroundColor,
                      },
                    ]}
                  >
                    {next_watering}
                  </Text>
                  <PlantWateringInfoCard
                    plant={plant}
                    navigation={navigation}
                    route={route}
                    showWateredButton={
                      next_watering === WateringStatus.Today ||
                      next_watering === WateringStatus.NotWatered
                    }
                  />
                </View>
              );
            } else {
              return (
                <PlantWateringInfoCard
                  key={plant._id}
                  plant={plant}
                  navigation={navigation}
                  route={route}
                  showWateredButton={
                    next_watering === WateringStatus.Today ||
                    next_watering === WateringStatus.NotWatered
                  }
                />
              );
            }
          })}
        </View>
      </ScrollView>
      <BottomNavigationBar navigation={navigation} route={route} />
    </View>
  );
};
