import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './NotLoggedInStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export const NotLoggedIn = ({ navigation }: NativeStackScreenProps<any>) => {
  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        To access this function you must be logged in.
      </Text>
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </Pressable>
    </View>
  );
};
