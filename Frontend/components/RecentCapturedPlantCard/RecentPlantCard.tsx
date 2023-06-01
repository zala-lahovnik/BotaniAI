import React, { useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Down from 'react-native-vector-icons/AntDesign';
import { Divider } from 'react-native-elements';
import { RecentPlantDetails } from './RecentPlantDetails';
import { CaptureTime } from '../../utils/plant-watering-calculations';
import { styles } from './RecentPlantCardStyles';

type Props = NativeStackScreenProps<any> & {
  plant: any;
  captureTime: string | null;
  date: Date;
  classificationPercent: number;
};

export const RecentPlantCard = ({
  plant,
  captureTime,
  navigation,
  date,
  route,
  classificationPercent,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const heightValue = useRef(new Animated.Value(0)).current;

  const time_or_date_of_capture =
    captureTime === CaptureTime.Today
      ? date.toLocaleTimeString().slice(0, 5)
      : date.toLocaleDateString();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(heightValue, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const heightInterpolate = heightValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={styles.container}>
      <View style={styles.rowLayout}>
        <View
          style={{
            maxWidth: 60,
          }}
        >
          <Text style={styles.dateText}>{time_or_date_of_capture}</Text>
        </View>
        <View style={{ flex: 1, overflow: 'hidden' }}>
          <View
            style={{
              alignSelf: 'flex-start',
              position: 'relative',
            }}
          >
            <Text style={styles.customNameText}>{plant.customName}</Text>

            <Divider
              style={{
                marginVertical: 2,
                position: 'relative',
                left: 0,
                right: 0,
              }}
              orientation="horizontal"
              width={1}
              color="black"
            />
          </View>
          <Text style={styles.latinNameText}>FETCH ZA LATIN IZ PLANTID</Text>
        </View>
        <TouchableOpacity
          onPress={toggleExpand}
          activeOpacity={0.5}
          style={styles.expandButton}
        >
          <Down
            name="down"
            size={18}
            color="black"
            style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>
      </View>
      <Animated.View style={{ height: heightInterpolate }}>
        <RecentPlantDetails
          plantImage={plant.image || plant.image.buffer}
          classificationPercent={classificationPercent}
          watering={'NEVEM NEK PODATEK'}
        />
      </Animated.View>
    </View>
  );
};
