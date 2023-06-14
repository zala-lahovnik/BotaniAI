import 'react-native-gesture-handler';
import RootNavigation from './navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { User } from './types/_user';
import { getUserById } from './api/_user';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { InternetConnectionContext } from './context/InternetConnectionContext';
import { NoInternetConnection } from './screens';

const queryClient = new QueryClient();

export default function App() {
  const [loggedUser, setLoggedUser] = useState<Omit<
    User & { profilePicture: string; userId: string },
    '_id'
  > | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const userDataFetched = useRef(false);
  const firstRender = useRef(true);

  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        NetInfo.addEventListener((state) => {
          if (!state.isConnected) {
            setIsConnected(false);
            return;
          } else {
            firstRender.current = false;
            setIsConnected(true);
          }
        });
        const user = await AsyncStorage.getItem('@user');
        if (user) {
          const { userId, profilePicture } = JSON.parse(user);

          if (userDataFetched.current) {
            return;
          }
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
          userDataFetched.current = true;
        }
      } catch (error) {
        console.log(error);
      } finally {
        await SplashScreen.hideAsync();
        setIsReady(true);
      }
    })();
  }, [refresh]);

  if (!isReady) {
    return null;
  }

  if (!isConnected && firstRender.current) {
    firstRender.current = false;
    return (
      <InternetConnectionContext.Provider value={{ isConnected }}>
        <NoInternetConnection refresh={setRefresh} />
      </InternetConnectionContext.Provider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider loggedUser={loggedUser}>
        <InternetConnectionContext.Provider value={{ isConnected }}>
          <SafeAreaProvider>
            <RootNavigation />
          </SafeAreaProvider>
        </InternetConnectionContext.Provider>
      </UserProvider>
    </QueryClientProvider>
  );
}
