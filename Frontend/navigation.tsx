import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CameraScreen, PhotoInputScreen, PlantListScreen } from './screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
};

export default function RootNavigation() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={'Home'}
          screenOptions={screenOptions}
        >
          <Stack.Screen name={'PlantListScreen'} component={PlantListScreen} />
          <Stack.Screen
            name={'PhotoInputScreen'}
            component={PhotoInputScreen}
          />
          <Stack.Screen name={'CameraScreen'} component={CameraScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
