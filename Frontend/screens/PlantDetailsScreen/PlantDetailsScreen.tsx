import React from 'react';
import { ImageBackground, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { global } from '../../styles/globals';
import { Divider } from 'react-native-elements';
import Water from 'react-native-vector-icons/Ionicons';
import Sun from 'react-native-vector-icons/Ionicons';
import Shovel from 'react-native-vector-icons/MaterialCommunityIcons';
import Bookmark from 'react-native-vector-icons/Feather';
import BackButton from '../../components/index';
import { styles } from './PlantDetailsScreenStyles';

type Props = NativeStackScreenProps<any>;

export const PlantDetailsScreen = ({ navigation, route }: Props) => {
  console.log(route.params);
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
  } = route.params as any;

  const [expanded, setExpanded] = React.useState(false);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ImageBackground
        blurRadius={0.5}
        fadeDuration={500}
        source={require('../../assets/sample_plant.png')}
        resizeMode="cover"
        style={{
          height: 220,
          width: '100%',
          opacity: 0.8,
        }}
      />
      <BackButton navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.latinPlantName}>{latin}</Text>
        <View
          style={{
            flexDirection: 'row',
            gap: 15,
          }}
        >
          <View style={styles.plantCategoryPill}>
            <Text
              style={{
                fontSize: 12,
              }}
            >
              {toxicity}
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            Description
          </Text>
          <Text style={styles.plantDescription}>{description}</Text>
        </View>
        <Divider
          style={{ marginHorizontal: 20, marginVertical: 10, opacity: 0.5 }}
          width={1}
          orientation="horizontal"
          color="gray"
        />
        <View style={{ gap: 25, flex: 1 }}>
          {[[{ soil }, { sunlight }], [{ plantingTime }]].map((item, index) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              {item.map((text, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#FCF1E3',
                      borderRadius: 10,
                      padding: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Sun
                      name="sunny-outline"
                      size={20}
                      color={global.color.primary.backgroundColor}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: '#f8e8d6',
                        fontWeight: 'bold',
                      }}
                    >
                      {Object.keys(text)[0]}
                    </Text>
                    <Text
                      style={{
                        fontStyle: 'italic',
                      }}
                    >
                      {Object.values(text)[0]}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
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
