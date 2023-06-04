import React, { useRef } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomNavigationBar,
  ExplorePlantCard,
  Header,
} from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { global } from '../../styles/globals';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getAllPlants } from '../../api/_plant';

export const ExploringScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<any>) => {
  const insets = useSafeAreaInsets();
  const offset = useRef(0);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      ['plants'],
      ({ pageParam = 1 }) => getAllPlants(pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
        getPreviousPageParam: (firstPage, allPages) => {
          return offset.current > 1 ? offset.current - 1 : undefined;
        },
        staleTime: 1000 * 60 * 60 * 24,
      }
    );

  const plants = data?.pages.flatMap((page) => page) || [];

  const handleLoadMore = () => {
    if (hasNextPage) {
      offset.current += 1;
      fetchNextPage();
    }
  };

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
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator
                size="large"
                color={global.color.primary.backgroundColor}
              />
            </View>
          )}
          <FlatList
            // ref={flatListRef}
            data={plants}
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
            style={{ marginBottom: 40, marginHorizontal: 20 }}
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator
                  size="large"
                  color={global.color.primary.backgroundColor}
                />
              ) : null
            }
          />
        </View>
        <BottomNavigationBar navigation={navigation} route={route} />
      </View>
    </>
  );
};
