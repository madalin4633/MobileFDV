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
import * as Print from 'expo-print';
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

function compare(a, b) {
  if (a.at_date > b.at_date) {
    return -1;
  }
  if (a.at_date < b.at_date) {
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
  const [mode2, setMode2] = useState('date');
  const [show2, setShow2] = useState(false);
  const [date2, setDate2] = useState(dateVal);
  const [announces, setAnnounces] = useState([]);
  const isMounted = useRef(null);
  const [ngos, setNgos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const getNGOS = async () => {
    var database2 = firebase.database();
    database2.ref('/ngos/').on('value', function (snapshot) {
      var ngosHere = [];
      if (snapshot.numChildren() != 0)
        snapshot.forEach(function (childSnapshot) {
          var accepted = childSnapshot.child("/accepted/" + user.uid.toString()).numChildren();
          if (accepted != 0) {
            let object = {};
            object['name'] = childSnapshot.toJSON().name;
            object['id'] = childSnapshot.key;
            ngosHere.push(object);
          }
        });
      setNgos(ngosHere);
    });
  }

  const getAnnounces = async (ngoUID) => {
    var database2 = firebase.database();
    database2.ref('/announcements/').orderByChild('at_date').on('value', function (snapshot) {
      var announces = [];
      snapshot.forEach(function (childSnapshot) {
        let object = {};
        if (childSnapshot.toJSON().created_by === ngoUID) {
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

          object['for_date'] = day + '/' + month + '/' + year;
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
    if (selectedId != null)
      getAnnounces();
    getNGOS();
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

  const onChange2 = (event, selectedDate) => {
    setShow2(Platform.OS === 'ios');
    if (event.type == "set") {          //ok button
      let dateObj = new Date(selectedDate);
      setDate2(dateObj);
    } else {
      //cancel button
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const showMode2 = (currentMode) => {
    setShow2(true);
    setMode2(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showDatepicker2 = () => {
    showMode2('date');
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



  const Itemm = ({ item, onPress, backgroundColor, textColor }) => (
    <View style={stylesList.container}>
      <TouchableOpacity onPress={onPress} style={[{ padding: 20, marginVertical: 8, marginHorizontal: 16, width: Dimensions.get('window').width * 8 / 10, borderRadius: 10, justifyContent: "center", alignItems: "center" }, backgroundColor]}>
        <Text style={[{
          fontSize: 15,
          fontFamily: 'Quicksand',
          justifyContent: "center",
          alignItems: "center",
        }, textColor]}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem2 = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#0000CD" : "rgba(0,149,218,1)";
    const color = 'white';

    return (
      <Itemm
        item={item}
        onPress={() => { getAnnounces(item.id); setSelectedId(item.id);  }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };


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


  const getPDFdata = async () => {
    var database2 = firebase.database();
    let PDFdata = {};
    //informații personale
    database2.ref('/volunteers/' + user.uid).on('value', function (snapshot) {
      PDFdata['volname'] = snapshot.val().name;
      PDFdata['cnp'] = snapshot.val().identifier;
    });

    //informații ale asociației
    database2.ref('/ngos/' + selectedId).on('value', function (snapshot) {
      PDFdata['ngoname'] = snapshot.val().name;
      PDFdata['ngoid'] = snapshot.val().identifier;
      PDFdata['legal'] = snapshot.val().legal;
    });
    //let enter_date = new Date(snapshot.val().created_at);

    //listam recompensele primite prin cod din perioada selectata
    var start = new Date(date).getTime();
    var end = new Date(date2).getTime();
    PDFdata['rewards'] = [];
    let hours = 0;
    database2.ref('/rewards/').on('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var redeems = childSnapshot.child("redeemed_by");
        var when = new Date(childSnapshot.val().created_at).getTime();
        redeems.forEach(function (grandChild) {
          var grandData = grandChild.val();
          if (grandData.user === user.uid && start <= when && when < end) {
            let object = {};
            object['title'] = childSnapshot.val().title;
            object['description'] = childSnapshot.val().description;
            hours += parseInt(childSnapshot.val().hours);
            PDFdata['rewards'].push(object);
          }
        });
      });
    });
    PDFdata['hours'] = hours;

    let htmlContent = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pdf Content</title>
      <style>
          body {
              font-size: 16px;
              color: black;
          }
          h2 {
              text-align: center;
              margin-top: 50px;
          }
          #reg {
              text-align: center;
          }
          @page { 
            margin: 20px; 
          }
          section {
            break-inside: avoid;
          }
          #text{
              margin-top: 55px;
          }
          #legal{
              margin-top: 70px;
              margin-left: 18px;
          }
      </style>
  </head>
  <body>
      <h2>Adeverință de voluntariat</h2>
      <div id="reg">Nr. înregistrare / data: ................................</div>
      <div id="text">
          <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Prin prezenta se adeverește că <u>`+ PDFdata['volname'] + `</u>, identificat(ă) prin CNP: <u>` + PDFdata['cnp'] + `</u>, a realizat în colaborare cu <u>` + PDFdata['ngoname'] + `</u>, înscris(ă) ca persoană fără scop patrimonial la poziția <u>` + PDFdata['ngoid'] + `</u>, următoarele activități de voluntariat, însumând un total de <u>`+ PDFdata['hours'] + `</u> ore de lucru: </b>
      </div>
      <ul>`;

    function myFunction(value, index, array) {
      htmlContent += '<li> titlu: ' + value.title + " | descriere: " + value.description + '.</li>';
    }

    PDFdata['rewards'].forEach(myFunction);
    //           <li>Coffee</li>
    //           <li>Tea</li>
    //           <li>Milk</li>
    //       </ul>
    htmlContent += 
          `<div id="legal"><b>
              Reprezentant legal,</b><br><u>` + PDFdata['legal'] + `</u>
          </div>
      </body>
      </html>
    `;

    createAndSavePDF(htmlContent);
    //console.log(PDFdata);
    //setLevel(level);
  }

  const createAndSavePDF = async (html) => {
    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
      // if (Platform.OS === "ios") {

      // } else {
      //   const permission = await MediaLibrary.requestPermissionsAsync();
      //   if (permission.granted) {
      //     const asset = await MediaLibrary.createAssetAsync(uri);
      //   }
      // }
    } catch (error) {
      console.error(error);
    }
  };
  if (edit === 1) {
    if (type === 1)
      return (
        <View style={styles.container}>
          <EntypoIcon name="info-with-circle" style={styles.icon3}
            onPress={() => navigation.navigate('TasksInfo', { type: type })}></EntypoIcon>
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
    else return (

      <View style={styles.container}>
        <EntypoIcon name="info-with-circle" style={styles.icon3}
          onPress={() => navigation.navigate('TasksInfo', { type: type })}></EntypoIcon>
        <Image
          source={require("../assets/images/fabrica_de_voluntari.png")}
          resizeMode="contain"
          style={styles.image1}
        ></Image>

        <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width }}>
          <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'grey', bottom: 0, marginTop: 'auto' }} />
          <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Anunțuri anterioare</Text>
        </View>

        <Text style={styles.loremIpsum1}>
          1. Selectează asociația (gol dacă nu ai niciuna).
        </Text>

        <View style={{ height: 150, width: Dimensions.get('window').width * 13.5 / 15, borderWidth: 3, borderRadius: 4, borderColor: "rgba(0,149,218,1)" }}>
          <FlatList data={ngos} renderItem={renderItem2} keyExtractor={(item) => item.id} />
        </View>

        <Text style={styles.loremIpsum1}>
          2. Vezi anunțurile (cele mai noi primele):
        </Text>

        <View style={{ marginBottom: 10, height: 150, width: Dimensions.get('window').width * 13.5 / 15, borderWidth: 3, borderRadius: 4, borderColor: "rgba(0,149,218,1)" }}>
          <FlatList
            data={announces}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width }}>
          <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'grey', bottom: 0, marginTop: 'auto' }} />
          <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Generează adeverință</Text>
        </View>

        <Text style={styles.loremIpsum1}>
          Asociația (1) și perioada trebuie setate:
        </Text>

        <View style={styles.cupertinoButtonInfoRow}>
          <TouchableOpacity
            style={[stylesDate.container, props.style]}
            onPress={showDatepicker}>
            <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Quicksand' }}>
              început</Text>
          </TouchableOpacity>
          <View style={stylesDate.space} />
          <TouchableOpacity
            style={[stylesDate.container, props.style]}
            onPress={showDatepicker2}>
            <Text style={{
              color: "#fff",
              fontSize: 17,
              fontFamily: 'Quicksand'
            }}>
              sfârșit</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[stylesDate.container, { marginTop: 20 }]}
          onPress={() => {
            if (date === date2 || selectedId === null)
              Alert.alert("Datele trebuie să fie diferite și asociația selectată!")
            else {
              getPDFdata();
              //createAndSavePDF(htmlContent); 
            }
          }}>
          <Text style={{
            color: "#fff",
            fontSize: 20,
            fontFamily: 'Quicksand'
          }}>
            Distribuie PDF</Text>
        </TouchableOpacity>

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


        {show2 && ( // showDatepicker
          <DateTimePicker
            testID="dateTimePicker2"
            value={date2}
            mode={mode2}
            is24Hour={true}
            display="default"
            onChange={onChange2}
          />
        )}

        <View style={styles.footerContainer}>
          <MaterialBasicFooter1
            style={styles.materialBasicFooter1}
          ></MaterialBasicFooter1>
        </View>
      </View>
    );
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

const stylesDate = StyleSheet.create({
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
    minWidth: 88,
    paddingLeft: 16,
    paddingRight: 16
  },
  space: {
    width: 20
  },
  deconnect: {
    color: "#fff",
    fontSize: 22,
    fontFamily: 'Quicksand'
  },
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
  cupertinoButtonInfoRow: {
    height: 30,
    flexDirection: "row",
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
    marginBottom: 5,
    marginTop: 5
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
