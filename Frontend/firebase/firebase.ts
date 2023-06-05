import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  FUNCTIONS_REGION,
  MESSAGING_SENDER_ID,
  PROJECT_ID,
  STORAGE_BUCKET,
} from './firebase-config';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const storage = getStorage(app);

export const functionsPython = getFunctions(app, FUNCTIONS_REGION);

export const getOnlineImageUri = async (imageName: string) => {
  try {
    const uriRef = ref(storage, imageName);
    let imageOnlineUri = ''
    await getDownloadURL(uriRef).then((result) => {imageOnlineUri = result})

    return imageOnlineUri
  } catch (err) {
    console.log('imageUriError', err);
    return 'https://www.ambius.com/blog/wp-content/uploads/2019/03/GettyImages-484148116-770x360.jpg'
  }
}