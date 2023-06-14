import React, { ReactNode } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { styles } from './BottomNavigationBarStyles';
import MdScanSharp from 'react-native-vector-icons/Ionicons';
import Search from 'react-native-vector-icons/AntDesign';
import History from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Entypo';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type NavigationProps = NativeStackScreenProps<any>;
type NavigationItemProps = {
  id?: string;
  name?: string;
  icon: ReactNode;
};

const navigationItems: NavigationItemProps[] = [
  {
    id: '01',
    name: 'PlantListScreen',
    icon: <Icon name="home" size={20} color="white" />,
  },
  {
    id: '02',
    name: 'Water',
    icon: <Icon name="water" size={20} color="white" />,
  },
  {
    id: '03',
    icon: <View style={{ marginHorizontal: 5 }} />,
  },
  {
    id: '04',
    name: 'History',
    icon: <History name="history" size={20} color="white" />,
  },
  {
    id: '05',
    name: 'Explore',
    icon: <Search name="search1" size={20} color="white" />,
  },
];

const NavigationItem = ({
  onPress,
  icon,
}: NavigationItemProps & { onPress?: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.4}>
      {icon}
    </TouchableOpacity>
  );
};

export const BottomNavigationBar = ({ navigation }: NavigationProps) => {
  return (
    <View
      style={[styles.container, Platform.OS === 'ios' ? { height: 80 } : null]}
    >
      <View style={styles.circle} />
      <TouchableOpacity
        style={styles.scanButton}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('PhotoInputScreen');
        }}
      >
        <MdScanSharp name="scan-sharp" size={30} color="white" />
      </TouchableOpacity>

      {navigationItems.map((item) => {
        return (
          <NavigationItem
            key={item.id}
            {...item}
            onPress={() => {
              item.name ? navigation.navigate(item.name) : null;
            }}
          />
        );
      })}
    </View>
  );
};
