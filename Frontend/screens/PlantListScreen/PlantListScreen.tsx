import React, { useCallback, useContext, useState } from 'react';
import { ImageBackground, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BottomModal,
  BottomNavigationBar,
  DrawerLayout,
  Header,
  ModalPlantCard,
  NotLoggedIn,
  PlantItemsList,
  SearchInputField,
} from '../../components';
import { global } from '../../styles/globals';
import { Drawer } from 'react-native-drawer-layout';
import { UserContext } from '../../context/UserContext';
import { filterPlants } from '../../utils/plants-filtering';
import { PersonalGardenPlant } from '../../types/_plant';
import {
  getLastWateredDateIndex,
  getNextWateringDay,
  sortPlantsByWateringStatus,
  WateringStatus,
} from '../../utils/plant-watering-calculations';

type Props = NativeStackScreenProps<any>;
const text = 'Your plants';
export const PlantListScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const firstRender = React.useRef(true);

  const { user } = useContext(UserContext);

  const [modalOpen, setModalOpen] = useState(user.notifications);

  useCallback(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setModalOpen(false);
  }, []);

  const sortedByWatering = sortPlantsByWateringStatus(user.personalGarden);

  return (
    <Drawer
      open={drawerOpen}
      onOpen={() => (user.userId ? setDrawerOpen(true) : setDrawerOpen(false))}
      onClose={() =>
        user.userId ? setDrawerOpen(false) : setDrawerOpen(false)
      }
      renderDrawerContent={() => {
        return <DrawerLayout navigation={navigation} route={route} />;
      }}
      drawerStyle={{
        paddingTop: insets.top,
        backgroundColor: global.color.primary.backgroundColor,
      }}
    >
      <View
        style={{
          paddingTop: insets.top,
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
        {user.userId ? <></> : <NotLoggedIn />}
        <View
          style={[global.spacing.container, { flex: 1, marginVertical: 20 }]}
        >
          <SearchInputField
            search={search}
            setSearch={setSearch}
            plants={user.personalGarden as PersonalGardenPlant[]}
          />
          <View
            style={[
              {
                flex: 1,
                marginBottom: 20,
              },
            ]}
          >
            {user.personalGarden.length === 0 ? (
              <View style={{}}>
                <ImageBackground
                  style={{
                    width: '100%',
                    height: '80%',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                  resizeMode={'contain'}
                  source={require('../../assets/empty-virtual-garden.png')}
                >
                  <Text
                    style={{
                      color: global.color.primary.backgroundColor,
                      fontSize: 18,
                      fontStyle: 'italic',
                      textAlign: 'center',
                      marginBottom: 20,
                    }}
                  >
                    You don't have any plants in your virtual garden yet.
                  </Text>
                </ImageBackground>
              </View>
            ) : (
              <>
                <View
                  style={{
                    marginVertical: 10,
                  }}
                ></View>
                {user?.personalGarden && (
                  <PlantItemsList
                    navigation={navigation}
                    route={route}
                    plants={filterPlants(user.personalGarden, search)}
                  />
                )}
              </>
            )}
          </View>
        </View>

        <BottomNavigationBar navigation={navigation} route={route} />
      </View>
      <BottomModal
        isVisible={
          modalOpen &&
          firstRender.current &&
          new Date(
            sortedByWatering[0].watering.wateringArray[
              getLastWateredDateIndex(
                sortedByWatering[0].watering.wateringArray
              ) + 1
            ].date
          ) <= new Date(new Date().toISOString().split('T')[0])
        }
        onClose={() => setModalOpen(false)}
      >
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
          {sortedByWatering.map((plant, index) => {
            const wateringArray = plant.watering.wateringArray;
            const lastIndex = getLastWateredDateIndex(wateringArray);
            const next_watering_index = lastIndex + 1;

            const next_watering = getNextWateringDay(
              new Date(wateringArray[lastIndex].date),
              new Date(wateringArray[next_watering_index].date)
            );
            if (
              next_watering === WateringStatus.NotWatered ||
              next_watering === WateringStatus.Today
            ) {
              return (
                <ModalPlantCard
                  key={index}
                  navigation={navigation}
                  {...plant}
                />
              );
            }
          })}
        </ScrollView>
      </BottomModal>
    </Drawer>
  );
};

export default PlantListScreen;
