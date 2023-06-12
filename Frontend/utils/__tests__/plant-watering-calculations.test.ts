import {
  CaptureTime,
  createNewWateringDaysPro,
  getImageCaptureTime,
  getLastWateredDateIndex,
  getNextWateringDay,
  getNumberBetweenDates,
  getNumberOfDaysTillNextWatering,
  getWateringDaysPro,
  getWateringPercentage,
  sortPlantsByWateringStatus,
  WateringStatus,
} from '../plant-watering-calculations';
import { type PersonalGardenPlant } from '../../types/_plant';

describe('getImageCaptureTime', () => {
  it('should return CaptureTime.Today for today', () => {
    const today = new Date();
    expect(getImageCaptureTime(today)).toBe(CaptureTime.Today);
  });

  it('should return CaptureTime.ThisWeek or CaptureTime.Today if it is Monday', () => {
    const today = new Date();
    if (today.getDay() === 1) {
      expect(getImageCaptureTime(today)).toBe(CaptureTime.Today);
    } else {
      let thisWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay() - 1
      );
      expect(getImageCaptureTime(thisWeek)).toBe(CaptureTime.ThisWeek);
    }
  });

  it('should return CaptureTime.LastWeek or CaptureTime.LastMonth if it is the first week of the month', () => {
    const today = new Date();
    const previousWeekDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 6
    );
    if (today.getDate() < 7) {
      expect(getImageCaptureTime(previousWeekDate)).toBe(CaptureTime.LastMonth);
    } else {
      expect(getImageCaptureTime(previousWeekDate)).toBe(CaptureTime.LastWeek);
    }
  });

  it('should return CaptureTime.LastMonth', () => {
    const currentDate = new Date();
    const previousMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    expect(getImageCaptureTime(previousMonthDate)).toBe(CaptureTime.LastMonth);
  });

  it('should return CaptureTime.ThisYear', () => {
    const currentDate = new Date();
    const currentYearDate = new Date(currentDate.getFullYear(), 0, 1);
    expect(getImageCaptureTime(currentYearDate)).toBe(CaptureTime.ThisYear);
  });

  it('should return "Way back" for dates before this year', () => {
    const currentDate = new Date();
    const previousYearDate = new Date('2022-06-06');
    expect(getImageCaptureTime(previousYearDate)).toBe('Way back');
  });
});

const plants: PersonalGardenPlant[] = [
  {
    _id: '1',
    latin: 'Plant1',
    common: 'Plant1',
    customName: 'My Plant One',
    description: 'This is plant one',
    watering: {
      firstDay: '2023-05-20',
      numberOfDays: '2',
      amountOfWater: '100',
      wateringArray: [
        { date: '2023-05-20', watered: true },
        { date: '2023-05-22', watered: false },
        { date: '2023-05-24', watered: false },
        { date: '2023-05-26', watered: true },
        { date: '2023-05-28', watered: true },
        { date: '2023-05-30', watered: true },
        { date: '2023-06-01', watered: false },
      ],
    },
    image: 'plant1.jpg',
  },
  {
    _id: '2',
    latin: 'Plant2',
    common: 'Plant2',
    customName: 'My Plant Two',
    description: 'This is plant two',
    watering: {
      firstDay: '2023-05-21',
      numberOfDays: '3',
      amountOfWater: '150ml',
      wateringArray: [
        { date: '2023-05-21', watered: true },
        { date: '2023-05-24', watered: true },
        { date: '2023-05-27', watered: false },
      ],
    },
    image: 'plant2.jpg',
  },
];

describe('sortPlantsByWateringStatus', () => {
  it('should sort plants by watering status', () => {
    const sortedPlants = sortPlantsByWateringStatus(plants);

    expect(sortedPlants).toEqual([plants[1], plants[0]]);
  });
});

describe('getLastWateredDateIndex', () => {
  it('should return 1', () => {
    const wateringArray = plants[1].watering.wateringArray;
    const lastWateredIndex = getLastWateredDateIndex(wateringArray);
    expect(lastWateredIndex).toBe(1);
  });

  it('should return 5', () => {
    const wateringArray = plants[0].watering.wateringArray;
    const lastWateredIndex = getLastWateredDateIndex(wateringArray);
    expect(lastWateredIndex).toBe(5);
  });
});

describe('getNextWateringDay', () => {
  it('should return WateringStatus.NotWatered', () => {
    const lastWateredDate = new Date('2023-05-26');
    const nextWateredDate = new Date('2023-05-28');
    const result = getNextWateringDay(lastWateredDate, nextWateredDate);
    expect(result).toEqual(WateringStatus.NotWatered);
  });
  it('should return WateringStatus.Today', () => {
    const lastWateredDate = new Date('2023-05-24');
    const nextWateredDate = new Date();
    const result = getNextWateringDay(lastWateredDate, nextWateredDate);
    expect(result).toEqual(WateringStatus.Today);
  });
});

