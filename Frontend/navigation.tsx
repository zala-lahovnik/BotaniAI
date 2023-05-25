import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CameraScreen, LoginScreen, PhotoInputScreen, PlantListScreen, ChangePasswordScreen, RegisterScreen, PlantViewScreen, IntroScreen } from './screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
};

export default function RootNavigation() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'IntroScreen'} screenOptions={screenOptions}>
          <Stack.Screen name={'IntroScreen'} component={IntroScreen} />
          <Stack.Screen name={'PlantListScreen'} component={PlantListScreen} />
          <Stack.Screen name={'PhotoInputScreen'} component={PhotoInputScreen} />
          <Stack.Screen name={'CameraScreen'} component={CameraScreen} />
          <Stack.Screen name={'LoginScreen'} component={LoginScreen} />
          <Stack.Screen name={'RegisterScreen'} component={RegisterScreen} />
          <Stack.Screen name={'ChangePasswordScreen'} component={ChangePasswordScreen} />
          <Stack.Screen name={'PlantViewScreen'} component={PlantViewScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
