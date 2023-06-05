// Interface for plant object from backend
export interface Plant {
  _id: string;
  latin: string;
  common: string;
  description: string;
  watering: string;
  sunlight: string;
  plantingTime: string;
  soil: string;
  wateringDetail: string;
  fertilizing: string;
  toxicity: string;
  folder_num: number;
  fertilization: string;
  image: string;
  imageToSave ?: string
}

export interface HistoryPlant {
  _id: string;
  plantId: string;
  customName: string;
  date: string; // DATE OBJECT ISO:
  result: number;
  image: string;
  latin: string;
  watering: string;
}

export interface PersonalGardenPlant {
  _id: string;
  latin: string;
  common: string;
  customName: string;
  description: string;
  watering: {
    firstDay: string;
    numberOfDays: string;
    amountOfWater: string;
    wateringArray: Array<{ date: string; watered: boolean }>;
  };
  image: any;
}

export interface PersonalGardenWateringArrayType {
  date: string;
  watered: boolean;
}
