import { PersonalGardenPlant } from '../types/_plant';

export const filterPlants = (
  plants: PersonalGardenPlant[],
  filter: string
): PersonalGardenPlant[] => {
  return plants.filter((plant: PersonalGardenPlant) => {
    const plantName = plant.common.toLowerCase();
    const filterName = filter.toLowerCase();
    return plantName.includes(filterName);
  });
};
