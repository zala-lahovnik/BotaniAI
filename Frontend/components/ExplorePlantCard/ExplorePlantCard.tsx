import React from 'react';
import { styles } from '../PlantWateringInfoCard/PlantWateringInfoCardStyles';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import ArrowRight from 'react-native-vector-icons/AntDesign';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any> & {
  plant: any;
};

export const ExplorePlantCard = ({ plant, navigation }: Props) => {
  // TODO: FETCH DATA FROM BACKEND
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('PlantDetails', {
          plantId: plant._id,
          latin: 'Papaver Somniferum',
          common: 'Opium Poppy',
          image: require('../../assets/sample_plant.png'),
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam a quia voluptatem, quod, voluptatum, quas voluptate quos quibusdam voluptatibus quae dolorum. Quisquam a quia voluptatem, quod, voluptatum, quas voluptate quos quibusdam voluptatibus quae dolorum.',
          watering: 'Once a week',
          sunlight: 'Full sun',
          plantingTime: ['Spring', 'Summer'],
          soil: 'Well-drained',
          fertilizer: 'Once a month',
          toxicity: 'Toxic to pets',
        })
      }
      key={plant._id}
      style={[styles.card, style.card]}
    >
      <Image
        source={require('../../assets/sample_plant.png')}
        style={style.image}
      />
      <View style={{ flex: 1, height: '100%' }}>
        <Text style={styles.cardTitle}>{plant.customName}</Text>
        <Text style={style.description}>
          {plant?.description ??
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
        </Text>
      </View>
      <ArrowRight
        name={'right'}
        size={24}
        style={{ paddingHorizontal: 10, opacity: 0.6 }}
      />
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  card: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 10,
    height: 80,
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
