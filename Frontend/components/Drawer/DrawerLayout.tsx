import React, { useContext, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ArrowRight from 'react-native-vector-icons/AntDesign';
import { Divider } from 'react-native-elements';
import User from 'react-native-vector-icons/FontAwesome';
import { global } from '../../styles/globals';
import { UserContext } from '../../context/UserContext';
import { Switch } from '@rneui/themed';

export const DrawerLayout = () => {
  const navigation = useNavigation();

  const { user, dispatch } = useContext(UserContext);

  const [checked, setChecked] = useState(false);

  const toggleSwitch = () => {
    setChecked(!checked);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SIGN OUT</Text>
        <TouchableOpacity
          onPress={() => {
            // TODO: Add sign out functionality
            Alert.alert('Logout', 'Are you sure you want to logout!', [
              {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: () => console.log('Yes Pressed'),
              },
            ]);
          }}
          style={{}}
          activeOpacity={0.8}
        >
          <ArrowRight
            name={'arrowright'}
            size={22}
            color={global.color.heading.color}
          />
        </TouchableOpacity>
      </View>
      <Divider
        style={{ marginVertical: 5, width: '100%', opacity: 0.5 }}
        width={1}
        orientation="horizontal"
        color={global.color.heading.color as string}
      />
      <View style={{ gap: 15 }}>
        <Text style={styles.text}>Signed in as</Text>
        <View style={{ marginHorizontal: 20 }}>
          <View style={styles.userInfo}>
            {user.image ? (
              // TODO: Add user avatar
              <View>
                <Image source={require('../../assets/favicon.png')} />
              </View>
            ) : (
              <User
                name={'user-circle-o'}
                size={28}
                color={global.color.heading.color}
              />
            )}
            <Text style={styles.userName}>{user.displayName || 'Guest'}</Text>
          </View>
          {user.email ? (
            <Text style={styles.userEmail}>{user.email}</Text>
          ) : null}
        </View>
      </View>
      <Divider
        style={{ marginVertical: 5, width: '100%', opacity: 0.5 }}
        width={1}
        orientation="horizontal"
        color={global.color.heading.color as string}
      />
      <View style={{ marginHorizontal: 20 }}>
        <View style={styles.notificationRow}>
          <Text
            style={{
              fontSize: 16,
              color: global.color.heading.color,
            }}
          >
            Notifications
          </Text>
          <Switch
            value={checked}
            onValueChange={(value) => setChecked(value)}
            trackColor={{
              true: global.color.secondary.color,
              false: global.color.heading.color,
            }}
            thumbColor={global.color.primary.color}
          />
        </View>
        <Text style={styles.description}>
          Get notified when plants need water
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 30,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: global.color.heading.color,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  text: {
    fontSize: 14,
    color: global.color.heading.color,
    marginHorizontal: 20,
  },
  userName: {
    fontSize: 16,
    color: global.color.heading.color,
  },
  userEmail: {
    fontSize: 14,
    color: global.color.heading.color,
    fontStyle: 'italic',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  description: {
    fontSize: 12,
    color: global.color.heading.color,
    fontStyle: 'italic',
    opacity: 0.9,
  },
});
