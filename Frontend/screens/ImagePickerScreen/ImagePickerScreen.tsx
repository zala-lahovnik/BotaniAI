import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { PermissionNeeded } from '../../components/PermissionCard/PermissionNeeded';

type Props = NativeStackScreenProps<any>;
export const ImagePickerScreen = ({ navigation, route }: Props) => {
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [cancelled, setCancelled] = React.useState(false);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: true,
      });
      if (!result.canceled) {
        let filename = result?.assets[0].uri.substring(
          result?.assets[0].uri.lastIndexOf('/') + 1,
          result?.assets[0].uri.length
        );

        // @ts-ignore
        delete result.cancelled;
      } else {
        setCancelled(true);
      }
      if (result) {
        navigation.navigate('BlankScreen', {
          photo: result.assets![0],
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (!status?.granted) {
    return (
      <PermissionNeeded
        permission={'We need permission to access your media library'}
        navigation={navigation}
        requestPermission={requestPermission}
      />
    );
  } else if (!cancelled) {
    pickImage().then((mes: any) => console.log(mes));
  } else {
    navigation.goBack();
  }

  return <View />;
};
