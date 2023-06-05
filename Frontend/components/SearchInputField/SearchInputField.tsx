import React, { useContext, useState } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import { UserContext } from '../../context/UserContext';
import { PersonalGardenPlant } from '../../types/_plant';

export const SearchInputField = ({
  search,
  setSearch,
  plants,
}: {
  search: string;
  setSearch: (val: string) => void;
  plants: PersonalGardenPlant[];
}) => {
  const [selected, setSelected] = useState<string>('');
  const { user, dispatch } = useContext(UserContext);
  // const data = [
  //   { key: '1', value: 'Plant_1' },
  //   { key: '2', value: 'Plant_2' },
  //   { key: '3', value: 'Plant_3' },
  // ];

  const data = plants?.map((plant: PersonalGardenPlant) => ({
    key: plant._id,
    value: plant.common,
  }));

  console.log(data);

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
