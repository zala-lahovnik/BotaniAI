import { type User } from '../types/_user';
import { createContext, Dispatch, PropsWithChildren, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type HistoryPlant, type PersonalGardenPlant } from '../types/_plant';

export enum UserActionType {
  UPDATE_USER = 'UPDATE_USER',
  CLEAR_USER = 'CLEAR_USER',
  UPDATE_PERSONAL_GARDEN = 'UPDATE_PERSONAL_GARDEN',
  DELETE_PLANT_FROM_PERSONAL_GARDEN = 'DELETE_PLANT_FROM_PERSONAL_GARDEN',
  UPDATE_HISTORY = 'UPDATE_HISTORY',
}

type Action =
  | { type: UserActionType.UPDATE_USER; payload: User }
  | { type: UserActionType.UPDATE_USER; payload: PersonalGardenPlant[] }
  | {
      type: UserActionType.UPDATE_PERSONAL_GARDEN;
      payload: PersonalGardenPlant[];
    }
  | {
      type: UserActionType.DELETE_PLANT_FROM_PERSONAL_GARDEN;
      payload: PersonalGardenPlant['_id'];
    }
  | { type: UserActionType.UPDATE_HISTORY; payload: HistoryPlant }
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
    case UserActionType.UPDATE_PERSONAL_GARDEN:
      return {
        ...state,
        personalGarden: action.payload as PersonalGardenPlant[],
      };

    case UserActionType.DELETE_PLANT_FROM_PERSONAL_GARDEN:
      return {
        ...state,
        personalGarden: state.personalGarden.filter(
          (plant) => plant._id !== action.payload
        ),
      };
    case UserActionType.UPDATE_HISTORY:
      return {
        ...state,
        history: [...state.history, action.payload],
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
