import axios from 'axios';
import { BACKEND_BASE_URI } from './backend';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const instance = axios.create({
  baseURL: BACKEND_BASE_URI,
});

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

getToken().then((token) => {
  instance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
});
