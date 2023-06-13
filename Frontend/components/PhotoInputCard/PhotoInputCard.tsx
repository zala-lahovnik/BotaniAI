import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { global } from '../../styles/globals';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = PropsWithChildren &
  NativeStackScreenProps<any> & {
    text: string;
  };

export const PhotoInputCard = ({
  text,
  children,
  navigation,
  route,
}: Props) => {
  return (
    <>
      <TouchableOpacity
        style={[styles.container]}
        activeOpacity={0.8}
        onPress={
          text === 'Gallery'
            ? () => navigation.navigate('ImagePickerScreen')
            : () => navigation.navigate('CameraScreen')
        }
      >
        <View
          style={{
            position: 'absolute',
            top: -20,
            left: '14%',
            zIndex: 1,
            backgroundColor: global.color.primary.backgroundColor,
            borderRadius: 10,
            padding: 5,
            width: 150,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: global.color.secondary.color,
            }}
          >
            {text}
          </Text>
        </View>
        {children}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 150,
    borderRadius: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
});
