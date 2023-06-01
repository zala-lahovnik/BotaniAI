import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TouchableOpacity, View } from 'react-native';
import { styles } from '../../screens/CameraScreen/CameraScreenStyles';
import ArrowBack from 'react-native-vector-icons/Ionicons';

export const BackButton = ({
  navigation,
}: Pick<NativeStackScreenProps<any>, 'navigation'>) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        backgroundColor: 'transparent',
      }}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <ArrowBack name="arrow-back" size={40} color="black" />
      </TouchableOpacity>
    </View>
  );
};
