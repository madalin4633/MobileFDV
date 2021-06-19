import React, { Component, useContext, useState, useEffect, useRef } from "react";
import { FlatList, TextInput, Button, StyleSheet, View, Image, Dimensions, TouchableOpacity, Text, Alert } from "react-native";
import MaterialBasicFooter1 from "../components/MaterialBasicFooter1";
import { useFonts } from '@expo-google-fonts/inter';
import { AuthContext } from '../AuthProvider';
import { useNavigation } from '@react-navigation/native';
import firebase from '../database/firebaseDb';
import LoadingScreen from './LoadingScreen';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import EntypoIcon from "react-native-vector-icons/Entypo";
import DateTimePicker from '@react-native-community/datetimepicker';

function compare( a, b ) {
  if ( a.at_date > b.at_date ){
    return -1;
  }
  if ( a.at_date < b.at_date ){
    return 1;
  }
  return 0;
}

function TasksScreen(props) {
  const navigation = useNavigation();

  var dateVal = new Date();
  const { user, setUser } = useContext(AuthContext);
  const [type, setType] = useState('');
  const [edit, setEdit] = useState('');
  const [title, setTitle] = useState('');
  const [descr, setDescr] = useState('');
  const [hours, setHours] = useState('');
  const [date, setDate] = useState(dateVal);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [announces, setAnnounces] = useState([]);
  const isMounted = useRef(null);

  const getAnnounces = async () => {
    var database2 = firebase.database();
    database2.ref('/announcements/').orderByChild('at_date').on('value', function (snapshot) {
      var announces = [];
      snapshot.forEach(function (childSnapshot) {
        let object = {};
        if (childSnapshot.toJSON().created_by === user.uid) {
          object['title'] = childSnapshot.toJSON().title;
          object['id'] = childSnapshot.key;
          object['description'] = childSnapshot.toJSON().description;
          let d = new Date(childSnapshot.toJSON().announce_time);
          let month = '' + (d.getMonth() + 1);
          let day = '' + d.getDate();
          let year = d.getFullYear();
          if (month.length < 2)
            month = '0' + month;
          if (day.length < 2)
            day = '0' + day;

          let hours = d.getHours().toString();
          let minutes = d.getMinutes().toString();
          if (hours.length < 2)
            hours = '0' + hours;
          if (minutes.length < 2)
            minutes = '0' + minutes;

          object['for_date'] = day+'/'+month+'/'+year;
          object['hour'] = hours + ':' + minutes;
          object['at_date'] = childSnapshot.toJSON().created_at;
          announces.push(object);
        }
      });
      announces.sort(compare);
      setAnnounces(announces);
    });
  }

  useEffect(() => {
    isMounted.current = true;
    getAnnounces();
    return () => {
      // executed when unmount
      isMounted.current = false;
    }
  }, []);


  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    if (event.type == "set") {          //ok button
      let dateObj = new Date(selectedDate);
      setDate(dateObj);
    } else {
      //cancel button
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  if (type === '') {
    var database = firebase.database();
    database.ref("/accounts/" + user.uid).on('value', function (snapshot) {
      var childData = snapshot.val();
      setType(childData.type);
      setEdit(childData.edited);
    });
  }

  const Item = ({ item, backgroundColor, textColor }) => (
    <View style={stylesList.container}>
      <TouchableOpacity style={[stylesList.item, backgroundColor]}>
        <Text style={[stylesList.title, textColor]}>{item.title} | {item.for_date} | {item.hour}</Text>
        <Text style={[stylesList.text, textColor]}>{item.description}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = "rgba(0,149,218,1)";
    const color = 'white';

    return (
      <Item
        item={item}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  if (edit === 1) {
    if (type === 1)
      return (
        <View style={styles.container}>
          <EntypoIcon name="info-with-circle" style={styles.icon3}></EntypoIcon>
          <Image
            source={require("../assets/images/fabrica_de_voluntari.png")}
            resizeMode="contain"
            style={styles.image1}
          ></Image>

          <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width }}>
            <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'grey', bottom: 0, marginTop: 'auto' }} />
            <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Creează un anunț</Text>
          </View>

          <Text style={styles.loremIpsum1}>
            Poate fi informativ sau un task pentru voluntari.
          </Text>

          <View style={styles.titleStack}>
            <EntypoIcon name="briefcase" style={styles.icon4}></EntypoIcon>
            <Text style={styles.title}>:</Text>
            <View style={[stylesss.container]}>
              <TextInput
                placeholder={"titlul anunțului, obligatoriu"}
                style={stylesss.inputStyle}
                onChangeText={(text) => setTitle(text)}
                value={title}
              ></TextInput>
            </View>
          </View>

          <View style={styles.titleStack}>
            <EntypoIcon name="chat" style={styles.icon4}></EntypoIcon>
            <Text style={styles.title}>:</Text>
            <View style={[stylesss.container]}>
              <TextInput
                placeholder={"scurtă descriere, obligatorie"}
                style={stylesss.inputStyle}
                multiline={true}
                onChangeText={(text) => setDescr(text)}
                value={descr}
              ></TextInput>
            </View>
          </View>

          <View style={styles.titleStack}>
            <EntypoIcon name="clock" style={styles.icon4}></EntypoIcon>
            <Text style={styles.title}>:</Text>
            <View style={[stylesss.container]}>
              <TextInput
                placeholder={"durată estimativă în ore, nr. întreg"}
                keyboardType='phone-pad'
                style={stylesss.inputStyle}
                onChangeText={(text) => setHours(text)}
                value={hours}
              ></TextInput>
            </View>
          </View>

          <View style={styles.titleStack}>
            <EntypoIcon name="publish" style={styles.icon4}></EntypoIcon>
            <Text style={styles.title}>:</Text>
            <View style={[stylesss.container]}>
              <TouchableOpacity
                style={[dateS.container, props.style]}
                onPress={showDatepicker}>
                <Text style={dateS.deconnect}>
                  data activității</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.titleStack}>
            <EntypoIcon name="paper-plane" style={styles.icon4}></EntypoIcon>
            <Text style={styles.title}>:</Text>
            <View style={[stylesss.container]}>
              <TouchableOpacity
                style={[dateS.container, props.style]}
                onPress={showTimepicker}>
                <Text style={dateS.deconnect}>
                  ora activității</Text>
              </TouchableOpacity>
            </View>
          </View>

          {show && ( // showDatepicker
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}

          <TouchableOpacity
            style={[styless.container, props.style]}>
            <Text style={styless.deconnect}
              onPress={() => {
                if (title === '' || descr === '' || hours === '') {
                  Alert.alert("Câmpuri incomplete!");
                } else {
                  var database1 = firebase.database();
                  database1.ref('/announcements/').push({
                    title: title,
                    description: descr,
                    hours: parseInt(hours),
                    announce_time: firebase.firestore.Timestamp.fromDate(date).toDate().toString(),
                    created_at: firebase.database.ServerValue.TIMESTAMP,
                    created_by: user.uid,
                  });
                  Alert.alert("Anunțul tău a fost creat.");
                }
              }}>
              Adaugă anunț</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width }}>
            <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'grey', bottom: 0, marginTop: 'auto' }} />
            <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Anunțuri anterioare</Text>
          </View>

          <FlatList
            data={announces}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />

          <View style={styles.footerContainer}>
            <MaterialBasicFooter1
              style={styles.materialBasicFooter1}
            ></MaterialBasicFooter1>
          </View>
        </View>
      );
    else return null;
  }
  else return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/fabrica_de_voluntari.png")}
        resizeMode="contain"
        style={styles.image1}
      ></Image>
      <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: "40%" }}>
        <View style={{ width: 125, height: 3, backgroundColor: 'rgba(0,149,218,1)', marginBottom: 25 }} />
        <Text style={home.textW}>Bine ai venit,</Text>
        <Text style={home.textW}>completează-ți profilul</Text>
        <Text style={home.textW}>pentru a debloca aplicația.</Text>
        <View style={{ width: 125, height: 3, backgroundColor: 'rgba(0,149,218,1)', marginTop: 30 }} />
      </View>

      <View style={styles.footerContainer}>
        <MaterialBasicFooter1
          style={styles.materialBasicFooter1}
        ></MaterialBasicFooter1>
      </View>
    </View>
  );
}

