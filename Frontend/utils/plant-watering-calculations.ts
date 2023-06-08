import {
  type PersonalGardenPlant,
  type PersonalGardenWateringArrayType,
} from '../types/_plant';

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
  // @ts-ignore
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  const currentWeekNumber = Math.ceil(days / 7);

  const imageDate = new Date(date);
  const imageStartDate = new Date(imageDate.getFullYear(), 0, 1);
  const imageDays = Math.floor(
    // @ts-ignore
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
    const lastWateredIndexA = getLastWateredDateIndex(a.watering.wateringArray);
    const lastWateredIndexB = getLastWateredDateIndex(b.watering.wateringArray);

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

export const createNewWateringDaysPro = (gap: string, firstDate: string) => {
  const firstWateringDate: any = new Date(firstDate);
  const today: any = new Date();
  let newWateringDates: Array<PersonalGardenWateringArrayType> = [];

  const diffTime = firstWateringDate - today;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const pastRepetitions = Math.abs(Math.round(diffDays / Number(gap)));

  for (let i = 0; i < 5 + pastRepetitions; i++) {
    const newDate = new Date(
      firstWateringDate.getTime() + Number(gap) * i * 86400000
    );
    if (
      newDate.toISOString().slice(0, 10) <= today.toISOString().slice(0, 10)
    ) {
      newWateringDates.push({
        date: newDate.toISOString().slice(0, 10),
        watered: true,
      });
    } else {
      newWateringDates.push({
        date: newDate.toISOString().slice(0, 10),
        watered: false,
      });
    }
  }

  newWateringDates = newWateringDates.sort((itemA: any, itemB: any) => {
    if (itemA.date - itemB.date) return 1;
    else if (itemA.date < itemB.date) return -1;
    else return 0;
  });

  return Array.from(new Set(newWateringDates));
};

export const getWateringDaysPro = (
  gapDays: string,
  firstDay: string,
  wateringArray: PersonalGardenPlant['watering']['wateringArray']
) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const tempFirstDay = new Date(firstDay).setHours(0, 0, 0, 0);
  if (tempFirstDay >= today) firstDay = new Date().toISOString().slice(0, 10);

  const gap = parseInt(gapDays) || 7;

  let pastWateringDatesTrue: PersonalGardenPlant['watering']['wateringArray'] =
    [];
  if (wateringArray.length > 0) {
    pastWateringDatesTrue =
      wateringArray
        .filter((item) => {
          const itemDate = new Date(item.date).setHours(0, 0, 0, 0);
          return itemDate <= today && item.watered;
        })
        .sort((itemA: any, itemB: any) => {
          if (itemA.date - itemB.date) return 1;
          else if (itemA.date < itemB.date) return -1;
          else return 0;
        }) || [];
  }

  let pastWateringDates: PersonalGardenPlant['watering']['wateringArray'] = [];

  pastWateringDates = createNewWateringDaysPro(gapDays, firstDay)
  pastWateringDates = pastWateringDates.filter((item) => {
    return new Date(item.date).setHours(0, 0, 0, 0) <= today;
  })
    .sort((itemA: any, itemB: any) => {
      if (itemA.date - itemB.date) return 1;
      else if (itemA.date < itemB.date) return -1;
      else return 0;
    }) || [];

  let newWateringDates: Array<PersonalGardenWateringArrayType> = [];
  //keep all past watering dates that are true
  pastWateringDatesTrue.forEach((item) => {
    if (!newWateringDates.includes(item)) newWateringDates.push(item);
  });

  if (pastWateringDatesTrue.length > 0) {
    const lastWateringDate = new Date(
    pastWateringDatesTrue[pastWateringDatesTrue.length - 1].date
    );

    const nextExpectedWateringDate = new Date(pastWateringDatesTrue[pastWateringDatesTrue.length - 1].date)
    nextExpectedWateringDate.setDate(nextExpectedWateringDate.getDate() + gap)

    const currentFirstDay = new Date(firstDay);

    if(lastWateringDate < currentFirstDay) {
      let createdWateringDates = createNewWateringDaysPro(gapDays, firstDay)

      createdWateringDates.forEach((item) => {
        if (!newWateringDates.includes(item)) newWateringDates.push(item);
      })
    } else if (
        pastWateringDatesTrue[pastWateringDatesTrue.length - 1].date ===
        pastWateringDates[pastWateringDates.length - 1].date
      ) {
      for (let i = 1; i <= 5; i++) {
        const newDate = new Date(
          lastWateringDate.getTime() + gap * i * 86400000
        );
        newWateringDates.push({
          date: newDate.toISOString().slice(0, 10),
          watered: false,
        });
      }
    } else if(nextExpectedWateringDate >= new Date()) {
      for (let i = 1; i <= 5; i++) {
        const nextDate = new Date(lastWateringDate.getTime() + gap * i * 86400000);
        newWateringDates.push({
          date: nextDate.toISOString().slice(0, 10),
          watered: false,
        });
      }
    } else {
      const fixedToday = new Date();
      for (let i = 0; i <= 5; i++) {
        const nextDate = new Date(fixedToday.getTime() + gap * i * 86400000);
        newWateringDates.push({
          date: nextDate.toISOString().slice(0, 10),
          watered: false,
        });
      }
    }
  } else {
    newWateringDates = createNewWateringDaysPro(gapDays, firstDay);
  }

  newWateringDates = newWateringDates.sort((itemA: any, itemB: any) => {
    if (itemA.date - itemB.date) return 1;
    else if (itemA.date < itemB.date) return -1;
    else return 0;
  });

  const noDuplicatesArray: PersonalGardenWateringArrayType[] = [
    ...new Set(newWateringDates),
  ];

  console.log('finished creating dates', noDuplicatesArray);
  return noDuplicatesArray;
};


