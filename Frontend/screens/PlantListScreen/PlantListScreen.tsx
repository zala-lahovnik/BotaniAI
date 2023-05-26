import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BottomModal,
  BottomNavigationBar,
  DrawerLayout,
  FilterOptions,
  Header,
  ModalPlantCard,
  PlantItemsList,
  SearchInputField,
} from '../../components';
import { global } from '../../styles/globals';
import { Drawer } from 'react-native-drawer-layout';
import WaterIcon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<any>;
const text = 'Your plants';
export const PlantListScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <Drawer
      open={drawerOpen}
      onOpen={() => setDrawerOpen(true)}
      onClose={() => setDrawerOpen(false)}
      renderDrawerContent={() => {
        return <DrawerLayout />;
      }}
      drawerStyle={{
        paddingTop: insets.top,
        backgroundColor: global.color.primary.backgroundColor,
      }}
    >
      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          flex: 1,
        }}
      >
        <Header
          navigation={navigation}
          route={route}
          text={text}
          home
          leftAction={() => {
            setDrawerOpen(true);
          }}
        />
        <View
          style={[global.spacing.container, { flex: 1, marginVertical: 20 }]}
        >
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
      <BottomModal isVisible={modalOpen} onClose={() => setModalOpen(false)}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={{
            height: '100%',
            width: '100%',
            padding: 20,
            flex: 1,
            flexDirection: 'row',
          }}
        >
          {/*  TODO: replace this with filtered array */}
          {[
            { latin: 'Lorem', image: require('../../assets/sample_plant.png') },
          ].map((item, index) => (
            <ModalPlantCard key={index} navigation={navigation} {...item} />
          ))}
        </ScrollView>
      </BottomModal>
    </Drawer>
  );
};

export default PlantListScreen;
