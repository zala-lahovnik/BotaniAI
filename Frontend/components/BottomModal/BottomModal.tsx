import * as React from 'react';
import { PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Close from 'react-native-vector-icons/AntDesign';
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
            <Close name="close" color={global.color.heading.color} size={25} />
          </Pressable>
        </View>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    height: '28%',
    width: '100%',
    backgroundColor: global.color.primary.backgroundColor,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleContainer: {
    height: '20%',
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
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
});
