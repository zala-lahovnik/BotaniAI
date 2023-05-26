import React from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomNavigationBar,
  ExplorePlantCard,
  Header,
} from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { global } from '../../styles/globals';
import { temp_data } from '../HistoryScreen/RecentCaptures';
import { styles } from '../../components/PlantWateringInfoCard/PlantWateringInfoCardStyles';
import ArrowRight from 'react-native-vector-icons/AntDesign';

export const ExploringScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<any>) => {
  const insets = useSafeAreaInsets();

  // TODO: FETCH DATA FROM BACKEND

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
      }}
    >
      <Header
        navigation={navigation}
        route={route}
        text={'Explore'}
        leftAction={() => navigation.goBack()}
      />
      <View style={{ flex: 1 }}>
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
            {temp_data.map((plant, index) => (
              <ExplorePlantCard
                plant={plant}
                key={plant._id}
                navigation={navigation}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <BottomNavigationBar navigation={navigation} route={route} />
    </View>
  );
};
