import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NextButton = ({ percentage, scrollTo, length }: any) => {
  const navigation = useNavigation() as NativeStackNavigationProp<any>;
  const size = 100;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef<any>(null);

  const animation = (toValue: any) => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    animation(percentage);
  }, [percentage]);

  useEffect(() => {
    const listener = progressAnimation.addListener((value) => {
      const strokeDashoffset =
        circumference - (circumference * value.value) / 100;
      if (progressRef?.current) {
        progressRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });
    return () => {
      progressAnimation.removeListener(listener);
    };
  }, [percentage]);

  function handleLogin() {
    AsyncStorage.setItem('@viewedOnboarding', 'true').then(() => {
      navigation.navigate('LoginScreen');
    });
  }

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={center}>
          <Circle
            stroke="white"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            ref={progressRef}
            stroke="#040f0c"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth + 1}
            strokeDasharray={circumference}
          />
        </G>
      </Svg>

      {length == 3 ? (
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
          activeOpacity={0.6}
        >
          <Text style={styles.text}> Start</Text>
        </TouchableOpacity>
      ) : length == 0 ? (
        <TouchableOpacity
          onPress={scrollTo}
          style={styles.button}
          activeOpacity={0.6}
        >
          <Text style={styles.text}> Go</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={scrollTo}
          style={styles.button}
          activeOpacity={0.6}
        >
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    borderRadius: 100,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
