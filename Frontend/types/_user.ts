// Interface for user object from Firebase
import { type HistoryPlant, type PersonalGardenPlant } from './_plant';

export interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  notifications: boolean;
  history: Array<HistoryPlant>;
  personalGarden: Array<PersonalGardenPlant>;
  profilePicture?: string;
}
