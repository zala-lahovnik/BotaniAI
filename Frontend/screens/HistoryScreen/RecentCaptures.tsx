import React, { useContext, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  BottomNavigationBar,
  Header,
  NotLoggedIn,
  RecentPlantCard,
} from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { global } from '../../styles/globals';
import { getImageCaptureTime } from '../../utils/plant-watering-calculations';
import { Divider } from 'react-native-elements';
import { UserContext } from '../../context/UserContext';

type Props = NativeStackScreenProps<any>;

export const RecentCaptures = ({ navigation, route }: Props) => {
  const prev_captured_ref = useRef('');

  const { user } = useContext(UserContext);

  const insets = useSafeAreaInsets();

  return (
    <>
      {(user.userId !== '' || user.email !== '') ? (
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
              {user.history.map((plant, index) => {
                const date = plant.date;
                const captureTime = getImageCaptureTime(new Date(date));
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
                        date={new Date(date)}
                        navigation={navigation}
                        route={route}
                        classificationPercent={plant.result}
                      />
                    </View>
                  );
                } else {
                  return (
                    <RecentPlantCard
                      key={plant._id}
                      plant={plant}
                      captureTime={captureTime}
                      date={new Date(date)}
                      navigation={navigation}
                      route={route}
                      classificationPercent={plant.result}
                    />
                  );
                }
              })}
            </View>
          </ScrollView>
          <BottomNavigationBar navigation={navigation} route={route} />
        </View>
      ) : (
        <NotLoggedIn />
      )}
    </>
  );
};
