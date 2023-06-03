import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import moment from 'moment';
import { styles } from './PlantViewStyles';
import { BottomNavigationBar } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getOnlineImageUri } from '../../firebase/firebase';
import {
  addPlantToPersonalGarden,
  deletePlantFromPersonalGarden,
  PersonalGardenObject,
  updatePlant,
} from '../../api/_user';
import { UserContext } from '../../context/UserContext';

type Props = NativeStackScreenProps<any>;

export const PlantViewScreen = ({ navigation, route }: Props) => {
  const { ...plant } = route.params || {};
  const today: string = new Date().toISOString().split('T')[0];
  const [edit, setEdit] = useState<[boolean, boolean]>([plant.edit, plant.edit] || [false, false]);
  const [name, setName] = useState<string>(plant.customName || "");
  const [water, setWater] = useState<string>(plant.watering?.amountOfWater.toString() || '50');
  const [date, setDate] = useState<string>(plant.watering?.firstDay || today);
  const [days, setDays] = useState<string>(plant.watering?.numberOfDays.toString() || "7");
  const [description, setDescription] = useState<string>(plant.description || "");
  const [markedDates, setMarkedDates] = useState<{ [date: string]: { selected: boolean; selectedColor: string }; }>({});
  const minDate: string = moment().startOf('isoWeek').format('YYYY-MM-DD');
  const [dates, setDates] = useState<{ date: string; watered: boolean }[]>(plant.watering?.wateringArray);
  const { user: loggedUser, dispatch } = useContext(UserContext);
  const [onlineImageUri, setOnlineImageUri] = useState('')
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  useEffect(() => {
    getOnlineImageUri(plant.image || '').then((result) => {
      setOnlineImageUri(result)
    }).catch((err) => { console.log(err) })
  }, [plant.image])

  useEffect(() => {
    if (date && days) {
      setMarkedDates(getBeforeTodayPlusFive().updatedMarkedDates);
    }
  }, [date, days]);
  function getBeforeTodayPlusFive() {
    let sortedData: { date: string; watered: boolean }[];
    if (dates && dates.length > 0) {
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
    let startDate: string = date;
    if (startDate && moment(startDate).isAfter(today)) {
      nextFive = getNextFiveDays(startDate);
    } else {
      startDate = sortedData[0].date;
      nextFive = getNextFiveDays(startDate);
    }
    const updatedDates: { date: string; watered: boolean; }[] = [...sortedData, ...nextFive];
    const updatedMarkedDates: {
      [date: string]: { selected: boolean; selectedColor: string };
    } = {};
    for (const dateObj of updatedDates) {
      const { date, watered } = dateObj;
      const selectedColor: string = watered ? '#1672EC' : '#adc487';
      updatedMarkedDates[date] = { selected: true, selectedColor };
    }
    const newPlant: {
      image: any; customName: string; firstDay: string; numberOfDays: string; amountOfWater: string; description: string; wateringArray: { date: string; watered: boolean; }[];
    } = {
      customName: name,
      firstDay: date,
      numberOfDays: days,
      amountOfWater: water,
      description: description,
      wateringArray: updatedDates,
      image: plant.image,
    };
    updatePlant(loggedUser.userId, plant._id, newPlant);
    return { updatedMarkedDates: updatedMarkedDates, dates: updatedDates };
  }
  function getNextFiveDays(startDate: string) {
    let startingDate: Date = new Date(startDate);
    if (moment(startDate).isSameOrBefore(today)) {
      startingDate = new Date(today);
      setDate(today);
    }
    let i: number = 0;
    let nextFive: { date: string; watered: boolean }[] = [];

    if (edit[1] === true) {
      const previousDate = new Date(startingDate);
      previousDate.setDate(startingDate.getDate() - parseInt(days));
      nextFive.push({ date: previousDate.toISOString().slice(0, 10), watered: true })
    }
    while (i <= 5) {
      const newDate: string = new Date(
        startingDate.getTime() + i * parseInt(days) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      nextFive.push({ date: newDate, watered: false });
      i++;
    }
    return nextFive;
  }

  function handleBack() {
    navigation.goBack();
  }
  function handleEditTrue() {
    setEdit([true, edit[1]]);
  }
  function handleDelete() {
    setModalVisible1(!modalVisible1)
    if (edit[1] === true) {
      handleBack()
    }
    deletePlantFromPersonalGarden(loggedUser.userId, plant._id);
    navigation.navigate('PlantListScreen');
  }
  async function handleEditFalse() {
    setModalVisible2(!modalVisible2)

    if (edit[1] === true) {
      const plantData: PersonalGardenObject = {
        userId: loggedUser.userId,
        latin: plant.latin,
        common: plant.common,
        customName: name,
        description: description,
        firstDay: date,
        numberOfDays: parseInt(days),
        amountOfWater: parseInt(water),
        wateringArray: getNextFiveDays(date),
        image: plant.imageToSave || plant.image,
      };
      setEdit([edit[0], false]);
      try {
        await addPlantToPersonalGarden(plantData);
        console.log('Plant added successfully');
        navigation.navigate("PlantListScreen")
      } catch (error) {
        console.error('Failed to add plant:', error);
      }
    }
    const newMDates = getBeforeTodayPlusFive()
    setMarkedDates(newMDates.updatedMarkedDates);
    const newPlant: {
      image: any; customName: string; firstDay: string; numberOfDays: string; amountOfWater: string; description: string; wateringArray: { date: string; watered: boolean; }[];
    } = {
      customName: name,
      firstDay: date,
      numberOfDays: days,
      amountOfWater: water,
      description: description,
      wateringArray: newMDates.dates,
      image: plant.image
    };
    updatePlant(loggedUser.userId, plant._id, newPlant);
    setEdit([false, edit[1]]);


  }
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container, { marginBottom: 90 }]}>


        <Modal animationType="slide" transparent={true} visible={modalVisible1} onRequestClose={() => { setModalVisible1(!modalVisible1); }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ fontWeight: 'bold', fontSize: 24 }} >Delete plant?</Text>
              <Text style={{ paddingBottom: 20, paddingTop: 10 }}>Do you wish to delete this plant?</Text>
              <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                <Pressable style={[{ backgroundColor: '#B00020', padding: 10 }, styles.modalText]} onPress={handleDelete}><Text style={{ color: 'white', textAlign: 'center' }}>Delete</Text></Pressable>
                <Pressable style={[{ backgroundColor: '#124A3F' }, styles.modalText]} onPress={() => setModalVisible1(!modalVisible1)}><Text style={{ color: 'white', textAlign: 'center' }}> Cancel</Text></Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal animationType="slide" transparent={true} visible={modalVisible2} onRequestClose={() => { setModalVisible2(!modalVisible2); }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ fontWeight: 'bold', fontSize: 24 }} >Save plant?</Text>
              <Text style={{ paddingBottom: 20, paddingTop: 10 }}>Do you wish to save this plant?</Text>
              <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                <Pressable style={[{ backgroundColor: '#124A3F' }, styles.modalText]} onPress={handleEditFalse}><Text style={{ color: 'white', textAlign: 'center' }}>Save</Text></Pressable>
                <Pressable style={[{ backgroundColor: '#B00020' }, styles.modalText]} onPress={() => setModalVisible2(!modalVisible2)}><Text style={{ color: 'white', textAlign: 'center' }}> Cancel</Text></Pressable>
              </View>
            </View>
          </View>
        </Modal>






        <Pressable style={styles.puscica}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={handleBack}
          />
        </Pressable>
        <Text style={styles.ime}>{plant.latin}</Text>
        {
          edit[0] ? (
            <Pressable style={styles.edit} onPress={() => setModalVisible2(!modalVisible2)}>
              <Ionicons
                name="checkmark-done"
                size={24}
                color="black"
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
          )
        }
      </View >
      <ScrollView >
        <Image source={{ uri: onlineImageUri }} style={styles.image} />
        {edit[0] ? (
          <View>
            <View style={styles.middleContainer}>
              <Text style={styles.text1}>Custom name</Text>
              <TextInput
                style={styles.input}
                placeholder={name}
                placeholderTextColor="#648983"
                onChangeText={setName}
                value={name}
              />
            </View>
            <View style={styles.container2}>
              <View style={styles.leftContainer}>
                <Text style={styles.text1}>Water every</Text>
                <View style={styles.amount}>
                  <TextInput
                    keyboardType="numeric"
                    style={[styles.input2, { width: '30%' }]}
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
                value={description} />
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
                    selectedDayBackgroundColor: 'white',
                    monthTextColor: 'black',
                    dayTextColor: 'black',
                    todayTextColor: '#adadac',
                    selectedDayTextColor: 'black',
                    textSectionTitleColor: 'black',
                    textDisabledColor: 'grey',
                    arrowColor: 'black',
                  }}
                />
              </CalendarProvider>
            </View>
          </View>
        )}
        <Pressable style={styles.buttonContainer} onPress={() => setModalVisible1(!modalVisible1)}>
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
    </View >
  );
};
export default PlantViewScreen;
