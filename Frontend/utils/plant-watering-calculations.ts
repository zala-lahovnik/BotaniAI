import { HistoryPlant } from '../types/_plant';
import { temp_data } from '../screens';

export enum CaptureTime {
  Today = 'Today',
  ThisWeek = 'This week',
  LastWeek = 'Last week',
  ThisMonth = 'This month',
  LastMonth = 'Last month',
  ThisYear = 'This year',
}

export const getImageCaptureTime = (
  date: HistoryPlant['date']
): CaptureTime | null => {
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return CaptureTime.Today;
  }

  const daysDifference = Math.floor(
    (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weeksDifference = Math.floor(daysDifference / 7);
  const monthsDifference = today.getMonth() - date.getMonth();
  const yearsDifference = today.getFullYear() - date.getFullYear();

  if (weeksDifference === 0) {
    return CaptureTime.ThisWeek;
  } else if (weeksDifference === 1) {
    return CaptureTime.LastWeek;
  } else if (monthsDifference === 0) {
    return CaptureTime.ThisMonth;
  } else if (monthsDifference === 1) {
    return CaptureTime.LastMonth;
  } else if (yearsDifference === 0) {
    return CaptureTime.ThisYear;
  }
  return null;
};

// next watering date
export enum NextWateringDay {
  Today = 'Today',
  Missed = 'Plant not watered',
}

export enum WateringStatus {
  NotWatered = 'Not Watered',
  Today = 'Today',
  Upcoming = 'Upcoming',
}

export const sortPlantsByWateringStatus = (plants: typeof temp_data) => {
  const today = new Date();
  const sortedPlants = [...plants];

  sortedPlants
    .sort((a, b) => {
      const nextWateringDayA = getNextWateringDay(
        a.prviDanZalivanja,
        a.intervalZalivanja
      );
      const nextWateringDayB = getNextWateringDay(
        b.prviDanZalivanja,
        b.intervalZalivanja
      );

      if (nextWateringDayA === nextWateringDayB) {
        return a.date.getTime() - b.date.getTime();
      }

      if (nextWateringDayA === WateringStatus.NotWatered) {
        return 1;
      }

      if (nextWateringDayB === WateringStatus.NotWatered) {
        return -1;
      }

      if (nextWateringDayA === WateringStatus.Today) {
        return 1;
      }

      if (nextWateringDayB === WateringStatus.Today) {
        return -1;
      }

      const dateA = new Date(nextWateringDayA);
      const dateB = new Date(nextWateringDayB);

      return dateA.getTime() - dateB.getTime();
    })
    .reverse();

  return sortedPlants;
};

export const getNextWateringDay = (
  zacetekZalivanja: Date,
  intervalZalivanja: string
): string => {
  const interval = Number(intervalZalivanja);
  const today = new Date();
  const nextWateringDay = new Date(
    zacetekZalivanja.getTime() + interval * 86400000
  );

  if (nextWateringDay <= today) {
    return WateringStatus.NotWatered;
  }

  if (nextWateringDay.toDateString() === today.toDateString()) {
    return WateringStatus.Today;
  }

  return nextWateringDay.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const getNumberBetweenDates = (lastWatered: Date): number => {
  const today = new Date();
  const lastDay = new Date(lastWatered.setHours(0, 0, 0, 0));

  const timeDifference = lastDay.getTime() - today.getTime();
  return Math.abs(Math.ceil(timeDifference / (1000 * 3600 * 24)));
};

export const getWateringPercentage = (
  lastWatered: Date,
  interval: number
): number => {
  const currentDate = new Date();
  const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

  const daysSinceLastWatering = Math.floor(
    (currentDate.getTime() - lastWatered.getTime()) / millisecondsPerDay
  );

  return Math.round(
    Math.max(0, 100 - (daysSinceLastWatering / interval) * 100)
  );
};
