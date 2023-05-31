import React, { useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, View } from 'react-native';
import { OnboardingItem } from './OnboardingItem';
import { slides } from './slides';
import { Pages } from './Pages';
import { NextButton } from './NextButton';

export const Onboarding = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<any>(null);
    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        }
    };
    return (
        <View style={styles.container}>
            <View style={{ flex: 3 }}>
                <FlatList
                    data={slides}
                    renderItem={({ item }) => <OnboardingItem item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id.toString()}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                    style={styles.flatList}
                />
            </View>
            <NextButton
                length={currentIndex}
                scrollTo={scrollTo}
                percentage={(currentIndex + 1) * (100 / slides.length)}
            />
            <Pages data={slides} scrollX={scrollX} />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatList: {
        marginTop: 50,
    },
});
