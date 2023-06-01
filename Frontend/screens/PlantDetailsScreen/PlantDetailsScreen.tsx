import React, { useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { global } from '../../styles/globals';
import { Divider } from 'react-native-elements';
import Sun from 'react-native-vector-icons/Ionicons';
import Bookmark from 'react-native-vector-icons/Feather';
import BackButton from '../../components/index';
import { styles } from './PlantDetailsScreenStyles';
import Shovel from 'react-native-vector-icons/MaterialCommunityIcons';
import Water from 'react-native-vector-icons/Entypo';
import Calender from 'react-native-vector-icons/AntDesign';
import { Plant } from '../../types/_plant';

type Props = NativeStackScreenProps<any>;

const PlantInfoIconStyle = {
  soil: {
    name: 'Soil',
    icon: (
      <Shovel
        name={'shovel'}
        size={20}
        color={global.color.primary.backgroundColor}
      />
    ),
    color: global.color.secondary.color,
  },
  sunlight: {
    name: 'Sunlight',
    icon: (
      <Sun
        name="sunny-outline"
        size={20}
        color={global.color.primary.backgroundColor}
      />
    ),
    color: '#FCF1E3',
  },
  watering: {
    name: 'Watering',
    icon: <Water name={'water'} size={20} color={'#AEBDEE'} />,
    color: '#E6EAFA',
  },
  plantingTime: {
    name: 'Planting Time',
    icon: <Calender name={'calendar'} size={20} color={'#CFA2E9'} />,
    color: '#F8E8F8',
  },
};

export const PlantDetailsScreen = ({ navigation, route }: Props) => {
  const {
    latin,
    common,
    description,
    watering,
    sunlight,
    plantingTime,
    soil,
    wateringDetail,
    fertilization,
    toxicity,
    image,
  } = route.params as Plant;

  const [expanded, setExpanded] = useState(false);
  const truncatedDescription =
    description.split('').slice(0, 150).join('') + '...';
  const isTruncated = description.split('').length > 150;

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const arrayOfPlantDetails = [
    { soil },
    { sunlight },
    { watering },
    { plantingTime },
  ]
    .filter((item) => Object.values(item)[0] !== '')
    .map((item) => {
      return {
        label: Object.keys(item)[0],
        ...item,
        ...PlantInfoIconStyle[
          Object.keys(item)[0] as keyof typeof PlantInfoIconStyle
        ],
      };
    })
    .reduce((result: Array<Array<{ [key: string]: string }>>, value, index) => {
      if (index % 2 === 0) {
        //@ts-ignore
        result.push([value]);
      } else {
        //@ts-ignore
        result[result.length - 1].push(value);
      }
      return result;
    }, []);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ImageBackground
        blurRadius={0.5}
        fadeDuration={500}
        source={{ uri: 'data:image/png;base64,' + image }}
        resizeMode="cover"
        style={{
          height: 220,
          width: '100%',
          opacity: 0.8,
        }}
      />
      <BackButton navigation={navigation} />
      <View style={[styles.container]}>
        <View>
          <Text style={styles.latinPlantName}>{latin}</Text>

          <Text style={styles.commonName}>{common}</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 15,
          }}
        >
          {toxicity && (
            <View style={styles.plantCategoryPill}>
              <Text
                style={{
                  fontSize: 12,
                }}
              >
                {toxicity}
              </Text>
            </View>
          )}
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Description
            </Text>
            <Text style={styles.plantDescription}>
              {expanded ? description : truncatedDescription}
            </Text>
            {isTruncated && (
              <TouchableOpacity onPress={handleExpand}>
                <Text
                  style={{
                    color: global.color.primary.backgroundColor,
                    fontWeight: 'bold',
                  }}
                >
                  {expanded ? 'Show less' : 'Read more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Divider
            style={{ marginHorizontal: 20, marginVertical: 10, opacity: 0.5 }}
            width={1}
            orientation="horizontal"
            color="gray"
          />
          <View style={{ gap: 25, flex: 1 }}>
            {arrayOfPlantDetails?.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  {item.map((object, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        gap: 15,
                        alignItems: 'center',
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: object.color,
                          borderRadius: 10,
                          padding: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {object.icon}
                      </View>
                      <View>
                        <Text
                          style={{
                            color: object.color,
                            fontWeight: 'bold',
                          }}
                        >
                          {object.name}
                        </Text>
                        <Text
                          style={{
                            fontStyle: 'italic',
                            width: 110,
                            overflow: 'hidden',
                            color: 'gray',
                            fontSize: 12,
                          }}
                        >
                          {object[object.label]}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        </ScrollView>
        <View style={styles.saveButton}>
          <Bookmark
            name={'bookmark'}
            size={30}
            color={global.color.heading.color}
          />
          <Text
            style={{
              color: global.color.heading.color,
            }}
          >
            Save this plant
          </Text>
        </View>
      </View>
    </View>
  );
};
