import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { styles } from './ChangePasswordScreenStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

export const ChangePasswordScreen = ({
  navigation,
}: NativeStackScreenProps<any>) => {
  const [email, setEmail] = useState('');

  function handleReset() {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Email sent', `Reset password email sent to: ${email}`, [
          { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
        ]);
      })
      .catch((error) => alert(error.message));
  }

  function handleBack() {
    navigation.goBack();
  }

  if (auth.currentUser?.email) {
    console.log(auth.currentUser?.email);
    navigation.navigate('PlantListScreen');
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <StatusBar style="auto" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Pressable style={styles.puscica} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text style={styles.recover}>RECOVER PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#648983"
            onChangeText={setEmail}
            value={email}
          />
          <Pressable style={styles.button1} onPress={handleReset}>
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
