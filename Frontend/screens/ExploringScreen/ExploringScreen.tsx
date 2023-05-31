import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomNavigationBar,
  ExplorePlantCard,
  Header, NotLoggedIn
} from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { global } from '../../styles/globals';
import { useQuery } from '@tanstack/react-query';
import { getAllPlants } from '../../api/_plant';
import { getUserHistory } from '../../api/_user';

export const ExploringScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<any>) => {
  const insets = useSafeAreaInsets();

  const { isLoading, isError, data } = useQuery(['plants'], () =>
    getAllPlants()
  );

  return (
    <>

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
          <FlatList
            data={data?.slice(0, 10)}
            renderItem={({ item }) => (
              <ExplorePlantCard
                plant={item}
                key={item._id}
                navigation={navigation}
                route={route}
              />
            )}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: 30, marginHorizontal: 20 }}
            onEndReachedThreshold={0.5}
            // TODO: add pagination
            onEndReached={() => {
              console.log('end reached');
            }}
          />
        </View>
        <BottomNavigationBar navigation={navigation} route={route} />
      </View>
    </>
  );
};