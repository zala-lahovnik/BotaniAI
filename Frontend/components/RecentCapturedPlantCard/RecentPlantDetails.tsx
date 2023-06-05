import React from 'react';
import { ImageSourcePropType, Text, View } from 'react-native';
import { PlantImage } from '../PlantItemCardOverlay/PlantItemCardOverlay';
import { styles } from './RecentPlantCardStyles';

type Props = {
  plantImage: ImageSourcePropType & string;
  classificationPercent: number;
  watering: string;
};

export const RecentPlantDetails = ({
  plantImage,
  classificationPercent,
  watering,
}: Props) => {
  return (
    <View
      style={[
        {
          flex: 1,
          flexDirection: 'row',
          gap: 20,
        },
      ]}
    >
      <View style={{}}>
        <PlantImage imageSrc={plantImage} />
      </View>
      <View style={styles.plantDetailsContainer}>
        <View style={styles.plantDetailsRow}>
          <Text style={styles.plantDetailsHeader}>Matching</Text>
          <Text style={styles.plantDetailsText}>{classificationPercent}%</Text>
        </View>
        {watering &&
          <View style={styles.plantDetailsRow}>
            <Text style={styles.plantDetailsHeader}>Watering</Text>
            <Text style={styles.plantDetailsText}>{watering}</Text>
          </View>
        }
      </View>
    </View>
  );
};
