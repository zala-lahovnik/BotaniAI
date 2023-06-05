import React, { useEffect, useState } from 'react';
import { styles } from '../PlantWateringInfoCard/PlantWateringInfoCardStyles';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ArrowRight from 'react-native-vector-icons/AntDesign';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { type Plant } from '../../types/_plant';
import { getOnlineImageUri } from '../../firebase/firebase';
import { Skeleton } from '@rneui/base';
import { LinearGradient } from 'react-native-svg';

type Props = NativeStackScreenProps<any> & {
  plant: Plant;
};

export const ExplorePlantCard = ({ plant, navigation }: Props) => {
  const [imageUri, setImageUri] = useState(plant.image || '');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getOnlineImageUri(plant.image || '')
      .then((result) => {
        setImageUri(result);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [plant.image]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('PlantDetails', {
          plantId: plant?._id,
          ...plant,
          image: plant.image,
        })
      }
      style={[styles.card, style.card]}
    >
      {isLoaded ? (
        <Image source={{ uri: imageUri }} style={style.image} />
      ) : (
        <Skeleton
          LinearGradientComponent={LinearGradient}
          animation="wave"
          width={70}
          height={80}
        />
      )}
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
