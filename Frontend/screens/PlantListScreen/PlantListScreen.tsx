import React, { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BottomNavigationBar,
  FilterOptions,
  Header,
  PlantItemsList,
  SearchInputField,
} from '../../components';
import { global } from '../../styles/globals';

type Props = NativeStackScreenProps<any>;
const text = 'Your plants';
export const PlantListScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
      }}
    >
      <Header navigation={navigation} route={route} text={text} />
      <View style={[global.spacing.container, { flex: 1, marginVertical: 20 }]}>
        <SearchInputField search={search} setSearch={setSearch} />
        <View
          style={[
            {
              flex: 1,
            },
          ]}
        >
          <View
            style={{
              marginVertical: 20,
            }}
          >
            <FilterOptions
              setSelectedCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
            />
          </View>
          <PlantItemsList
            navigation={navigation}
            route={route}
            filter={[selectedCategory, search]}
          />
        </View>
      </View>

      <BottomNavigationBar navigation={navigation} route={route} />
    </View>
  );
};

export default PlantListScreen;
