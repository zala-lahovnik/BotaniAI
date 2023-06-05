import { type PersonalGardenPlant } from '../types/_plant';

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

export const replacePlantInUsersPersonalGarden = (personalGarden: Array<PersonalGardenPlant>, plant: PersonalGardenPlant) => {
  const filteredGarden = personalGarden.filter((item) => item._id === plant._id)
  if(filteredGarden.length > 0) {
    const index = personalGarden.indexOf(filteredGarden[0])
    personalGarden[index] = plant
  } else {
    personalGarden.push(plant)
  }

  return personalGarden
}