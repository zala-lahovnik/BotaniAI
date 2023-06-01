import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { CameraPreviewScreen } from '../CameraScreen/CameraPreviewScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<any>;
const BlankScreen = ({ navigation, route }: Props) => {
  const { photo } = route.params as any;
  const insets = useSafeAreaInsets();

  if (photo) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          paddingTop: insets.top,
        }}
      >
        <CameraPreviewScreen
          navigation={navigation}
          route={route}
          photo={photo}
        />
      </View>
    );
  } else {
    return (
      <View>
        <Text>No Photo</Text>
      </View>
    );
  }
};

export default BlankScreen;
