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
}

export interface HistoryPlant {
  plantId: string;
  customName: string;
  date: string; // DATE OBJECT ISO: '2021-05-21T00:00:00.000Z'
  image: {
    originalName: string;
    mimetype: string;
    buffer: string;
  };
}

export interface PersonalGardenPlant {
  _id: string;
  latin: string;
  common: string;
  customName: string;
  description: string;
  watering: string;
  // intervalZalivanja: string;
  // prviDanZalivanja: Date; // Date object: '2023-05-21
  image: {
    originalName: string;
    mimetype: string;
    buffer: string;
  };
}

export interface VirtualPlant extends HistoryPlant {
  waterAmount: number;
  daysWatered: Array<Date>;
}
