import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ArrowBack from 'react-native-vector-icons/Ionicons';
import Edit from 'react-native-vector-icons/FontAwesome5';
import { global } from '../../styles/globals';
import { styles } from './HeaderStyles';
import Menu from 'react-native-vector-icons/Feather';

type HeaderProps = NativeStackScreenProps<any> & {
  text?: string;
  leftAction?: () => void;
  rightAction?: () => void;
  home?: boolean;
};

const Heading = ({ text }: { text: string }) => {
  return (
    <View
      style={{
        marginVertical: 10,
      }}
    >
      <Text style={styles['heading-1']}>{text.toUpperCase()}</Text>
    </View>
  );
};

const HeaderWithLinks = ({
  navigation,
  route,
  leftAction,
  rightAction,
  text,
  home,
}: HeaderProps) => {
  // 3 elements in a row
  if (rightAction && leftAction) {
    return (
      <View style={[styles.container, { paddingVertical: 10 }]}>
        <TouchableOpacity onPress={() => leftAction()}>
          <ArrowBack
            name="arrow-back-outline"
            size={25}
            color={global.color.primary.backgroundColor}
          />
        </TouchableOpacity>
        <Text style={styles['heading-2']}>{text}</Text>
        <TouchableOpacity onPress={() => rightAction()}>
          <Edit
            name="edit"
            size={22}
            color={global.color.primary.backgroundColor}
          />
        </TouchableOpacity>
      </View>
    );
  } else {
    // 2 elements in a row
    if (home) {
      return (
        <View style={[styles.container, { paddingVertical: 10 }]}>
          <TouchableOpacity onPress={() => leftAction!()}>
            {home ? (
              <Menu
                name={'menu'}
                size={34}
                color={global.color.primary.backgroundColor}
              />
            ) : (
              <ArrowBack
                name="arrow-back"
                size={25}
                color={global.color.primary.backgroundColor}
              />
            )}
          </TouchableOpacity>
          <Text
            style={{
              color: global.color.primary.backgroundColor,
              fontSize: 30,
              fontWeight: 'bold',
            }}
          >
            {text}
          </Text>
          <View style={{ width: 25 }} />
        </View>
      );
    } else {
      return (
        <View style={[styles.container, { paddingVertical: 10 }]}>
          <TouchableOpacity onPress={() => leftAction!()}>
            <ArrowBack
              name="arrow-back"
              size={25}
              color={global.color.primary.backgroundColor}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: global.color.primary.backgroundColor,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {text}
          </Text>
          <View style={{ width: 25 }} />
        </View>
      );
    }
  }
};
export const Header = ({
  navigation,
  route,
  leftAction,
  rightAction,
  text,
  home = false,
}: HeaderProps) => {
  if (leftAction && rightAction) {
    return (
      <HeaderWithLinks
        text={text}
        navigation={navigation}
        route={route}
        leftAction={leftAction}
        rightAction={rightAction}
      />
    );
  } else if (leftAction) {
    return (
      <HeaderWithLinks
        text={text}
        navigation={navigation}
        route={route}
        leftAction={leftAction}
        home={home}
      />
    );
  } else {
    return <Heading text={text as string} />;
  }
};