describe('getNumberBetweenDates', () => {
  it('should return the number between today and lastWateredDate', () => {
    const lastWateredDate = new Date('2023-05-20');
    const numbersBetween = getNumberBetweenDates(lastWateredDate);
    let result = new Date().getTime() - lastWateredDate.getTime();
    expect(numbersBetween).toEqual(Math.floor(result / (1000 * 3600 * 24)));
  });
});

describe('getNumberOfDaysTillNextWatering', () => {
  it('should return 1 day till next watering', () => {
    const nextWateringDate = new Date(
      new Date().setDate(new Date().getDate() + 1)
    );
    const result = getNumberOfDaysTillNextWatering(nextWateringDate);
    expect(result).toEqual(1);
  });

  it('should return 6 days till next watering', () => {
    const nextWateringDate = new Date(
      new Date().setDate(new Date().getDate() + 6)
    );
    const result = getNumberOfDaysTillNextWatering(nextWateringDate);
    expect(result).toEqual(6);
  });

  it('should return 0 days till next watering', () => {
    const nextWateringDate = new Date(new Date().setDate(new Date().getDate()));
    const result = getNumberOfDaysTillNextWatering(nextWateringDate);
    expect(result).toEqual(0);
  });

  it('should return -1 days till next watering', () => {
    const nextWateringDate = new Date(
      new Date().setDate(new Date().getDate() - 1)
    );
    const result = getNumberOfDaysTillNextWatering(nextWateringDate);
    expect(result).toEqual(-1);
  });
});

describe('getWateringPercentage', () => {
  it('should return 0 percent water remaining', () => {
    const lastWatered = new Date(new Date().setDate(new Date().getDate() - 7));
    const interval = 7;
    const result = getWateringPercentage(lastWatered, interval);
    expect(result).toEqual(0);
  });

  it('should return 50 percent water remaining', () => {
    const lastWatered = new Date(new Date().setDate(new Date().getDate() - 1));
    const interval = 2;
    const result = getWateringPercentage(lastWatered, interval);
    expect(result).toEqual(50);
  });

  it('should return 100 percent water remaining', () => {
    const lastWatered = new Date(new Date().setDate(new Date().getDate()));
    const interval = 2;
    const result = getWateringPercentage(lastWatered, interval);
    expect(result).toEqual(100);
  });
});

describe('createNewWateringDaysPro', () => {
  it('should create watering array, set watered to true for dates before today and add 5 next from today', () => {
    const gap = '3';
    let today: string | Date = new Date().toISOString().split('T')[0];
    let firstDate: string | Date = new Date(
      new Date().setDate(new Date().getDate() - 8)
    )
      .toISOString()
      .split('T')[0];

    const expectedDates = () => {
      let dates = [];

      firstDate = new Date(firstDate);
      today = new Date(today);

      while (firstDate <= today) {
        dates.push({
          date: firstDate.toISOString().split('T')[0],
          watered: true,
        });
        firstDate.setDate(firstDate.getDate() + parseInt(gap));
      }

      for (let i = 0; i < 4; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(currentDate.getDate() + i * parseInt(gap) + 1);
        dates.push({
          date: currentDate.toISOString().split('T')[0],
          watered: false,
        });
      }
      return dates;
    };

    const result = createNewWateringDaysPro(gap, firstDate);

    expect(result).toEqual(expectedDates());
  });
});