const stylesList = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginTop: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10
  },
  title: {
    fontSize: 15,
    width: Dimensions.get('window').width * 7 / 10,
    fontFamily: 'Quicksand',
  },
  text: {
    fontSize: 10,
    fontFamily: 'Quicksand'
  }
});


const dateS = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,149,218,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 2,
    minWidth: 275,
    paddingLeft: 16,
    paddingRight: 16
  },
  deconnect: {
    color: "#fff",
    fontSize: 15,
    fontFamily: 'Quicksand'
  }
});


const styless = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,149,218,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    shadowColor: "#000",
    marginTop: "5%",
    marginBottom: "5%",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 2,
    minWidth: 88,
    paddingLeft: 16,
    paddingRight: 16
  },
  deconnect: {
    color: "#fff",
    fontSize: 22,
    fontFamily: 'Quicksand'
  },
});


const stylesss = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#D9D5DC",
    backgroundColor: "transparent",
  },
  inputStyle: {
    color: "#000",
    fontSize: 16,
    lineHeight: 16,
    width: 275
  }
});

const home = StyleSheet.create({
  textW: {
    textAlign: 'center',
    fontFamily: "Quicksand",
    fontSize: 25,
    color: "black"
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  materialBasicFooter1: {
    height: 56,
    width: Dimensions.get('window').width,
  },
  image1: {
    width: 100,
    height: 100,
    marginTop: 48,
    alignSelf: "center"
  },
  footerContainer: {
    marginTop: 'auto',
    bottom: 0
  },
  icon3: {
    flex: 0,
    position: "absolute",
    color: "rgba(0,149,218,1)",
    fontSize: 25,
    marginRight: "10%",
    marginTop: 50,
    alignSelf: 'flex-end',
  },
  loremIpsum1: {
    fontFamily: "Quicksand",
    color: "rgba(96,93,93,1)",
    textAlign: "center",
    fontSize: 13,
  },
  titleStack: {
    marginTop: "3.5%",
    flexDirection: "row",
  },
  title: {
    fontFamily: "Quicksand",
    color: "rgba(0,149,218,1)",
    fontSize: 18,
    marginLeft: 2,
    marginRight: 20
  },
  icon4: {
    color: "rgba(0,149,218,1)",
    fontSize: 25,
    marginLeft: 10
  },
});

export default TasksScreen;
