// Interface for user object from Firebase
import { HistoryPlant } from './_plant';

export interface IUser {}

// Type for user object added to user collection in MongoDB
export type User = IUser & {
  userId: string;
  name: string;
  surname: string;
  email: string;
  // TODO: Define type for history
  history: Array<HistoryPlant>;
  // TODO: Define type for personalGarden
  personalGarden: Array<any>;
};