describe('getWateringDatesPro', () => {
  it('If you missed a watering day, should create watering array, keep past watered dates, add new 5 starting from today and set them to false', () => {
    const gap = '4';
    let firstDate: string | Date = new Date(
      new Date().setDate(new Date().getDate() - 9)
    )
      .toISOString()
      .split('T')[0];

    // starting watering array has two dates in the past which have watered true and the last one has watered false
    // meaning we missed a day in the past
    let startingWateringArray = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(
        new Date(firstDate).getTime() + Number(gap) * i * 86400000
      );
      if (i < 2) {
        startingWateringArray.push({
          date: newDate.toISOString().slice(0, 10),
          watered: true,
        });
      } else {
        startingWateringArray.push({
          date: newDate.toISOString().slice(0, 10),
          watered: false,
        });
      }
    }

    const expectedDates = () => {
      let dates = [];
      firstDate = new Date(firstDate);

      for (let i = 0; i < 2; i++) {
        const newDate = new Date(
          new Date(firstDate).getTime() + Number(gap) * i * 86400000
        );
        dates.push({ date: newDate.toISOString().slice(0, 10), watered: true });
      }

      for (let i = 0; i < 6; i++) {
        const newDate = new Date(
          new Date().getTime() + Number(gap) * i * 86400000
        );
        dates.push({
          date: newDate.toISOString().slice(0, 10),
          watered: false,
        });
      }
      return dates;
    };

    const result = getWateringDaysPro(gap, firstDate, startingWateringArray);

    expect(result).toEqual(expectedDates());
  });

  it('Should create new array from the new first watered day entered keeping the past ones that are true', () => {
    let firstDate: string | Date = new Date(
      new Date().setDate(new Date().getDate() - 2)
    )
      .toISOString()
      .slice(0, 10);
    const firstDayThatHasBeenWatered = new Date(
      new Date().setDate(new Date().getDate() - 9)
    );
    const gapDays = '5';

    console.log('firstDate', firstDate);

    let startingWateringArray = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(
        new Date(firstDayThatHasBeenWatered).getTime() +
          Number(gapDays) * i * 86400000
      );
      if (
        newDate.toISOString().slice(0, 10) <
        new Date().toISOString().slice(0, 10)
      ) {
        startingWateringArray.push({
          date: newDate.toISOString().slice(0, 10),
          watered: true,
        });
      } else {
        startingWateringArray.push({
          date: newDate.toISOString().slice(0, 10),
          watered: false,
        });
      }
    }

    console.log('starting Watering array', startingWateringArray);

    const expectedDates = () => {
      const dates = [];

      for (let i = 0; i < 7; i++) {
        const newDate = new Date(
          new Date(firstDayThatHasBeenWatered).getTime() +
            Number(gapDays) * i * 86400000
        );
        if (
          newDate.toISOString().slice(0, 10) <=
          new Date(firstDate).toISOString().slice(0, 10)
        ) {
          dates.push({
            date: newDate.toISOString().slice(0, 10),
            watered: true,
          });
        } else {
          const currentLastDayOfWatering = new Date(
            new Date(firstDate).getTime() + Number(gapDays) * (i - 2) * 86400000
          );
          if (
            currentLastDayOfWatering.toISOString().slice(0, 10) <=
            new Date().toISOString().slice(0, 10)
          ) {
            dates.push({
              date: currentLastDayOfWatering.toISOString().slice(0, 10),
              watered: true,
            });
          } else {
            dates.push({
              date: currentLastDayOfWatering.toISOString().slice(0, 10),
              watered: false,
            });
          }
        }
      }
      return dates;
    };

    console.log('expected dates', expectedDates());

    const result = getWateringDaysPro(
      gapDays,
      firstDate,
      startingWateringArray
    );

    expect(result).toEqual(expectedDates());
  });

  it('Should add one more date to the end of array', () => {
    const gapDays = '4';
    let firstDate: string | Date = new Date(
      new Date().setDate(new Date().getDate() - 9)
    )
      .toISOString()
      .split('T')[0];

    let startingWateringArray = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(
        new Date(firstDate).getTime() + Number(gapDays) * i * 86400000
      );
      if (
        newDate.toISOString().slice(0, 10) <
        new Date().toISOString().slice(0, 10)
      ) {
        startingWateringArray.push({
          date: newDate.toISOString().slice(0, 10),
          watered: true,
        });
      } else {
        startingWateringArray.push({
          date: newDate.toISOString().slice(0, 10),
          watered: false,
        });
      }
    }

    const expectedDates = () => {
      const dates = [];

      for (let i = 0; i < 8; i++) {
        const newDate = new Date(
          new Date(firstDate).getTime() + Number(gapDays) * i * 86400000
        );
        if (
          newDate.toISOString().slice(0, 10) <=
          new Date().toISOString().slice(0, 10)
        ) {
          dates.push({
            date: newDate.toISOString().slice(0, 10),
            watered: true,
          });
        } else {
          dates.push({
            date: newDate.toISOString().slice(0, 10),
            watered: false,
          });
        }
      }
      return dates;
    };

    const result = getWateringDaysPro(
      gapDays,
      firstDate,
      startingWateringArray
    );
    expect(result).toEqual(expectedDates());
  });

  it('Changing the last day that you watered a plant to a past date (before the last time the plant has been watered) shouldn not change anything', () => {
    const gapDays = '4';
    let firstDate: string | Date = new Date(
      new Date().setDate(new Date().getDate() - 9)
    )
      .toISOString()
      .split('T')[0];

    let startingWateringArray = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(
        new Date(firstDate).getTime() + Number(gapDays) * i * 86400000
      );
      if (
        newDate.toISOString().slice(0, 10) <
        new Date().toISOString().slice(0, 10)
      ) {
        startingWateringArray.push({
          date: newDate.toISOString().slice(0, 10),
          watered: true,
        });
      } else {
        startingWateringArray.push({
          date: newDate.toISOString().slice(0, 10),
          watered: false,
        });
      }
    }

    const expectedDates = () => {
      const dates = [];

      for (let i = 0; i < 8; i++) {
        const newDate = new Date(
          new Date(firstDate).getTime() + Number(gapDays) * i * 86400000
        );
        if (
          newDate.toISOString().slice(0, 10) <=
          new Date().toISOString().slice(0, 10)
        ) {
          dates.push({
            date: newDate.toISOString().slice(0, 10),
            watered: true,
          });
        } else {
          dates.push({
            date: newDate.toISOString().slice(0, 10),
            watered: false,
          });
        }
      }
      return dates;
    };

    let newFirstDay: string | Date = new Date(
      new Date().setDate(new Date().getDate() - 20)
    )
      .toISOString()
      .split('T')[0];

    const result = getWateringDaysPro(
      gapDays,
      newFirstDay,
      startingWateringArray
    );
    expect(result).toEqual(expectedDates());
  });
});
