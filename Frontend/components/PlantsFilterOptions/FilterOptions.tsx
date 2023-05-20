import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { global } from '../../styles/globals';

type Props = {
  plant_categories?: string[];
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
};

export const FilterOptions = ({
  plant_categories = ['All', 'Indoor', 'Outdoor', 'Flowering', 'Foliage'],
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={{
        width: '100%',
        marginVertical: 5,
      }}
    >
      {plant_categories?.length > 0 ? (
        plant_categories.map((item: string, index: number) => (
          <TouchableOpacity
            key={index}
            style={index === 0 ? { marginRight: 6 } : { marginHorizontal: 6 }}
            onPress={() => setSelectedCategory(item)}
          >
            <View
              style={[
                styles.filterOption,
                {
                  backgroundColor:
                    item === selectedCategory
                      ? global.color.primary.backgroundColor
                      : '#fff',
                },
              ]}
            >
              <Text
                style={{
                  color:
                    item === selectedCategory
                      ? global.color.secondary.color
                      : global.color.primary.backgroundColor,
                }}
              >
                {item}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <>
          <Text>No categories!</Text>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    paddingVertical: 7,
    paddingHorizontal: 15,
  },
});
