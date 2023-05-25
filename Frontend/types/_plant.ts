// Interface for plant object from backend
export interface Plant {}

export interface HistoryPlant {
  _id: string;
  plantId: string;
  customName: string;
  intervalZalivanja: string;
  prviDanZalivanja: Date; // Date object: '2023-05-21
  date: Date; // DATE OBJECT ISO: '2021-05-21T00:00:00.000Z'
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
