import { Text, TextInput, View, Pressable, Image, ScrollView } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { Calendar, CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import moment from 'moment';
import React from 'react';
import { styles } from './PlantViewStyles';
import { BottomNavigationBar } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
type Props = NativeStackScreenProps<any>;
export const PlantViewScreen = ({ navigation, route }: Props) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [water, setWater] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [days, setDays] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [markedDates, setMarkedDates] = useState<{ [date: string]: { selected: boolean; marked: boolean; dotColor?: string } }>({});
    const minDate = moment().startOf('isoWeek').format('YYYY-MM-DD');
    function handleDate(day: { dateString: string }) { setDate(day.dateString) }
    function handleMark() {
        const today = new Date()
        const startDate = date;
        const currentDatePlus = new Date(startDate);
        const endDatePlus = new Date(today);
        endDatePlus.setMonth(endDatePlus.getMonth() + 1);
        while (currentDatePlus <= today) {
            const dateString = currentDatePlus.toISOString().split('T')[0];
            console.log(dateString);
            markedDates[dateString] = { selected: true, marked: true, dotColor: 'blue' };
            currentDatePlus.setDate(currentDatePlus.getDate() + parseInt(days));
        }
        while (currentDatePlus <= endDatePlus && currentDatePlus > today) {
            const dateString = currentDatePlus.toISOString().split('T')[0];
            console.log(dateString);
            markedDates[dateString] = { selected: true, marked: true, dotColor: '#adc487' };
            currentDatePlus.setDate(currentDatePlus.getDate() + parseInt(days));
        }
        return markedDates
    }
    function handleBack() {
        navigation.goBack()
    }
    function handleEditTrue() {
        setEdit(true)
    }
    function handleEditFalse() {
        handleMark()
        //save new description, water, name, days, date
        setEdit(false)
    }
    return (
        <View style={{ flex: 1, }}>
            <ScrollView>
                <View style={styles.container}>
                    <Pressable style={styles.puscica}>
                        <Ionicons name="arrow-back" size={24} color="black" onPress={handleBack} />
                    </Pressable>
                    <Text style={styles.ime}>Latinsko ime</Text>
                    {edit ? (<Pressable style={styles.edit} onPress={handleEditFalse}>
                        <Ionicons name="checkmark-done" size={24} color="black" onPress={handleEditFalse} />
                    </Pressable>) : (<Pressable style={styles.edit}>
                        <AntDesign name="edit" size={24} color="black" onPress={handleEditTrue} />
                    </Pressable>)}
                    <Image
                        source={{ uri: 'https://www.ambius.com/blog/wp-content/uploads/2019/03/GettyImages-484148116-770x360.jpg' }}
                        style={styles.image} />
                    {edit ? (<View>
                        <View style={styles.container2}>
                            <View style={styles.leftContainer}>
                                <Text style={styles.text1}>Custom name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={name}
                                    placeholderTextColor="#648983"
                                    onChangeText={setName}
                                    value={name} />
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
                                        value={days} />
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
                                        value={water} />
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
                        <CalendarProvider date={minDate}>
                            <ExpandableCalendar firstDay={1}
                                onDayPress={handleDate}
                                theme={{
                                    calendarBackground: '#ffffff',
                                    selectedDayBackgroundColor: '#134a3e',
                                    monthTextColor: 'black',
                                    dayTextColor: 'black',
                                    todayTextColor: '#adadac',
                                    selectedDayTextColor: '#ffffff',
                                    textSectionTitleColor: 'black',
                                    textDisabledColor: 'black',
                                    arrowColor: "black",
                                }} />
                        </CalendarProvider>
                    </View>) : (<View>
                        <View style={styles.container2}>
                            <View style={styles.leftContainer}>
                                <Text style={styles.text1}>Custom name</Text>
                                <Text style={styles.text2}>{name}</Text>
                            </View>
                            <View style={styles.middleContainer}>
                                <Text style={styles.text1}>Water every</Text>
                                <Text style={styles.text2}>{days} days</Text></View>
                            <View style={styles.rightContainer}>
                                <Text style={styles.text1}>Amount of water</Text>
                                <Text style={styles.text2}>{water} ml</Text>
                            </View>
                        </View>
                        <View style={styles.middleContainer}>
                            <Text style={styles.text1}>Description</Text>
                            <Text style={styles.text3}>{description}</Text>
                        </View>
                        <CalendarProvider date={minDate}>
                            <ExpandableCalendar firstDay={1}
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
                                    arrowColor: "black",
                                }} />
                        </CalendarProvider>
                    </View>)}
                </View>
            </ScrollView >
            <BottomNavigationBar navigation={navigation} route={route} />
        </View>
    );
};