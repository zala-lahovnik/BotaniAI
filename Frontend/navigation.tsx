import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SampleScreen } from './screens';
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
          initialRouteName={'PlantList'}
          screenOptions={screenOptions}
        >
          {/*<Stack.Screen name="Home" component={Home} />*/}
          <Stack.Screen name={'SampleScreen'} component={SampleScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
