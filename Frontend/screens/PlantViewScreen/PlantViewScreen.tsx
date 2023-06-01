import {
  Text,
  TextInput,
  View,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Calendar,
  CalendarProvider,
  ExpandableCalendar,
} from 'react-native-calendars';
import moment from 'moment';
import { styles } from './PlantViewStyles';
import { BottomNavigationBar } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth } from '../../firebase/firebase';
import { updatePlant, deletePlantFromPersonalGarden } from '../../api/_user';
import { type PersonalGardenPlant } from '../../types/_plant';

type Props = NativeStackScreenProps<any>;
export const PlantViewScreen = ({ navigation, route }: Props) => {
  const { ...plant } = route.params || {};
  const [edit, setEdit] = useState<boolean>(false);
  const [name, setName] = useState<string>(plant.customName);
  const [water, setWater] = useState<string>(
    plant.watering.amountOfWater || '50'
  );
  const [date, setDate] = useState<string>(plant.watering.firstDay);
  const [days, setDays] = useState<string>(plant.watering.numberOfDays);
  const [description, setDescription] = useState<string>(plant.description);
  const [markedDates, setMarkedDates] = useState<{
    [date: string]: { selected: boolean; selectedColor: string };
  }>({});
  const minDate = moment().startOf('isoWeek').format('YYYY-MM-DD');
  const [dates, setDates] = useState<{ date: string; watered: boolean }[]>(
    plant.watering.wateringArray
  );
  const today = new Date().toISOString().split('T')[0];
  const userId = auth.currentUser?.uid || '';
  useEffect(() => {
    if (date && days) {
      setMarkedDates(getBeforeTodayPlusFive(1));
    }
  }, [date, days]);
  function getBeforeTodayPlusFive(start: number) {
    let sortedData: { date: string; watered: boolean }[];
    if (dates.length > 0) {
      const filteredData = dates.filter((item) =>
        moment(item.date).isSameOrBefore(today)
      );
      sortedData = filteredData.sort((a, b) =>
        moment(b.date).diff(moment(a.date))
      );
    } else {
      sortedData = [{ date: date, watered: false }];
    }

    let nextFive: { date: string; watered: boolean }[] = [];
    let startDate = date;
    if (startDate && moment(startDate).isAfter(today)) {
      nextFive = getNextFiveDays(startDate);
    } else {
      startDate = sortedData[0].date;
      nextFive = getNextFiveDays(startDate);
    }
    const updatedDates = [...sortedData, ...nextFive];
    const updatedMarkedDates: {
      [date: string]: { selected: boolean; selectedColor: string };
    } = {};
    for (const dateObj of updatedDates) {
      const { date, watered } = dateObj;
      const selectedColor = watered ? '#1672EC' : '#adc487';
      updatedMarkedDates[date] = { selected: true, selectedColor };
    }
    setDates(updatedDates);
    setMarkedDates(updatedMarkedDates);
    const newPlant = {
      customName: name,
      firstDay: date,
      numberOfDays: days,
      amountOfWater: water,
      description: description,
      wateringArray: dates,
    };
    updatePlant(userId, plant._id, newPlant);
    return updatedMarkedDates;
  }
  function getNextFiveDays(startDate: string) {
    let startingDate = new Date(startDate);
    if (moment(startDate).isSameOrBefore(today)) {
      startingDate = new Date(today);
      setDate(today);
    }
    let i = 1;
    let nextFive: { date: string; watered: boolean }[] = [];
    while (i < 5) {
      const newDate = new Date(
        startingDate.getTime() + i * parseInt(days) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 10);
      nextFive.push({ date: newDate, watered: false });
      i++;
    }
    return nextFive;
  }
  function handleBack() {
    navigation.goBack();
  }
  function handleEditTrue() {
    setEdit(true);
  }
  function handleDelete() {
    Alert.alert('Delete plant', `Do you wish to delete this plant?`, [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          deletePlantFromPersonalGarden(userId, plant._id);
          navigation.navigate('PlantListScreen');
        },
      },
    ]);
  }
  function handleEditFalse() {
    setMarkedDates(getBeforeTodayPlusFive(2));
    const newPlant = {
      customName: name,
      firstDay: date,
      numberOfDays: days,
      amountOfWater: water,
      description: description,
      wateringArray: dates,
    };
    updatePlant(userId, plant._id, newPlant);
    setEdit(false);
  }
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <Pressable style={styles.puscica}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              onPress={handleBack}
            />
          </Pressable>
          <Text style={styles.ime}>{plant.latin}</Text>
          {edit ? (
            <Pressable style={styles.edit} onPress={handleEditFalse}>
              <Ionicons
                name="checkmark-done"
                size={24}
                color="black"
                onPress={handleEditFalse}
              />
            </Pressable>
          ) : (
            <Pressable style={styles.edit}>
              <AntDesign
                name="edit"
                size={24}
                color="black"
                onPress={handleEditTrue}
              />
            </Pressable>
          )}
          <Image
            source={{
              uri: 'https://www.ambius.com/blog/wp-content/uploads/2019/03/GettyImages-484148116-770x360.jpg',
            }}
            style={styles.image}
          />
          {edit ? (
            <View>
              <View style={styles.container2}>
                <View style={styles.leftContainer}>
                  <Text style={styles.text1}>Custom name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={name}
                    placeholderTextColor="#648983"
                    onChangeText={setName}
                    value={name}
                  />
                </View>
                <View style={styles.middleContainer}>
                  <Text style={styles.text1}>Water every</Text>
                  <View style={styles.amount}>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.input2}
                      placeholder={days}
                      placeholderTextColor="#648983"
                      onChangeText={setDays}
                      value={days}
                    />
                    <Text style={styles.text}>days</Text>
                  </View>
                </View>
                <View style={styles.rightContainer}>
                  <Text style={styles.text1}>Amount of water</Text>
                  <View style={styles.amount}>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.input2}
                      placeholder={water}
                      placeholderTextColor="#648983"
                      onChangeText={setWater}
                      value={water}
                    />
                    <Text style={styles.text}>ml</Text>
                  </View>
                </View>
              </View>
              <View style={styles.middleContainer}>
                <Text style={styles.text1}>Description</Text>
                <TextInput
                  style={styles.input}
                  placeholder={description}
                  placeholderTextColor="#648983"
                  onChangeText={setDescription}
                  value={description}
                />
              </View>
              <View>
                <CalendarProvider date={minDate}>
                  <ExpandableCalendar
                    firstDay={1}
                    onDayPress={(day) => setDate(day.dateString)}
                    theme={{
                      calendarBackground: '#ffffff',
                      selectedDayBackgroundColor: '#134a3e',
                      monthTextColor: 'black',
                      dayTextColor: 'black',
                      todayTextColor: '#adadac',
                      selectedDayTextColor: '#ffffff',
                      textSectionTitleColor: 'black',
                      textDisabledColor: 'black',
                      arrowColor: 'black',
                    }}
                  />
                </CalendarProvider>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.container2}>
                <View style={styles.leftContainer}>
                  <Text style={styles.text1}>Custom name</Text>
                  <Text style={styles.text2}>{name}</Text>
                </View>
                <View style={styles.middleContainer}>
                  <Text style={styles.text1}>Water every</Text>
                  <Text style={styles.text2}>{days} days</Text>
                </View>
                <View style={styles.rightContainer}>
                  <Text style={styles.text1}>Amount of water</Text>
                  <Text style={styles.text2}>{water} ml</Text>
                </View>
              </View>
              <View style={styles.middleContainer}>
                <Text style={styles.text1}>Description</Text>
                <Text style={styles.text3}>{description}</Text>
              </View>
              <View>
                <CalendarProvider date={minDate}>
                  <ExpandableCalendar
                    firstDay={1}
                    markedDates={markedDates}
                    theme={{
                      calendarBackground: '#ffffff',
                      selectedDayBackgroundColor: '#134a3e',
                      monthTextColor: 'black',
                      dayTextColor: 'black',
                      todayTextColor: '#adadac',
                      selectedDayTextColor: '#ffffff',
                      textSectionTitleColor: 'black',
                      textDisabledColor: 'black',
                      arrowColor: 'black',
                    }}
                  />
                </CalendarProvider>
              </View>
            </View>
          )}
        </View>
        <Pressable style={styles.buttonContainer} onPress={handleDelete}>
          <View style={styles.button}>
            <Ionicons
              name="trash"
              size={21}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Delete plant</Text>
          </View>
        </Pressable>
      </ScrollView>
      <BottomNavigationBar navigation={navigation} route={route} />
    </View>
  );
};
export default PlantViewScreen;
