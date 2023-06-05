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


        <View style={[styles.container, { width }]}>
            <View style={styles.imageContainer}>
                {item.title.length == 0 ? (<Image source={item.image} style={styles.image2} />)
                    : (<Image source={item.image} style={styles.image} />)}
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 350,
        height: 350
    },
    image2: {
        width: 200,
        height: 200
    },
    textContainer: {
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "white",
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: "white",
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
