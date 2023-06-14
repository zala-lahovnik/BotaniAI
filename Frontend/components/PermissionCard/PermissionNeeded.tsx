import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { global } from '../../styles/globals';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = {
  permission: string;
  navigation: NativeStackScreenProps<any>['navigation'];
  requestPermission: () => void;
};
export const PermissionNeeded = ({
  permission,
  navigation,
  requestPermission,
}: Props) => {
  return (
    <View style={styles.box}>
      <View style={styles.container}>
        <Text style={styles.text}>{permission}</Text>
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <Button
            color={global.color.primary.backgroundColor}
            onPress={requestPermission}
            title="Grant permission"
          />
          <Button
            color={'#fd5151'}
            onPress={() => navigation.goBack()}
            title="Deny"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: 20,
    borderRadius: 10,
    width: '90%',
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: global.color.primary.color,
  },
});
