import React, { useContext, useRef } from 'react';
import { ImageBackground, ScrollView, Text, View } from 'react-native';
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
    <View style={{ paddingTop: insets.top, flex: 1 }}>
      <Header
        navigation={navigation}
        route={route}
        text={'Recent Captures'}
        leftAction={() => navigation.goBack()}
      />
      {user.userId ? <></> : <NotLoggedIn />}
      {user.history.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', marginHorizontal: 20 }}>
          <ImageBackground
            style={{
              width: '100%',
              height: '80%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            resizeMode={'contain'}
            source={require('../../assets/no-recent-captures.png')}
          >
            <Text
              style={{
                color: global.color.primary.backgroundColor,
                fontSize: 18,
                fontStyle: 'italic',
                textAlign: 'center',
                marginBottom: 20,
                top: 111,
              }}
            >
              No recent captures
            </Text>
          </ImageBackground>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: 45 }}
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
                      classificationPercent={plant.result}
                    />
                  );
                }
              })}
            </View>
          </ScrollView>
        </>
      )}
      <BottomNavigationBar navigation={navigation} route={route} />
    </View>
  );
};
