import React from "react";
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';

interface OnboardingItemProps {
    item: {
        id: number;
        title: string;
        description: string;
        image: string;
        extra?: boolean;
        name: string
    };
}

export const OnboardingItem: React.FC<OnboardingItemProps> = ({ item }) => {
    const { width } = useWindowDimensions();
    return (
        <View style={[styles.container, { width }]} >
            <Image source={item.image} style={[styles.image, { width, resizeMode: "contain" }]} />
            <View style={{ flex: 0.3, margin: 30 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>


        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        flex: 0.4,
        justifyContent: 'center',
        aspectRatio: 1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 32,
        marginBottom: 30,
        color: "white",
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: "white",
        textAlign: 'center',
        fontStyle: 'italic',
    },
    button: {
        position: 'absolute',
        borderRadius: 100,
    }
});