//
// if (
//   pastWateringDatesTrue[pastWateringDatesTrue.length - 1].date ===
//   pastWateringDates[pastWateringDates.length - 1].date &&
//   wateringArray.length > 0
// ) {
//   const lastWateringDate = new Date(
//     pastWateringDatesTrue[pastWateringDatesTrue.length - 1].date
//   );
//
//   const currentFirstDay = new Date(firstDay);
//
//   if (lastWateringDate <= currentFirstDay) {
//     const createdNewDates = createNewWateringDaysPro(gapDays, firstDay);
//     if (currentFirstDay.getTime() === lastWateringDate.getTime())
//       createdNewDates.shift();
//
//     createdNewDates.forEach((item) => {
//       newWateringDates.push(item);
//     });
//
//     const isCurrentInArray = newWateringDates.filter(
//       (item) => item.date === currentFirstDay.toISOString().slice(0, 10)
//     );
//     if (isCurrentInArray.length === 0)
//       newWateringDates.push({
//         date: currentFirstDay.toISOString().slice(0, 10),
//         watered: true,
//       });
//   } else if (!pastWateringDates[pastWateringDates.length - 1].watered) {
//     const fixedToday = new Date();
//     for (let i = 0; i <= 5; i++) {
//       const nextDate = new Date(fixedToday.getTime() + gap * i * 86400000);
//       newWateringDates.push({
//         date: nextDate.toISOString().slice(0, 10),
//         watered: false,
//       });
//     }
//   } else {
//     for (let i = 1; i <= 5; i++) {
//       const newDate = new Date(
//         lastWateringDate.getTime() + gap * i * 86400000
//       );
//       newWateringDates.push({
//         date: newDate.toISOString().slice(0, 10),
//         watered: false,
//       });
//     }
//   }
// } else {
//   const fixedToday = new Date();
//   for (let i = 0; i <= 5; i++) {
//     const nextDate = new Date(fixedToday.getTime() + gap * i * 86400000);
//     newWateringDates.push({
//       date: nextDate.toISOString().slice(0, 10),
//       watered: false,
//     });
//   }
// }
