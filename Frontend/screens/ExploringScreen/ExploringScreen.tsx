import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomNavigationBar,
  ExplorePlantCard,
  Header,
} from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { global } from '../../styles/globals';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { getAllPlants } from '../../api/_plant';

export const ExploringScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<any>) => {
  const insets = useSafeAreaInsets();

  const { isLoading, isError, data } = useQuery(['plants'], () =>
    getAllPlants()
  );

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
        {isLoading && (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator
              size="large"
              color={global.color.primary.backgroundColor}
            />
          </View>
        )}
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
            {data &&
              data?.map((plant, index) => (
                <ExplorePlantCard
                  plant={plant}
                  key={plant._id}
                  navigation={navigation}
                  route={route}
                />
              ))}
          </View>
        </ScrollView>
      </View>
      <BottomNavigationBar navigation={navigation} route={route} />
    </View>
  );
};
