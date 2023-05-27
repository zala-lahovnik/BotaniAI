import 'react-native-gesture-handler';
import RootNavigation from './navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './context/UserContext';

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <RootNavigation />
      </UserProvider>
    </QueryClientProvider>
  );
}
