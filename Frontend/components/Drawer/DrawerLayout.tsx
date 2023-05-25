import React from 'react';
import {
  Image,
  ScrollView,
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

export const DrawerLayout = () => {
  const navigation = useNavigation();

  // TODO: Add user context
  const user = null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SIGN OUT</Text>
        <TouchableOpacity onPress={() => {}} style={{}} activeOpacity={0.8}>
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
        <Text
          style={{
            fontSize: 14,
            color: global.color.heading.color,
            marginHorizontal: 20,
          }}
        >
          Signed in as
        </Text>
        <View style={styles.userInfo}>
          {user ? (
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
          <Text
            style={{
              fontSize: 16,
              color: global.color.heading.color,
            }}
          >
            {user ? user.displayName : 'Guest'}
          </Text>
        </View>
      </View>
      <Divider
        style={{ marginVertical: 5, width: '100%', opacity: 0.5 }}
        width={1}
        orientation="horizontal"
        color={global.color.heading.color as string}
      />
      {/*history notifications*/}
      <View>
        <Text
          style={{
            fontSize: 16,
            color: global.color.heading.color,
            marginHorizontal: 20,
          }}
        >
          Notifications
        </Text>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
          ></View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 30,
    // paddingHorizontal: 20,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: global.color.heading.color,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginHorizontal: 20,
  },
});
