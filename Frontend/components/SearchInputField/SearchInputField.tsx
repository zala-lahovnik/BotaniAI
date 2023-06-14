import React, { useState } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import { PersonalGardenPlant } from '../../types/_plant';

export const SearchInputField = ({
  setSearch,
  plants,
}: {
  setSearch: (val: string) => void;
  plants: PersonalGardenPlant[];
}) => {
  const [_, setSelected] = useState<string>('');

  const data = plants?.map((plant: PersonalGardenPlant) => ({
    key: plant._id,
    value: plant.common,
  }));

  return (
    <SelectList
      dropdownShown={false}
      setSelected={(val: string) => {
        setSelected(val);
        setSearch(val);
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
