import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import RootNavigation from './navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigation />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({});
