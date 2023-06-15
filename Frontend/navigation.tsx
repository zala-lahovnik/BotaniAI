import * as React from 'react';
import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  CameraScreen,
  ChangePasswordScreen,
  ExploringScreen,
  ImagePickerScreen,
  IntroScreen,
  LoginScreen,
  PhotoInputScreen,
  PlantDetailsScreen,
  PlantListScreen,
  PlantViewScreen,
  RecentCaptures,
  RegisterScreen,
  WateringScreen,
} from './screens';
import BlankScreen from './screens/BlankScreen/BlankScreen';
import { OfflineBanner } from './components';
import { InternetConnectionContext } from './context/InternetConnectionContext';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
};

export default function RootNavigation() {
  const { isConnected } = useContext(InternetConnectionContext);
  return (
    <NavigationContainer>
      {isConnected ? null : <OfflineBanner />}
      <Stack.Navigator
        initialRouteName={'IntroScreen'}
        screenOptions={screenOptions}
      >
        <Stack.Screen name={'IntroScreen'} component={IntroScreen} />
        <Stack.Screen name={'PlantListScreen'} component={PlantListScreen} />
        <Stack.Screen name={'PhotoInputScreen'} component={PhotoInputScreen} />
        <Stack.Screen name={'CameraScreen'} component={CameraScreen} />
        <Stack.Screen name={'LoginScreen'} component={LoginScreen} />
        <Stack.Screen name={'RegisterScreen'} component={RegisterScreen} />
        <Stack.Screen
          name={'ChangePasswordScreen'}
          component={ChangePasswordScreen}
        />
        <Stack.Screen name={'PlantViewScreen'} component={PlantViewScreen} />
        <Stack.Screen name={'History'} component={RecentCaptures} />
        <Stack.Screen name={'Water'} component={WateringScreen} />
        <Stack.Screen name={'Explore'} component={ExploringScreen} />
        <Stack.Screen name={'PlantDetails'} component={PlantDetailsScreen} />
        <Stack.Screen name={'BlankScreen'} component={BlankScreen} />
        <Stack.Screen
          name={'ImagePickerScreen'}
          component={ImagePickerScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
