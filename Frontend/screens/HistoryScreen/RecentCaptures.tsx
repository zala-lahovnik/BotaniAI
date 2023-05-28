import React, { useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { BottomNavigationBar, Header, NotLoggedIn, RecentPlantCard } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type VirtualPlant } from '../../types/_plant';
import { global } from '../../styles/globals';
import { getImageCaptureTime } from '../../utils/plant-watering-calculations';
import { Divider } from 'react-native-elements';
import { auth } from "../../firebase/firebase";


export const temp_data: VirtualPlant[] = [
  {
    _id: '1',
    plantId: '123',
    customName: 'My plant',
    prviDanZalivanja: new Date(Date.now() - 86400000),
    intervalZalivanja: '7',
    date: new Date(Date.now() - 14400000),
    image: require('../../assets/sample_plant.png'),
    waterAmount: 100,
    daysWatered: [new Date('2023-05-20')],
  },
  {
    _id: '2',
    plantId: '223',
    customName: 'My plant 2',
    prviDanZalivanja: new Date(Date.now() - 86400000),
    intervalZalivanja: '3',
    date: new Date(Date.now() - 345600000),
    image: require('../../assets/sample_plant.png'),
    waterAmount: 200,
    daysWatered: [new Date('2023-05-21')],
  },
  {
    _id: '3',
    plantId: '323',
    customName: 'My plant 3',
    prviDanZalivanja: new Date(Date.now() - 86400000),
    intervalZalivanja: '2',
    date: new Date(Date.now() - 86400000),
    image: require('../../assets/sample_plant.png'),
    waterAmount: 300,
    daysWatered: [new Date('2023-05-18')],
  },
  {
    _id: '4',
    plantId: '423',
    customName: 'My plant 4',
    prviDanZalivanja: new Date(Date.now() - 86400000),
    intervalZalivanja: '1',
    date: new Date(Date.now() - 864000000),
    image: require('../../assets/sample_plant.png'),
    waterAmount: 400,
    daysWatered: [new Date('2023-05-24')],
  },
  {
    _id: '5',
    plantId: '423',
    customName: 'My plant 4',
    prviDanZalivanja: new Date(Date.now() - 86400000),
    intervalZalivanja: '1',
    date: new Date(Date.now() - 964000000),
    image: require('../../assets/sample_plant.png'),
    waterAmount: 400,
    daysWatered: [new Date('2023-05-22')],
  },
];

type Props = NativeStackScreenProps<any>;

export const RecentCaptures = ({ navigation, route }: Props) => {
  const prev_captured_ref =
    useRef<ReturnType<typeof getImageCaptureTime>>(null);
  const insets = useSafeAreaInsets();

  return (
    <>
      {auth.currentUser?.email ? (
        <View style={{ paddingTop: insets.top, flex: 1 }}>
          <Header
            navigation={navigation}
            route={route}
            text={'Recent Captures'}
            leftAction={() => navigation.goBack()}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: 30 }}
          >
            <View style={[global.spacing.container, { flex: 1 }]}>
              {temp_data.map((plant, index) => {
                const date = plant.date;
                const captureTime = getImageCaptureTime(date);
                if (prev_captured_ref.current !== captureTime) {
                  prev_captured_ref.current = captureTime;
                  return (
                    <View key={plant._id}>
                      {index !== 0 && (
                        <Divider
                          style={[
                            {
                              marginVertical: 20,
                              marginHorizontal: 10,
                            },
                          ]}
                          orientation="horizontal"
                          width={2}
                          color={global.color.primary.backgroundColor as string}
                        />
                      )}
                      <Text
                        style={[
                          {
                            fontSize: 18,
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            color: global.color.primary.backgroundColor,
                          },
                        ]}
                      >
                        {captureTime}
                      </Text>
                      <RecentPlantCard
                        plant={plant}
                        captureTime={captureTime}
                        date={date}
                        navigation={navigation}
                        route={route}
                        watering={'Every 1-2 days'}
                        latin={'Lorem ipsum '}
                        classificationPercent={80}
                      />
                    </View>
                  );
                } else {
                  return (
                    <RecentPlantCard
                      key={plant._id}
                      plant={plant}
                      captureTime={captureTime}
                      date={date}
                      navigation={navigation}
                      route={route}
                      watering={'Every 1-2 days'}
                      latin={'Lorem ipsum '}
                      classificationPercent={80}
                    />
                  );
                }
              })}
            </View>
          </ScrollView>
          <BottomNavigationBar navigation={navigation} route={route} />
        </View>
      ) : (<NotLoggedIn />)}</>
  );
};
