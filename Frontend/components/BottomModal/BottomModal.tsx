import { PropsWithChildren, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Close from 'react-native-vector-icons/AntDesign';
import * as React from 'react';
import { global } from '../../styles/globals';

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export const BottomModal = ({ children, isVisible, onClose }: Props) => {
  return (
    <Modal animationType="slide" visible={isVisible} transparent={true}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Watering needed!</Text>
          <Pressable onPress={onClose}>
            <Close name="close" color={global.color.heading.color} size={22} />
          </Pressable>
        </View>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    height: '25%',
    width: '100%',
    backgroundColor: global.color.primary.backgroundColor,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
  },
  titleContainer: {
    height: '18%',
    backgroundColor: global.color.primary.backgroundColor,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: global.color.heading.color,
    borderBottomWidth: 1,
  },
  title: {
    color: global.color.heading.color,
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
});
