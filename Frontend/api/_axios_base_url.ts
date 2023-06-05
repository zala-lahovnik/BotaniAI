import axios from 'axios';
import { BACKEND_BASE_URI } from './backend';

export const instance = axios.create({
  // TODO: Change this to your local machine url during development
  baseURL: BACKEND_BASE_URI,
});
