import {
  Dimensions,
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
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './LoginScreenStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {
  GOOGLE_ANDROID,
  GOOGLE_EXPO,
  GOOGLE_IOS,
} from '../../firebase/firebase-config';
import { addUser, getUserById } from '../../api/_user';
import { UserActionType, UserContext } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoadingModal } from '../../components';
import { StatusBar } from 'expo-status-bar';

type Props = NativeStackScreenProps<any>;
export const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user: loggedUser, dispatch } = useContext(UserContext);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  function handleRegister() {
    navigation.navigate('RegisterScreen');
  }

  function handlePassword() {
    navigation.navigate('ChangePasswordScreen');
  }

  function handleHome() {
    navigation.navigate('PlantListScreen');
  }

  function handleBack() {
    navigation.goBack();
  }

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials: { user: any }) => {
        const user = userCredentials.user;
        console.log('Logged in with : ', user);
        // handleUserLogin(user.uid);
      })
      .then(() => navigation.navigate('PlantListScreen'))
      .catch((error: { message: any }) => alert(error.message));
  }

  const handleUserLogin = async (userId: string) => {
    const user = await getUserById(userId);

    const dispatchUser = {
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      notifications: user.notifications,
      history: user.history || [],
      personalGarden: user.personalGarden || [],
    };
    dispatch({ type: UserActionType.UPDATE_USER, payload: dispatchUser });
  };

  WebBrowser.maybeCompleteAuthSession();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID,
    iosClientId: GOOGLE_IOS,
    expoClientId: GOOGLE_EXPO,
  });

  const handleGoogleSignIn = async () => {
    setLoading(true);
    promptAsync().then((r) => {
      if (r?.type === 'success') {
        const accessToken = r.params.access_token;
        getUserInfo(accessToken);
      } else {
        // TODO: make toast message for error
        setLoading(false);
      }
    });
  };

  const getUserInfo = async (accessToken: any) => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const user = await response.json();
      const googleCredential = GoogleAuthProvider.credential(null, accessToken);
      signInWithCredential(auth, googleCredential)
        .then((userCredential) => {
          setLoading(true);
          const user = userCredential.user;

          if (auth.currentUser) {
            const displayName = auth.currentUser.displayName;
            const name = displayName ? displayName.split(' ')[0] || ' ' : ' ';
            const surname = displayName
              ? displayName.split(' ')[1] || ' '
              : ' ';
            const email = auth.currentUser.email || ' ';
            const newUser = {
              name: name,
              surname: surname,
              email: email,
              notifications: false,
              userId: auth.currentUser.uid,
            };
            const profilePicture = auth.currentUser.photoURL as string;
            if (!loggedUser.userId) {
              const userData = getUserById(auth.currentUser.uid)
                .then((data) => {
                  if (data) {
                    dispatch({
                      type: UserActionType.UPDATE_USER,
                      payload: data,
                    });
                  }
                })
                .catch((error) => {
                  dispatch({
                    type: UserActionType.UPDATE_USER,
                    payload: { profilePicture, ...newUser },
                  });
                  addUser(newUser);
                })
                .finally(() => {
                  AsyncStorage.setItem(
                    '@user',
                    JSON.stringify({
                      userId: newUser.userId,
                      profilePicture,
                    })
                  );
                });
            }
          }
        })
        .then(() => {
          navigation.navigate('PlantListScreen');
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <StatusBar style="auto" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={[
            styles.container,
            { minHeight: Math.round(Dimensions.get('window').height) },
          ]}
        >
          {loading && <LoadingModal loading={loading} />}
          <Pressable style={styles.puscica} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text style={styles.signin}>SIGN IN</Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#648983"
            onChangeText={setEmail}
            value={email}
          />
          <View style={styles.eye}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#648983"
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              value={password}
            />
            <Pressable onPress={toggleShowPassword}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#648983"
              />
            </Pressable>
          </View>
          <Pressable style={styles.button1} onPress={handleLogin}>
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
          <View style={styles.or}>
            <View style={styles.line} />
            <View style={styles.oval}>
              <Text style={styles.text}>OR</Text>
            </View>
            <View style={styles.line} />
          </View>
          <Pressable style={styles.button2} onPress={handleRegister}>
            <Text style={styles.buttonText}>Create an account</Text>
          </Pressable>
          <Pressable style={styles.button2} onPress={handleGoogleSignIn}>
            <View style={styles.googleButtonContainer}>
              <Ionicons
                name="logo-google"
                size={21}
                color="white"
                style={styles.icon2}
              />
              <Text style={styles.buttonText}>Continue with Google</Text>
            </View>
          </Pressable>
          <Pressable onPress={handlePassword}>
            <Text style={[styles.text, styles.lined]}>
              FORGOT YOUR PASSWORD?
            </Text>
          </Pressable>
          <Pressable onPress={handleHome}>
            <Text style={[styles.text, { paddingTop: 20, fontSize: 14 }]}>
              Continue without registration
            </Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
