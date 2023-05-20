import React from 'react';
import { View } from 'react-native';
import { Header, PhotoInputCard } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { global } from '../../styles/globals';
import FolderImages from 'react-native-vector-icons/Entypo';
import Camera from 'react-native-vector-icons/FontAwesome5';

type Props = NativeStackScreenProps<any>;
export const PhotoInputScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
      }}
    >
      <Header
        navigation={navigation}
        route={route}
        text={'How would you like to add a photo?'}
        leftAction={() => navigation.goBack()}
      />
      <View
        style={[
          global.spacing.container,
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 50,
          },
        ]}
      >
        <PhotoInputCard text={'Gallery'} navigation={navigation} route={route}>
          <FolderImages
            name={'images'}
            size={50}
            color={global.color.primary.backgroundColor}
          />
        </PhotoInputCard>
        <PhotoInputCard text={'Camera'} navigation={navigation} route={route}>
          <Camera
            name={'camera'}
            size={50}
            color={global.color.primary.backgroundColor}
          />
        </PhotoInputCard>
      </View>
    </View>
  );
};
