import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ArrowBack from 'react-native-vector-icons/Ionicons';
import Edit from 'react-native-vector-icons/FontAwesome5';
import { global } from '../../styles/globals';
import { styles } from './HeaderStyles';

type HeaderProps = NativeStackScreenProps<any> & {
  text?: string;
  leftAction?: () => void;
  rightAction?: () => void;
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
}: HeaderProps) => {
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
};
export const Header = ({
  navigation,
  route,
  leftAction,
  rightAction,
  text,
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
      />
    );
  } else {
    return <Heading text={text as string} />;
  }
};
