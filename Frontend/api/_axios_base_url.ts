import axios from 'axios';
import { BACKEND_BASE_URI } from './backend';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const instance = axios.create({
  // TODO: Change this to your local machine url during development
  baseURL: BACKEND_BASE_URI,
});

const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
}

getToken().then(token => {
  instance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
});