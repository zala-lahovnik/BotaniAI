import React from 'react';
import { Text, Pressable, View } from 'react-native';
import { styles } from './NotLoggedInStyles';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
export const NotLoggedIn = () => {
  const navigation = useNavigation() as NativeStackNavigationProp<any>;
  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };
  function handleBack() {
    navigation.goBack();
  }
  return (
    <View style={styles.container}>
      <Pressable style={styles.puscica} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </Pressable>
      <Text style={styles.text}>
        To access this function you must be logged in.
      </Text>
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </Pressable>
    </View>
  );
};
