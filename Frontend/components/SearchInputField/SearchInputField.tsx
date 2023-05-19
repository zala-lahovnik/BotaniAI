import React, { useState } from 'react';
import { Animated, TextInput, TouchableOpacity, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

export const SearchInputField = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (val: string) => void;
}) => {
  const [selected, setSelected] = useState<string>('');
  const data = [
    { key: '1', value: 'Plant_1' },
    { key: '2', value: 'Plant_2' },
    { key: '3', value: 'Plant_3' },
  ];

  return (
    <SelectList
      dropdownShown={false}
      setSelected={(val: string) => {
        setSelected(val);
      }}
      data={data}
      save={'value'}
      placeholder={'Search for a plant'}
      boxStyles={{
        borderRadius: 20,
        borderWidth: 0,
        backgroundColor: 'white',
      }}
      inputStyles={{}}
      dropdownStyles={{
        borderRadius: 0,
        marginTop: -15,
        backgroundColor: 'white',
        borderWidth: 0,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
      }}
      dropdownItemStyles={{ borderRadius: 0 }}
      dropdownTextStyles={{ borderRadius: 0 }}
    />
  );
};
