import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useContext, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { styles } from './RegisterScreenStyles';
import { addUser, generateToken } from '../../api/_user';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserActionType, UserContext } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { LoadingModal } from '../../components';

export const RegisterScreen = ({ navigation }: NativeStackScreenProps<any>) => {
  const [email, setEmail] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [confirm, setConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { dispatch } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const toggleShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };
  const toggleShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  function handleBack() {
    navigation.goBack();
  }

  function handleRegister() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid email address.',
        position: 'bottom',
        visibilityTime: 1500,
      });
      return;
    }
    if (password !== confirm) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match.',
        position: 'bottom',
        visibilityTime: 1500,
      });
      return;
    }
    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password should be at least 6 characters long.',
        position: 'bottom',
        visibilityTime: 1500,
      });
      return;
    }
    if (first.length < 2 && last.length < 2) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Enter your name.',
        position: 'bottom',
        visibilityTime: 1500,
      });
      return;
    }
    setDisabled(true);
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;
        const newUser = {
          name: first,
          surname: last,
          email: email,
          notifications: false,
          userId: user.uid,
        };
        addUser(newUser);
        await generateToken(user.uid);
      })
      .then(() => {
        setDisabled(false);

        const dispatchUser = {
          userId: auth.currentUser?.uid,
          name: first,
          surname: last,
          email: email,
          notifications: false,
          history: [],
          personalGarden: [],
        };
        dispatch({ type: UserActionType.UPDATE_USER, payload: dispatchUser });
        AsyncStorage.setItem(
          '@user',
          JSON.stringify({
            userId: dispatchUser.userId,
            profilePicture: null,
          })
        );
        navigation.navigate('PlantListScreen');
      })
      .catch((error) => {
        setDisabled(false);
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <StatusBar style="auto" />
      {loading && <LoadingModal loading={loading} />}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container]}>
          <Pressable style={styles.puscica}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="white"
              onPress={handleBack}
            />
          </Pressable>
          <Text style={styles.create}>CREATE ACCOUNT</Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#648983"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="First name"
            placeholderTextColor="#648983"
            onChangeText={setFirst}
            value={first}
          />
          <TextInput
            style={styles.input}
            placeholder="Last name"
            placeholderTextColor="#648983"
            onChangeText={setLast}
            value={last}
          />
          <View style={styles.eye}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#648983"
              secureTextEntry={!showPassword1}
              onChangeText={setPassword}
              value={password}
            />
            <Pressable onPress={toggleShowPassword1}>
              <Ionicons
                name={showPassword1 ? 'eye-off' : 'eye'}
                size={24}
                color="#648983"
              />
            </Pressable>
          </View>
          <View style={styles.eye}>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#648983"
              secureTextEntry={!showPassword2}
              onChangeText={setConfirm}
              value={confirm}
            />
            <Pressable onPress={toggleShowPassword2}>
              <Ionicons
                name={showPassword2 ? 'eye-off' : 'eye'}
                size={24}
                color="#648983"
              />
            </Pressable>
          </View>
          <Pressable
            style={[styles.button1, disabled && styles.disabledButton]}
            onPress={handleRegister}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
      <Toast />
    </KeyboardAvoidingView>
  );
};
