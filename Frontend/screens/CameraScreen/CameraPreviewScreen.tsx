import React from 'react';
import { ImageBackground, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraCapturedPicture } from 'expo-camera/src/Camera.types';
import { Header } from '../../components';

type Props = NativeStackScreenProps<any> & {
  photo: CameraCapturedPicture;
};

export const CameraPreviewScreen = ({ navigation, photo, route }: Props) => {
  return (
    <>
      <Header
        navigation={navigation}
        text={'Preview'}
        leftAction={() => navigation.goBack()}
        route={route}
      />
      <View
        style={{
          backgroundColor: 'transparent',
          flex: 1,
        }}
      >
        <ImageBackground
          source={{ uri: photo && photo.uri }}
          style={{
            flex: 1,
          }}
        />
      </View>
    </>
  );
};
