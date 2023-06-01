import 'react-native-gesture-handler';
import RootNavigation from './navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { User } from './types/_user';
import { getUserById } from './api/_user';

const queryClient = new QueryClient();

export default function App() {
  const [loggedUser, setLoggedUser] = useState<Omit<
    User & { profilePicture: string; userId: string },
    '_id'
  > | null>(null);
  const [isReady, setIsReady] = useState(false);

  //AsyncStorage.clear();

  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        const user = await AsyncStorage.getItem('@user');
        if (user) {
          const { userId, profilePicture } = JSON.parse(user);

          // setLoggedUser({ userId, profilePicture });
          const data = await getUserById(userId);

          if (data) {
            setLoggedUser({
              userId: data._id,
              name: data.name,
              surname: data.surname,
              email: data.email,
              notifications: data.notifications,
              history: data.history,
              personalGarden: data.personalGarden,
              profilePicture,
            });
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        await SplashScreen.hideAsync();
        setIsReady(true);
      }
    })();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider loggedUser={loggedUser}>
        <RootNavigation />
      </UserProvider>
    </QueryClientProvider>
  );
}
