import { Text, View, TextInput, Pressable, Button } from 'react-native';
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { Ionicons } from '@expo/vector-icons';
import { styles } from './LoginScreenStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GOOGLE_EXPO, GOOGLE_ANDROID, GOOGLE_IOS } from '../../firebase/firebase-config';


WebBrowser.maybeCompleteAuthSession();





type Props = NativeStackScreenProps<any>;
export const LoginScreen = ({ navigation }: Props) => {
    const [token, setToken] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    function handleRegister() {
        navigation.navigate('RegisterScreen')
    }
    function handlePassword() {
        navigation.navigate('ChangePasswordScreen')
    }
    function handleHome() {
        navigation.navigate('Home')
    }
    function handleBack() {
        navigation.goBack()
    }
    function handleLogin() {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials: { user: any; }) => {
                const user = userCredentials.user;
                console.log("Logged in with : ", user.email);
                setUserInfo(user)
            }).then(() => navigation.navigate('PlantListScreen'))
            .catch((error: { message: any; }) => alert(error.message));
    }

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: GOOGLE_ANDROID,
        iosClientId: GOOGLE_IOS,
        expoClientId: GOOGLE_EXPO
    });

    useEffect(() => {
        if (response?.type === "success") {
            setToken(response.authentication.accessToken);
            getUserInfo();
        }
    }, [response, token]);


    const getUserInfo = async () => {
        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                { headers: { Authorization: `Bearer ${token}` }, }
            );
            const user = await response.json().then();
            setUserInfo(user);

            navigation.navigate('Home');
        } catch (error) {
            console.log(error)
        }
    };


    if (userInfo) {
        navigation.navigate('Home');
    }


    return (
        <View style={styles.container}>
            <Pressable style={styles.puscica} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            <Text style={styles.signin}>SIGN IN</Text>
            <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#648983"
                onChangeText={setEmail}
                value={email} />
            <View style={styles.eye}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#648983"
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                    value={password}
                /><Pressable onPress={toggleShowPassword} style={styles.icon}>
                    <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="#648983" />
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
            <Pressable style={styles.button2} onPress={
                () => { promptAsync(); }}>
                <View style={styles.googleButtonContainer}>
                    <Ionicons name="logo-google" size={21} color="white" style={styles.icon2} />
                    <Text style={styles.buttonText}>Continue with Google</Text>
                </View>









            </Pressable>
            <Pressable onPress={handlePassword}>
                <Text style={[styles.text, styles.lined]}> FORGOT YOUR PASSWORD?</Text>
            </Pressable>

            <Pressable onPress={handleHome}>
                <Text style={[styles.text, { paddingTop: 20, fontSize: 14 }]}> Continue without registration</Text>
            </Pressable>
        </View >
    );
}

