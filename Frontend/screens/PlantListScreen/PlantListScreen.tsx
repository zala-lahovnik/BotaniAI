import React, { useContext, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BottomModal,
  BottomNavigationBar,
  DrawerLayout,
  FilterOptions,
  Header,
  ModalPlantCard,
  NotLoggedIn,
  PlantItemsList,
  SearchInputField,
} from '../../components';
import { global } from '../../styles/globals';
import { Drawer } from 'react-native-drawer-layout';
import { UserContext } from '../../context/UserContext';
import { useQuery } from '@tanstack/react-query';
import { getUserPersonalGarden } from '../../api/_user';
import { filterPlants } from '../../utils/plants-filtering';
import { PersonalGardenPlant } from '../../types/_plant';

type Props = NativeStackScreenProps<any>;
const text = 'Your plants';
export const PlantListScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  const { user, dispatch } = useContext(UserContext);

  const { isLoading, isError, data } = useQuery(['user_personal_garden'], () =>
    getUserPersonalGarden('33xOgIFa2DOIfAw2fExTB9MPh8T2')
  );

  return (
    <>
      {user ? (
        <Drawer
          open={drawerOpen}
          onOpen={() => setDrawerOpen(true)}
          onClose={() => setDrawerOpen(false)}
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
              style={[
                global.spacing.container,
                { flex: 1, marginVertical: 20 },
              ]}
            >
              <SearchInputField
                search={search}
                setSearch={setSearch}
                plants={data as PersonalGardenPlant[]}
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
                {data && (
                  <PlantItemsList
                    navigation={navigation}
                    route={route}
                    plants={filterPlants(data, search)}
                  />
                )}
              </View>
            </View>

            <BottomNavigationBar navigation={navigation} route={route} />
          </View>
          <BottomModal
            isVisible={modalOpen}
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
              {/*  TODO: replace this with filtered array */}
              {[
                {
                  latin: 'Lorem',
                  image: require('../../assets/sample_plant.png'),
                },
              ].map((item, index) => (
                <ModalPlantCard key={index} navigation={navigation} {...item} />
              ))}
            </ScrollView>
          </BottomModal>
        </Drawer>
      ) : (
        <NotLoggedIn />
      )}
    </>
  );
};

export default PlantListScreen;
