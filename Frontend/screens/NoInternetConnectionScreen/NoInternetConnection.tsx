import React, { SetStateAction, useContext } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { global } from '../../styles/globals';
import { Ionicons } from '@expo/vector-icons';
import { InternetConnectionContext } from '../../context/InternetConnectionContext';

export const NoInternetConnection = ({
  refresh,
}: {
  refresh: SetStateAction<any>;
}) => {
  const { isConnected } = useContext(InternetConnectionContext);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        resizeMode={'contain'}
        source={require('../../assets/no-connection.png')}
      >
        <View style={{ top: 150 }}>
          <Text style={styles.heading}>You have no internet connection</Text>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isConnected ? 'black' : '#000000' + 50 },
            ]}
            onPress={refresh}
            disabled={!isConnected}
            activeOpacity={0.6}
          >
            <View style={styles.buttonContainer}>
              <Ionicons
                name="refresh-sharp"
                size={21}
                color={global.color.heading.color}
              />
              <Text style={styles.text}>Refresh</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: global.color.primary.backgroundColor,
    paddingHorizontal: 20,
  },
  heading: {
    color: global.color.heading.color,
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    height: 45,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    justifyItems: 'center',
  },
  text: {
    color: global.color.heading.color,
  },
});
