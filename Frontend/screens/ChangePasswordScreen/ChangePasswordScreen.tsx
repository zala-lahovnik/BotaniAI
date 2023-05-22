import { Text, View, TextInput, Alert, Pressable, } from 'react-native';
import React, { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { styles } from './ChangePasswordScreenStyles';
import { useNavigation } from '@react-navigation/native';
export const ChangePasswordScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    function handleReset() {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert(
                    "Email sent", `Reset password email sent to: ${email}`,
                    [{ text: 'OK', onPress: () => navigation.navigate("LoginScreen") },],);
            })
            .catch((error) => alert(error.message));
    }
    function handleBack() { navigation.goBack() }
    return (
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
                value={email} />
            <Pressable style={styles.button1} onPress={handleReset}>
                <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
        </View>
    );
};

