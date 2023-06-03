import { type User } from '../types/_user';
import { instance } from './_axios_base_url';
import { type HistoryPlant, type PersonalGardenPlant } from '../types/_plant';

export const getUserById = async (userId: string) => {
  const response = await instance.get(`/user/${userId}`);
  return response.data as User;
};

export const addUser = async (
  user: Pick<User, 'name' | 'surname' | 'email' | 'notifications'> & {
    userId: string;
  }
) => {
  const response = await instance.post('/user/add-user', user);
  return response.data;
};

export const getUserHistory = async (userId: string) => {
  const response = await instance.get(`/user/${userId}/history/`);
  return response.data as HistoryPlant[];
};

export const getUserPersonalGarden = async (userId: string) => {
  const response = await instance.get(`/user/${userId}/personal-garden/`);
  return response.data as PersonalGardenPlant[];
};

type HistoryObject = {
  userId: string;
  plantId: string;
  customName: string;
  date: string;
  result: number;
  image: any;
};
export const addPlantToHistory = async (data: HistoryObject) => {
  const response = await instance.post('/user/add-history', data);
  return response.data;
};

export const deletePlantFromPersonalGarden = async (
  userId: string,
  plantId: string
) => {
  const response = await instance.delete(
    `/user/${userId}/personal-garden/${plantId}`
  );
  return response.data;
};

type UpdateUsersNotifications = {
  notifications: boolean;
};

export const updateUserNotifications = async (
  userId: string,
  data: UpdateUsersNotifications
) => {
  const response = await instance.put(`/user/${userId}`, data);
  return response.data;
};

export type UpdatePlant = {
  description: string;
  customName: string;
  firstDay: string;
  numberOfDays: string;
  amountOfWater: string;
  wateringArray: { date: string; watered: boolean }[];
  image: string;
};

export const updatePlant = async (
  userId: string,
  plantId: string,
  data: UpdatePlant
) => {
  const response = await instance.put(
    `/user/${userId}/personal-garden/${plantId}`,
    data
  );
  return response.data;
};

export type PersonalGardenObject = {
  userId: string;
  latin: string;
  common: string;
  customName: string;
  description: string;
  firstDay: string;
  numberOfDays: number;
  amountOfWater: number;
  wateringArray: { date: string; watered: boolean }[];
  image: string;
};

export const addPlantToPersonalGarden = async (data: PersonalGardenObject) => {
  try {
    const response = await instance.post(`/user/add-personal-garden`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to add plant:', error);
    throw error;
  }
};
