import { Animated, Text } from 'react-native';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WifiOff from 'react-native-vector-icons/MaterialCommunityIcons';

export const OfflineBanner = () => {
  const insets = useSafeAreaInsets();
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const slideInAnimation = Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    });

    const slideOutAnimation = Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    });

    slideInAnimation.start();

    return () => {
      slideOutAnimation.start();
    };
  }, []);

  return (
    <Animated.View
      style={{
        paddingTop: insets.top,
        zIndex: 10,
        backgroundColor: '#ff5757',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
        transform: [
          {
            translateY: slideAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, 0],
            }),
          },
        ],
      }}
    >
      <WifiOff name={'wifi-off'} size={28} color={'white'} />
      <Text
        style={{
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        No connection
      </Text>
    </Animated.View>
  );
};
