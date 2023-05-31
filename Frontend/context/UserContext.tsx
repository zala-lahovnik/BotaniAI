import { type User } from '../types/_user';
import { createContext, Dispatch, PropsWithChildren, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum UserActionType {
  UPDATE_USER = 'UPDATE_USER',
  CLEAR_USER = 'CLEAR_USER',
}

type Action =
  | { type: UserActionType.UPDATE_USER; payload: User }
  | { type: UserActionType.CLEAR_USER };

export const initialState: Omit<
  User & { profilePicture?: string; userId: string; searchHistory: string[] },
  '_id'
> = {
  userId: '',
  name: '',
  surname: '',
  email: '',
  notifications: false,
  history: [],
  personalGarden: [],
  profilePicture: '',
  searchHistory: [],
};

const clearUserAsyncStorage = async () => {
  try {
    await AsyncStorage.removeItem('@user');
  } catch (e) {
    console.log('Error while clearing user from async storage');
  }
};

const userReducer = (
  state: typeof initialState,
  action: Action
): typeof initialState => {
  switch (action.type) {
    case UserActionType.UPDATE_USER:
      return {
        ...state,
        ...action.payload,
      };
    case UserActionType.CLEAR_USER:
      clearUserAsyncStorage();
      return initialState;
    default:
      return state;
  }
};

export const UserContext = createContext<{
  user: typeof initialState;
  dispatch: Dispatch<Action>;
}>({
  user: initialState,
  dispatch: () => {},
});

export const UserProvider = ({
  children,
  loggedUser,
}: PropsWithChildren<{ loggedUser?: typeof initialState | null }>) => {
  let initialUser = loggedUser || initialState;

  const [user, dispatch] = useReducer(userReducer, initialUser);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
