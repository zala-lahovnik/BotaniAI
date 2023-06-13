import React, { useContext, useLayoutEffect, useRef } from 'react';
import { ImageBackground, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomNavigationBar,
  Header,
  NotLoggedIn,
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

type Props = NativeStackScreenProps<any>;

export const WateringScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const prev_watered_date = useRef('');
  const { user } = useContext(UserContext);

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
      {user.userId ? <></> : <NotLoggedIn />}
      {user.personalGarden.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', marginHorizontal: 20 }}>
          <ImageBackground
            style={{
              width: '100%',
              height: '80%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            resizeMode={'contain'}
            source={require('../../assets/no-plants-for-watering.png')}
          >
            <Text
              style={{
                color: global.color.primary.backgroundColor,
                fontSize: 18,
                fontStyle: 'italic',
                textAlign: 'center',
                marginBottom: 20,
                top: 151,
              }}
            >
              No plants to water
            </Text>
          </ImageBackground>
        </View>
      ) : (
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
            {sortPlantsByWateringStatus(user.personalGarden).map(
              (plant, index) => {
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
                        wateringToday={next_watering === WateringStatus.Today}
                        wateringMissed={
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
                      wateringToday={next_watering === WateringStatus.Today}
                      wateringMissed={
                        next_watering === WateringStatus.NotWatered
                      }
                    />
                  );
                }
              }
            )}
          </View>
        </ScrollView>
      )}

      <BottomNavigationBar navigation={navigation} route={route} />
    </View>
  );
};
