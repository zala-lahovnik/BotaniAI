import { instance } from './_axios_base_url';
import { type Plant } from '../types/_plant';

export const getAllPlants = async (pageParam: number) => {
  const response = await instance.get('/plant', {
    params: {
      pageParam,
    },
  });
  return response.data as Plant[];
};

export const getPlantById = async (plantId: string) => {
  const response = instance.get(`/plant/${plantId}`);
  return (await response).data as Plant;
};

export const getPlantByLatin = async (latin: string) => {
  const response = instance.get(`/plant/latin/${encodeURIComponent(latin)}`);
  return (await response).data as Plant;
};
