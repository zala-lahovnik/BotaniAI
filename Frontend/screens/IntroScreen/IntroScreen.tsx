import { ActivityIndicator, View } from 'react-native';
import { styles } from './IntroStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Onboarding } from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useRef, useState } from 'react';
import { LoginScreen } from '../LoginScreen/LoginScreen';
import { ActionType, UserContext } from '../../context/UserContext';
import PlantListScreen from '../PlantListScreen/PlantListScreen';

const Loading = () => {
  return (
    <View>
      <ActivityIndicator size={'large'} />
    </View>
  );
};
type Props = NativeStackScreenProps<any>;
export const IntroScreen = ({ navigation, route }: Props) => {
  const [loading, setLoading] = useState(true);
  const [viewOnboarding, setViewOnboarding] = useState(false);

  const { user: loggedUser, dispatch } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem('@viewedOnboarding');
        if (value) {
          setViewOnboarding(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loggedUser.userId) {
    return <PlantListScreen navigation={navigation} route={route} />;
  }

  if (viewOnboarding) {
    return <LoginScreen navigation={navigation} route={route} />;
  }

  return (
    <View style={styles.container}>
      {loading ? <Loading /> : <Onboarding />}
    </View>
  );
};
