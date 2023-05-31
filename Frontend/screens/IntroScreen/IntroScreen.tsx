import { ActivityIndicator, Text, View } from 'react-native';
import { styles } from './IntroStyles'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Onboarding } from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { LoginScreen } from '../LoginScreen/LoginScreen';


const Loading = () => {
    return (
        <View>
            <ActivityIndicator size={'large'} />
        </View>)
}

type Props = NativeStackScreenProps<any>;
export const IntroScreen = ({ navigation, route }: Props) => {
    const [loading, setLoading] = useState(true)
    const [viewOnboarding, setViewOnboarding] = useState(false)

    const checkOnboarding = async () => {
        try {
            const value = await AsyncStorage.getItem('@viewedOnboarding');

            if (value !== null) {
                setViewOnboarding(true)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        checkOnboarding();
    }, [])
    return (
        <View style={styles.container}>
            {loading ? <Loading />
                : viewOnboarding ?
                    <LoginScreen navigation={navigation} route={route} /> : <Onboarding navigation={navigation} route={route} />}
        </View >
    );
}

