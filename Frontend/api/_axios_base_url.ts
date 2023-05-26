import axios from 'axios';

export const instance = axios.create({
  // TODO: Change this to your local machine url when testing or server's URL
  baseURL: 'http://192.168.1.189:3000/',
});
