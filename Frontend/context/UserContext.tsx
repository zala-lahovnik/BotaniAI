import { type User } from '../types/_user';
import { createContext, Dispatch, PropsWithChildren, useReducer } from 'react';

export enum UserActionType {
  UPDATE_USER = 'UPDATE_USER',
  CLEAR_USER = 'CLEAR_USER',
}

type Action =
  | { type: UserActionType.UPDATE_USER; payload: User }
  | { type: UserActionType.CLEAR_USER };

const initialState: User = {
  _id: '',
  name: '',
  surname: '',
  email: '',
  notifications: false,
  history: [],
  personalGarden: [],
};

const userReducer = (state: User, action: Action): User => {
  switch (action.type) {
    case UserActionType.UPDATE_USER:
      return {
        ...state,
        ...action.payload,
      };
    case UserActionType.CLEAR_USER:
      return initialState;
    default:
      return state;
  }
};

export const UserContext = createContext<{
  user: User;
  dispatch: Dispatch<Action>;
}>({
  user: initialState,
  dispatch: () => {},
});

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
