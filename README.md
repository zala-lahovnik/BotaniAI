<p align="center">
    <img src="Documentation/Images/logo.png" width="100" height="100" />
</p>

# BotaniAI

Discover, Identify, and Nurture: Unleash the Power of Plants with our App!

Plants are all around us, silently enriching our lives. But how well do we truly know them? Introducing our
revolutionary app that brings plants to life like never before.

## Key features:
🌿 **Snap a Photo, Unlock the Secrets**: Capture any plant in a photo and let our app work its magic. Our cutting-edge
classification model identifies the plant species and provides fascinating insights into its world.

🌱 **Cultivate Your Virtual Garden**: Create your very own oasis in our app's virtual garden. Save your favorite plants and
personalize their care. Set watering schedules and receive handy push notifications, ensuring their health and vitality.

🌸 **A Haven for Plant Lovers**: Whether you're a seasoned enthusiast or just getting started, our app is a must-have for all
plant lovers. Dive into a wealth of information about different plant types and master the art of proper plant care.

**Embark on an extraordinary botanical journey today.🌿🌱🚀✨**

# BotaniAI: Installation and Setup Guide

Welcome to BotaniAI, an innovative project that brings together plant enthusiasts and technology. Follow the steps below to install and run the project seamlessly.

## Frontend Setup

1. Clone the repository to your local machine and open it in your favorite IDE.

2. **Firebase Project Setup:**
    - Create a new project in the Firebase Console. Need help? Check out the [Firebase Console Project creation guide](https://firebase.google.com/docs/web/setup).
    - Open the Apps section of your project in Firebase Console, locate the Web App, and open it to find the Firebase Config data.

3. **Firebase Function Setup:**
    - To run the classification model, you'll need to host your own Firebase Function. Follow the official [Firebase Functions tutorial](https://firebase.google.com/docs/functions/get-started?gen=2nd) to set up Firebase Functions. Note: Overwrite the existing files as Firebase Functions are already initialized.
    - Add the location of your hosted Python Firebase Function by appending a line to the `firebase-config.js` file.

4. **Expo Google Login Setup:**
    - To enable Google login on Expo, you need Expo Google login keys. Create these keys by following the [Expo Google Authentication tutorial](https://docs.expo.dev/guides/google-authentication/).

5. Create a new JavaScript file named `firebase-config.js` inside the `Frontend/firebase` folder. Use the Firebase Config data, Firebase Function location, and Expo Google login keys to populate the file. The structure should resemble the example below:
```js
export const API_KEY="API_KEY_VALUE"
export const AUTH_DOMAIN="AUTH_DOMAIN_VALUE"
export const PROJECT_ID="PROJECT_ID_VALUE"
export const STORAGE_BUCKET="STORAGE_BUCKET_VALUE"
export const MESSAGING_SENDER_ID="MESSAGING_SENDER_ID_VALUE"
export const APP_ID="APP_ID_VALUE"
export const FUNCTIONS_REGION="FUNCTIONS_REGION_VALUE"
export const GOOGLE_ANDROID="GOOGLE_ANDROID_VALUE"
export const GOOGLE_IOS="GOOGLE_IOS_VALUE"
export const GOOGLE_EXPO="GOOGLE_EXPO_VALUE"
```

6. If you choose not to use Firebase Functions, make sure to comment out the relevant code sections, but note that the app may lose some key features.

7. Install the project dependencies by running the following command inside the `Frontend` directory:
```
npm i
```

8. Start the application using the following command:
```
npx expo start
```

9. You can now view the mobile app in ExpoGo by scanning the QR code! 📱🔍

## Backend Setup

1. **MongoDB Setup:**
    - Create a MongoDB database to store backend data.
    - Copy the database connection link.

2. Create an `.env` file inside the `Backend` directory and paste the MongoDB connection link into the file, as shown below:
```
DATABASE_URI=mongodb://username:password@localhost:27017/database_name
```

3. Install the project dependencies by running the following command inside the `Backend` directory:
```
npm i
```

4. Start the backend server by running the following command in the `Backend` folder:
```
node server.js
```

# Technologies Used

BotaniAI utilizes the following key libraries and technologies:

## Frontend
- Expo
- TypeScript
- Firebase
- React Native
- Axios

## Backend
- ExpressJS
- MongoDB
- Swagger

## Classification
- Anaconda
- Jupyter Notebook
- NumPy
- TensorFlow

Experience the world of plants with BotaniAI! 🌿✨