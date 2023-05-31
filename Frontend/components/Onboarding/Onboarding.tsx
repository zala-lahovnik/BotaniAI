import React, { useState, useRef } from "react";
import { View, StyleSheet, FlatList, Animated, ViewToken } from 'react-native';
import { OnboardingItem } from "./OnboardingItem";
import { slides } from "./slides";
import { Pages } from './Pages'
import { NextButton } from "./NextButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
type Props = NativeStackScreenProps<any>;

export const Onboarding = ({ navigation }: Props) => {

    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<any>(null);
    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
    const scrollTo = async () => {
        if (currentIndex === slides.length - 1) {
            try {
                await AsyncStorage.setItem('@viewedOnboarding', 'true');
            } catch (error) {
                console.log(error);
            }
        } else {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
            console.log(currentIndex + 1);
        }
    };

    return (<View style={styles.container}>
        <View style={{ flex: 3 }}>
            <FlatList data={slides} renderItem={({ item }) => <OnboardingItem item={item} />} horizontal showsHorizontalScrollIndicator={false} pagingEnabled bounces={false} keyExtractor={(item) => item.id.toString()} onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false, })}
                scrollEventThrottle={32}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
                style={styles.flatList} />
        </View>
        <NextButton length={currentIndex} navigation={navigation} scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slides.length)} />
        <Pages data={slides} scrollX={scrollX} />
    </View>)
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flatList: {
        marginTop: 50
    }
})
