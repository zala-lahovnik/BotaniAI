import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
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
import {
  createNewWateringDaysPro,
  getWateringDaysPro,
} from '../../utils/plant-watering-calculations';

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

  useEffect(() => {
    getOnlineImageUri(plant.image || '').then((result) => {
      setOnlineImageUri(result)
    }).catch((err) => { console.log(err) })
  }, [plant.image])

  useEffect(() => {
    if(plant._id)
      setMarkedDates(updateMarkedDays().updatedMarkedDates);
  }, [days]);

  useEffect(() => {
    if(today >= date) {
      if(plant._id)
        setDates(getWateringDaysPro(days, date, plant.watering?.wateringArray || []))
    } else {
      if(plant._id)
        setDates(getWateringDaysPro(days, today, plant.watering?.wateringArray || []))
      console.log('Date cannot be in the future');
      // TODO: Alert about date
      setDate(today)
    }
  }, [date])

  function updateMarkedDays() {
    console.log('update', days, date, []);
    const sortedDatesPro = getWateringDaysPro(plant.watering?.days || days, plant.watering?.firstDay || date, plant.watering?.wateringArray || [])
    const newMarkedDatesPro: {
      [date: string]: { selected: boolean; selectedColor: string };
    } = {};

    sortedDatesPro.forEach((item) => {
      const selectedColor: string = item.watered ? '#1672EC' : '#adc487';
      newMarkedDatesPro[item.date] = { selected: true, selectedColor };
    })
    setMarkedDates(newMarkedDatesPro)
    setDates(sortedDatesPro)

    const newPlant: {
      image: any; customName: string; firstDay: string; numberOfDays: string; amountOfWater: string; description: string; wateringArray: { date: string; watered: boolean; }[];
    } = {
      customName: name,
      firstDay: date,
      numberOfDays: days,
      amountOfWater: water,
      description: description,
      wateringArray: sortedDatesPro,
      image: plant.image,
    };
    updatePlant(loggedUser.userId, plant._id, newPlant);
    return { updatedMarkedDates: newMarkedDatesPro, dates: sortedDatesPro };
  }

  function handleBack() {
    navigation.goBack();
  }
  function handleEditTrue() {
    setEdit([true, edit[1]]);
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

          if (edit[1] === true) {
            handleBack()
          }
          deletePlantFromPersonalGarden(loggedUser.userId, plant._id);
          navigation.navigate('PlantListScreen');
        },
      },
    ]);
  }
  async function handleEditFalse() {
    Alert.alert('Save', `Do you wish to save this plant?`, [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          const sortedDatesPro = getWateringDaysPro(days, date, plant.watering?.wateringArray || [])
          const newMarkedDatesPro: {
            [date: string]: { selected: boolean; selectedColor: string };
          } = {};

          sortedDatesPro.forEach((item) => {
            const selectedColor: string = item.watered ? '#1672EC' : '#adc487';
            newMarkedDatesPro[item.date] = { selected: true, selectedColor };
          })
          setMarkedDates(newMarkedDatesPro)
          if (edit[1] === true) {
            const newDates = createNewWateringDaysPro(days, date)

            const plantData: PersonalGardenObject = {
              userId: loggedUser.userId,
              latin: plant.latin,
              common: plant.common,
              customName: name,
              description: description,
              firstDay: date,
              numberOfDays: parseInt(days),
              amountOfWater: parseInt(water),
              wateringArray: newDates,
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
          const newPlant: {
            image: any; customName: string; firstDay: string; numberOfDays: string; amountOfWater: string; description: string; wateringArray: { date: string; watered: boolean; }[];
          } = {
            customName: name,
            firstDay: date,
            numberOfDays: days,
            amountOfWater: water,
            description: description,
            wateringArray: sortedDatesPro,
            image: plant.image
          };
          updatePlant(loggedUser.userId, plant._id, newPlant);
          setEdit([false, edit[1]]);
        },
      },
    ]);

  }
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container, { marginBottom: 90 }]}>
        <Pressable style={styles.puscica}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={handleBack}
          />
        </Pressable>
        <Text style={styles.ime}>{plant.latin}</Text>
        {edit[0] ? (
          <Pressable style={styles.edit} onPress={handleEditFalse}>
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
        )}
      </View>
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
                  aria-expanded={true}
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
    </View >
  );
};
export default PlantViewScreen;
