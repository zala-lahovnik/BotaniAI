import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ArrowRight from 'react-native-vector-icons/AntDesign';
import { Divider } from 'react-native-elements';
import User from 'react-native-vector-icons/FontAwesome';
import { global } from '../../styles/globals';
import { UserActionType, UserContext } from '../../context/UserContext';
import { Switch } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { updateUserNotifications } from '../../api/_user';
import * as Notifications from 'expo-notifications';
import { registerForPushNotifications } from '../../utils/NotificationHandler';
import { InternetConnectionContext } from '../../context/InternetConnectionContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const DrawerLayout = ({ navigation }: NativeStackScreenProps<any>) => {
  const { user, dispatch } = useContext(UserContext);
  const [checked, setChecked] = useState(user.notifications);
  const [modalVisible, setModalVisible] = useState(false);
  const isFirstRender = useRef(true);
  const { isConnected } = useContext(InternetConnectionContext);

  const handleChange = useCallback(async (value: boolean): Promise<any> => {
    try {
      await updateUserNotifications(user.userId, {
        notifications: value,
      });
      dispatch({
        type: UserActionType.UPDATE_USER,
        payload: { notifications: value },
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      handleChange(checked);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [checked, handleChange]);

  function handleLogout() {
    setModalVisible(!modalVisible);

    dispatch({ type: UserActionType.CLEAR_USER });
    navigation.navigate('LoginScreen');
  }

  useEffect(() => {
    if (checked) {
      registerForPushNotifications(user.userId);
      Notifications.addNotificationReceivedListener(handleNotification);
    }
  }, [checked]);

  const handleNotification = (notification: any) => {
    console.log('Received notification:', notification);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {user.userId !== '' ? (
          <>
            <Text style={styles.headerText}>SIGN OUT</Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
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
          </>
        ) : (
          <>
            <Text style={styles.headerText}>SIGN IN</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('LoginScreen');
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
          </>
        )}
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
            {user.profilePicture ? (
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 50,
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={{ uri: user.profilePicture }}
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
            ) : (
              <User
                name={'user-circle-o'}
                size={28}
                color={global.color.heading.color}
              />
            )}
            <Text style={styles.userName}>
              {user.name + ' ' + user.surname || 'Guest'}
            </Text>
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
            disabled={!isConnected}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Logout?</Text>
            <Text style={{ paddingBottom: 20, paddingTop: 10, fontSize: 18 }}>
              Are you sure you want to logout
            </Text>
            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
              <Pressable
                style={[
                  { backgroundColor: '#B00020', padding: 10 },
                  styles.modalText,
                ]}
                onPress={handleLogout}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Yes</Text>
              </Pressable>
              <Pressable
                style={[{ backgroundColor: '#124A3F' }, styles.modalText]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  {' '}
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 5,
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
    fontSize: 12,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(205,227,214,0.9)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  modalText: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 10,
    borderRadius: 10,
    padding: 10,
  },
});
