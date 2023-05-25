import React from "react";
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';

interface PagesProps {
    data: {
        id: number;
        title: string;
        description: string;
        image: string;
        extra?: boolean;
    }[];
    scrollX: any
}

export const Pages: React.FC<PagesProps> = ({ data, scrollX }) => {
    const { width } = useWindowDimensions();
    return (
        <View style={{ flexDirection: 'row', height: 64 }}>
            {data.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
                const dotWIdth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                    extrapolate: 'clamp'
                })
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp'
                })
                return <Animated.View style={[styles.dot, { width: dotWIdth, opacity: opacity }]} key={i} />;
            })}
        </View>
    );
};


const styles = StyleSheet.create({

    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: "#040f0c",
        marginHorizontal: 8,

    },
});
