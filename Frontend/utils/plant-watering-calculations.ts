import { PersonalGardenPlant } from '../types/_plant';

export enum CaptureTime {
  Today = 'Today',
  ThisWeek = 'This week',
  LastWeek = 'Last week',
  ThisMonth = 'This month',
  LastMonth = 'Last month',
  ThisYear = 'This year',
}

export const getImageCaptureTime = (date: Date): string => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  const currentWeekNumber = Math.ceil(days / 7);

  const imageDate = new Date(date);
  const imageStartDate = new Date(imageDate.getFullYear(), 0, 1);
  const imageDays = Math.floor(
    (imageDate - imageStartDate) / (24 * 60 * 60 * 1000)
  );
  const imageWeekNumber = Math.ceil(imageDays / 7);

  if (
    imageDate.toDateString() === currentDate.toDateString() &&
    imageWeekNumber === currentWeekNumber
  ) {
    return CaptureTime.Today;
  }

  if (imageWeekNumber === currentWeekNumber) {
    return CaptureTime.ThisWeek;
  }

  if (imageWeekNumber === currentWeekNumber - 1) {
    return CaptureTime.LastWeek;
  }

  if (
    imageDate.getMonth() === currentDate.getMonth() &&
    imageDate.getFullYear() === currentDate.getFullYear()
  ) {
    return CaptureTime.ThisMonth;
  }

  if (
    imageDate.getMonth() === currentDate.getMonth() - 1 &&
    imageDate.getFullYear() === currentDate.getFullYear()
  ) {
    return CaptureTime.LastMonth;
  }

  if (imageDate.getFullYear() === currentDate.getFullYear()) {
    return CaptureTime.ThisYear;
  }

  return 'Way back';
};

// next watering date
export enum NextWateringDay {
  Today = 'Today',
  Missed = 'Plant not watered',
}

export enum WateringStatus {
  NotWatered = 'Not Watered',
  Today = 'Today',
}

export const sortPlantsByWateringStatus = (
  plants: PersonalGardenPlant[]
): PersonalGardenPlant[] => {
  const sortedPlants = [...plants];

  sortedPlants.sort((a, b) => {
    const lastWateredIndexA = a.watering.wateringArray.findIndex(
      (plant) => plant.watered
    );
    const lastWateredIndexB = b.watering.wateringArray.findIndex(
      (plant) => plant.watered
    );

    const lastWateredDateA = new Date(
      a.watering.wateringArray[lastWateredIndexA].date
    );
    const lastWateredDateB = new Date(
      b.watering.wateringArray[lastWateredIndexB].date
    );

    const nextWateredIndexA = lastWateredIndexA + 1;
    const nextWateredIndexB = lastWateredIndexB + 1;

    const nextWateredDateA = new Date(
      a.watering.wateringArray[nextWateredIndexA]?.date
    );
    const nextWateredDateB = new Date(
      b.watering.wateringArray[nextWateredIndexB]?.date
    );

    const wateringStatusA = getNextWateringDay(
      lastWateredDateA,
      nextWateredDateA
    );
    const wateringStatusB = getNextWateringDay(
      lastWateredDateB,
      nextWateredDateB
    );

    if (wateringStatusA === wateringStatusB) {
      return nextWateredDateA.getTime() - nextWateredDateB.getTime();
    }

    if (wateringStatusA === WateringStatus.NotWatered) {
      return -1;
    }

    if (wateringStatusB === WateringStatus.NotWatered) {
      return 1;
    }

    if (
      wateringStatusA === WateringStatus.Today &&
      wateringStatusB !== WateringStatus.Today
    ) {
      return -1;
    }

    if (
      wateringStatusB === WateringStatus.Today &&
      wateringStatusA !== WateringStatus.Today
    ) {
      return 1;
    }

    return nextWateredDateA.getTime() - nextWateredDateB.getTime();
  });

  return sortedPlants;
};

export const getNextWateringDay = (
  lastWateredDate: Date,
  nextWateredDate: Date
): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastWateredDate.setHours(0, 0, 0, 0);
  nextWateredDate.setHours(0, 0, 0, 0);

  if (nextWateredDate < today) {
    return WateringStatus.NotWatered;
  }

  if (
    nextWateredDate.toDateString() === today.toDateString() &&
    lastWateredDate.toDateString() !== today.toDateString()
  ) {
    return WateringStatus.Today;
  }

  return nextWateredDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const getNumberBetweenDates = (lastWatered: Date): number => {
  let today = new Date();
  today = new Date(today.setHours(0, 0, 0, 0));
  const lastDay = new Date(lastWatered.setHours(0, 0, 0, 0));

  const timeDifference = lastDay.getTime() - today.getTime();
  return Math.abs(Math.ceil(timeDifference / (1000 * 3600 * 24)));
};

export const getWateringPercentage = (
  lastWatered: Date,
  interval: number
): number => {
  let currentDate = new Date();
  // currentDate = new Date(currentDate.setHours(0, 0, 0, 0));
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  const daysSinceLastWatering = Math.floor(
    (currentDate.getTime() - lastWatered.getTime()) / millisecondsPerDay
  );

  return Math.round(
    Math.max(0, 100 - (daysSinceLastWatering / interval) * 100)
  );
};

export const getNumberOfDaysTillNextWatering = (
  nextWateringDate: Date
): number => {
  let currentDate = new Date();
  currentDate = new Date(currentDate.setHours(0, 0, 0, 0));
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.floor(
    (nextWateringDate.getTime() - currentDate.getTime()) / millisecondsPerDay
  );
};

export const getLastWateredDateIndex = (
  wateringArray: PersonalGardenPlant['watering']['wateringArray']
): number => {
  let lastIndex = -1;
  for (let i = wateringArray.length - 1; i >= 0; i--) {
    if (wateringArray[i].watered) {
      lastIndex = i;
      break;
    }
  }
  return lastIndex;
};
