import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
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

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const firstRender = React.useRef(true);

  const { user, dispatch } = useContext(UserContext);

  const [modalOpen, setModalOpen] = useState(user.notifications);

  // const { isLoading, isError, data } = useQuery(['user_personal_garden'], () =>
  //   getUserPersonalGarden('33xOgIFa2DOIfAw2fExTB9MPh8T2')
  // );

  useCallback(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setModalOpen(false);
  }, []);

  {
    /*  TODO: REMOVE THIS PART WHEN THERE IS NEW MONGO COLLECTION */
  }
  let personalGardenCopy = [...user.personalGarden];
  let personalGarden: PersonalGardenPlant[] = [];

  try {
    personalGarden = user.personalGarden.map((plant) => {
      return {
        ...plant,
        watering: {
          ...plant.watering,
          wateringArray: JSON.parse(`[${plant.watering.wateringArray}]`),
        },
      };
    }) as PersonalGardenPlant[];
  } catch (error) {
    personalGarden = personalGardenCopy;
  }

  return (
    <Drawer
      open={drawerOpen}
      onOpen={() => user.userId ? setDrawerOpen(true) : setDrawerOpen(false)}
      onClose={() => user.userId ? setDrawerOpen(false) : setDrawerOpen(false)}
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
        {user.userId ? (<></>) : (<NotLoggedIn />)}
        <View
          style={[
            global.spacing.container,
            { flex: 1, marginVertical: 20 },
          ]}
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
              },
            ]}
          >
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
          </View>
        </View>

        <BottomNavigationBar navigation={navigation} route={route} />
      </View>
      <BottomModal
        isVisible={modalOpen && firstRender.current}
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
          {sortPlantsByWateringStatus(personalGarden).map(
            (plant, index) => {
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
            }
          )}
        </ScrollView>
      </BottomModal>
    </Drawer>
  );
};

export default PlantListScreen;
