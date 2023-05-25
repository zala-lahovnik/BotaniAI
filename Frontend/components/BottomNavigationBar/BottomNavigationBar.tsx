import React, { ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './BottomNavigationBarStyles';
import MdScanSharp from 'react-native-vector-icons/Ionicons';
import Search from 'react-native-vector-icons/AntDesign';
import History from 'react-native-vector-icons/FontAwesome';
import Home from 'react-native-vector-icons/Entypo';
import Water from 'react-native-vector-icons/Entypo';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type NavigationProps = NativeStackScreenProps<any>;
type NavigationItemProps = {
  name?: string;
  icon: ReactNode;
};

const navigationItems: NavigationItemProps[] = [
  {
    name: 'Home',
    icon: <Home name="home" size={20} color="white" />,
  },
  {
    name: 'Water',
    icon: <Water name="water" size={20} color="white" />,
  },
  {
    icon: <View style={{ marginHorizontal: 5 }} />,
  },
  {
    name: 'History',
    icon: <History name="history" size={20} color="white" />,
  },
  {
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
    <View style={[styles.container]}>
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

      {navigationItems.map((item, index) => {
        return (
          <NavigationItem
            key={index}
            {...item}
            onPress={() => {
              {
                item.name ? navigation.navigate(item.name) : null;
              }
            }}
          />
        );
      })}
    </View>
  );
};
