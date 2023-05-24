import React, { useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomNavigationBar,
  Header,
  PlantWateringInfoCard,
} from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { global } from '../../styles/globals';
import { temp_data } from '../HistoryScreen/RecentCaptures';
import {
  getNextWateringDay,
  sortPlantsByWateringStatus,
} from '../../utils/plant-watering-calculations';

type Props = NativeStackScreenProps<any>;

export const WateringScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const prev_watered_date = useRef('');
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
          {sortPlantsByWateringStatus(temp_data).map((plant, index) => {
            const next_watering = getNextWateringDay(
              plant.prviDanZalivanja,
              plant.intervalZalivanja
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
