import { Text, View, TextInput, Pressable } from 'react-native';
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { styles } from './RegisterScreenStyles';
import { useNavigation } from '@react-navigation/native';

export const RegisterScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [confirm, setConfirm] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const toggleShowPassword1 = () => {
        setShowPassword1(!showPassword1);
    };
    const toggleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    };
    function handleBack() { navigation.goBack() }
    function handleRegister() {
        if (password == confirm) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredentials) => {
                    const user = userCredentials.user;
                    console.log("Registered with: ", user.email);
                }).then(() => navigation.navigate('PlantListScreen'))
        }
    }
    return (
        <View style={styles.container}>
            <Pressable style={styles.puscica}>
                <Ionicons name="arrow-back" size={24} color="black" onPress={handleBack} />
            </Pressable>
            <Text style={styles.create}>CREATE ACCOUNT</Text>
            <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#648983"
                onChangeText={setEmail}
                value={email} />
            <TextInput
                style={styles.input}
                placeholder="First name"
                placeholderTextColor="#648983"
                onChangeText={setFirst}
                value={first} />
            <TextInput
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor="#648983"
                onChangeText={setLast}
                value={last} />
            <View style={styles.eye}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#648983"
                    secureTextEntry={!showPassword1}
                    onChangeText={setPassword}
                    value={password} />
                <Pressable onPress={toggleShowPassword1} style={styles.icon}>
                    <Ionicons
                        name={showPassword1 ? 'eye-off' : 'eye'}
                        size={24}
                        color="#648983" />
                </Pressable>
            </View>
            <View style={styles.eye}>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm password"
                    placeholderTextColor="#648983"
                    secureTextEntry={!showPassword2}
                    onChangeText={setConfirm}
                    value={confirm} />
                <Pressable onPress={toggleShowPassword2} style={styles.icon}>
                    <Ionicons
                        name={showPassword2 ? 'eye-off' : 'eye'}
                        size={24}
                        color="#648983" />
                </Pressable>
            </View>
            <Pressable style={styles.button1} onPress={handleRegister}>
                <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
        </View>
    );
}
