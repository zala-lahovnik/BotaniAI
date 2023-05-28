import React from 'react';
import { styles } from '../PlantWateringInfoCard/PlantWateringInfoCardStyles';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ArrowRight from 'react-native-vector-icons/AntDesign';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { type Plant } from '../../types/_plant';

type Props = NativeStackScreenProps<any> & {
  plant: Plant;
};

export const ExplorePlantCard = ({ plant, navigation }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('PlantDetails', {
          plantId: plant?._id,
          ...plant,
        })
      }
      style={[styles.card, style.card]}
    >
      {/*  TODO: CHANGE WITH URI*/}
      <Image
        source={require('../../assets/sample_plant.png')}
        style={style.image}
      />
      <View style={{ flex: 1, height: '100%' }}>
        <Text style={styles.cardTitle}>{plant?.latin}</Text>
        <Text style={style.description}>{plant?.common}</Text>
      </View>
      <ArrowRight
        name={'right'}
        size={22}
        style={{ marginRight: 10, opacity: 0.6 }}
      />
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  card: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 10,
    height: 90,
    alignItems: 'center',
  },
  image: {
    width: '20%',
    height: '100%',
    borderRadius: 10,
  },
  description: {
    fontStyle: 'italic',
    fontSize: 14,
  },
});
