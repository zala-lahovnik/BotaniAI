import React, { PropsWithChildren, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { global } from '../../styles/globals';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoadingModal } from '../SignInLoadingModal/LoadingModal';

type Props = PropsWithChildren &
  NativeStackScreenProps<any> & {
    text: string;
  };

export const PhotoInputCard = ({
  text,
  children,
  navigation,
  route,
}: Props) => {
  const capturedImage = useRef<ImagePickerAsset | null>(null);
  const [loading, setLoading] = React.useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        base64: true,
      });
      setLoading(true);
      if (!result.canceled) {
        let filename = result?.assets[0].uri.substring(
          result?.assets[0].uri.lastIndexOf('/') + 1,
          result?.assets[0].uri.length
        );

        // @ts-ignore
        delete result.cancelled;
      }
      if (result) {
        navigation.navigate('BlankScreen', {
          photo: result.assets![0],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingModal loading={loading} title={'Image Loading'} />}
      <TouchableOpacity
        style={[styles.container]}
        activeOpacity={0.8}
        onPress={
          text === 'Gallery'
            ? pickImage
            : () => navigation.navigate('CameraScreen')
        }
      >
        <View
          style={{
            position: 'absolute',
            top: -20,
            left: '14%',
            zIndex: 1,
            backgroundColor: global.color.primary.backgroundColor,
            borderRadius: 10,
            padding: 5,
            width: 150,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: global.color.secondary.color,
            }}
          >
            {text}
          </Text>
        </View>
        {children}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 150,
    borderRadius: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
});
