import React, { Component, useContext, useState, useEffect, useRef } from "react";
import { StyleSheet, View, Image, Dimensions, Text, Alert, TextInput, KeyboardAvoidingView, FlatList } from "react-native";
import MaterialBasicFooter1 from "../components/MaterialBasicFooter1";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFonts } from '@expo-google-fonts/inter';
import { AuthContext } from '../AuthProvider';
import { useNavigation } from '@react-navigation/native';
import firebase from '../database/firebaseDb';
import DateTimePicker from '@react-native-community/datetimepicker';
import EntypoIcon from "react-native-vector-icons/Entypo";
import * as ImagePicker from 'expo-image-picker';
import Constant from 'expo-constants';
import { getActiveChildNavigationOptions } from "react-navigation";

function ProfileScreen(props) {


  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const user = firebase.auth().currentUser;
  var dateVal = new Date();
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [descr, setDescr] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [legal, setLegal] = useState('');
  const [date, setDate] = useState(dateVal);
  const [image, setImage] = useState(null);
  const [initial, setInitial] = useState(false);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [childData, setChild] = useState({});
  const [ngos, setNgos] = useState([]);
  const [edit, setEdit] = useState('');
  const isMounted = useRef(null);

  const getProfileInfo = async () => {
    var database2 = firebase.database();
    let urlString = type === 0 ? "/volunteers/" : "/ngos/";
    database2.ref(urlString + user.uid.toString()).on('value', function (snapshot) {
      if(snapshot.numChildren() != 0)
        setChild(snapshot.toJSON());
      else setChild({
        name: null,
        description: null,
        location: null,
        phone: null,
        legal: null,
        identifier: null
      });
    });
  };

  const getNGOs = async () => {
    var database2 = firebase.database();
    ngosDataObject = await database2.ref('/ngos/').on('value', function (snapshot) {
      var ngosHere = [];
      snapshot.forEach(function (childSnapshot) {
        var inPending = childSnapshot.child("/pending/" + user.uid.toString()).numChildren();
        var accepted = childSnapshot.child("/accepted/" + user.uid.toString()).numChildren();
        var refused = childSnapshot.child("/refused/" + user.uid.toString()).numChildren();
        if (inPending === 0 && accepted === 0 && refused === 0) {
          let object = {};
          object['name'] = childSnapshot.toJSON().name;
          object['id'] = childSnapshot.key;
          object['description'] = childSnapshot.toJSON().description;
          ngosHere.push(object);
        }
      });
      setNgos(ngosHere)
    });
  }

  (async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  })();

  useEffect(() => {
    isMounted.current = true;

    getProfileInfo();
    getNGOs();
    firebase.storage()
      .ref('/images/' + user.uid) //name in storage in firebase console
      .getDownloadURL()
      .then((url) => {
        setImage(url);
        setInitial(null);
      })
      .catch((e) => { }); //ignore the error

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

  var database = firebase.database();

  if (type === '') {
    database.ref("/accounts/" + user.uid).on('value', function (snapshot) {
      var childData = snapshot.val();
      setType(childData.type);
      setEdit(childData.edited);
    });
  }

  const PickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1
    })

    if (!result.cancelled) {
      setImage(result.uri);
      setInitial(null);
    }
  }

  const uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase.storage().ref().child("images/" + imageName);
    return ref.put(blob);
  }

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <View style={stylesList.container}>
      <TouchableOpacity onPress={onPress} style={[stylesList.item, backgroundColor]}>
        <Text style={[stylesList.title, textColor]}>{item.name}:</Text>
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
        onPress={() => {
          if (edit === 1) {
          let object = [];
          let thisObject = {
            name: item.name,
            id: item.id,
            description: item.description
          }
          ngos.forEach(element => {
            if (element.name != thisObject.name)
              object.push(element);
          });
          setNgos(object);
          var database = firebase.database();
          database.ref('/ngos/' + item.id + '/pending/' + user.uid).set({
            user: user.uid,
            name: childData.name
          });
          Alert.alert('Ai aplicat pentru ' + item.name + '.');
        }
        else Alert.alert('Completează-ți datele întâi.');
        }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  if (type === 1)
    return (
      <View style={styles.container}>
        <EntypoIcon name="info-with-circle" style={styles.icon4}></EntypoIcon>
        <KeyboardAvoidingView style={{ margin: 15 }} behavior="padding">
          <View style={{ alignItems: 'center', marginBottom: "8%" }}>
            <View style={{ height: 100, width: 100, borderRadius: 15, marginTop: "2%", justifyContent: 'center', alignItems: 'center' }}>
              {initial != false ? null : <Image source={require("../assets/images/avatar.png")} resizeMode="contain" style={styles.image1} />}
              {image === null ? null : <Image source={{ uri: image }} resizeMode="contain" style={styles.image1} />}
              <TouchableOpacity
                style={{ backgroundColor: "rgba(0,149,218,1)", width: 100, height: 20, justifyContent: "center", alignItems: "center", borderRadius: 5, shadowColor: "#000", marginTop: "3%", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.35, shadowRadius: 5, elevation: 2, }}
                onPress={PickImage}>
                <Text style={{
                  color: "#fff",
                  fontSize: 9.5,
                  fontFamily: 'Quicksand'
                }}>
                  UPLOAD img.</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width }}>
          <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'rgb(220,220,220)', bottom: 0, marginTop: 'auto' }} />
          <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Profil asociație</Text>
        </View>
          <View style={styles.titleStack}>
            <EntypoIcon name="users" style={styles.icon3}></EntypoIcon>
            <Text style={styles.title}>:</Text>
            <View style={[stylesss.container]}>
              <TextInput
                value={name}
                placeholder={childData.name === null ? "nume complet asociație, obligatoriu" : childData.name}
                style={stylesss.inputStyle}
                onChangeText={(text) => setName(text)}
              ></TextInput>
            </View>
          </View>
          <View style={styles.titleStack}>
            <EntypoIcon name="info" style={styles.icon3}></EntypoIcon>
            <Text style={styles.title}>:</Text>
            <View style={[stylesss.container]}>
              <TextInput
                placeholder={childData.description === null ? "scurtă descriere obligatorie" : childData.description}
                style={stylesss.inputStyle}
                multiline={true}
                onChangeText={(text) => setDescr(text)}
                value={descr}
              ></TextInput>
            </View>
          </View>
          <View style={styles.titleStack}>
            <EntypoIcon name="location" style={styles.icon3}></EntypoIcon>
            <Text style={styles.title}>:</Text>
            <View style={[stylesss.container]}>
              <TextInput
                placeholder={childData.location === null ? "oraș de origine, obligatoriu" : childData.location}
                style={stylesss.inputStyle}
                onChangeText={(text) => setLocation(text)}
                value={location}
              ></TextInput>
            </View>
          </View>
          <View style={styles.titleStack}>
            <EntypoIcon name="phone" style={styles.icon3}></EntypoIcon>
            <Text style={styles.title}>:</Text>
            <View style={[stylesss.container]}>
              <TextInput
                placeholder={childData.phone === null ? "dată de contact obligatorie" : childData.phone}
                keyboardType='phone-pad'
                style={stylesss.inputStyle}
                onChangeText={(text) => setPhone(text)}
                value={phone}
              ></TextInput>
            </View>
          </View>
          <View style={styles.titleStack}>
            <EntypoIcon name="book" style={styles.icon3}></EntypoIcon>
            <Text style={styles.title}>:</Text>
            <View style={[stylesss.container]}>
              <TextInput
                placeholder={childData.identifier === null ? "nr. de înreg. în registrul asociațiilor" : childData.identifier}
                style={stylesss.inputStyle}
                onChangeText={(text) => setIdentifier(text)}
                value={identifier}
              ></TextInput>
            </View>
          </View>
          <KeyboardAvoidingView style={styles.titleStack} behavior="padding">
            <EntypoIcon name="briefcase" style={styles.icon3}></EntypoIcon>
            <Text style={styles.title}>:</Text>
            <View style={[stylesss.container]}>
              <TextInput
                placeholder={childData.legal === null ? "nume complet reprezentant legal" : childData.legal}
                style={stylesss.inputStyle}
                onChangeText={(text) => setLegal(text)}
                value={legal}
              ></TextInput>
            </View>
          </KeyboardAvoidingView>
          <View style={styles.titleStack}>
            <EntypoIcon name="publish" style={styles.icon3}></EntypoIcon>
            <Text style={styles.title}>:</Text>
            <View style={[stylesss.container]}>
              <TouchableOpacity
                style={[dateS.container, props.style]}
                onPress={showDatepicker}>
                <Text style={dateS.deconnect}>
                  data înființării</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
          style={{
            backgroundColor: "rgba(0,149,218,1)", justifyContent: "center", alignItems: "center", borderRadius: 5, shadowColor: "#000", marginTop: "5%", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.35, shadowRadius: 5, elevation: 2,
            paddingLeft: 28,
            paddingRight: 28,
            paddingBottom: 5,
            paddingTop: 5
          }}
          onPress={() => {
            let actualDate = new Date();
            let dateToCheck = new Date(date);
            var isSameDay = (dateToCheck.getDate() === actualDate.getDate()
              && dateToCheck.getMonth() === actualDate.getMonth()
              && dateToCheck.getFullYear() === actualDate.getFullYear());
            if (name === '' || descr === '' || location === '' || phone === '' || identifier === '' || legal === '' || image === null || isSameDay === true)
              Alert.alert("Toate câmpurile sunt obligatorii. Vezi (i) pentru instrucțiuni.");
            else {
              var database = firebase.database();
              database.ref('/accounts/' + user.uid).update({
                edited: 1
              });
              database.ref('/ngos/' + user.uid).set({
                name: name,
                description: descr,
                location: location,
                phone: phone,
                identifier: identifier,
                legal: legal,
                created_at: firebase.database.ServerValue.TIMESTAMP,
                founding_date: firebase.firestore.Timestamp.fromDate(date).toDate().toString(),
              });
              uploadImage(image, user.uid).then(() => {
                Alert.alert("Profil personal complet!");
              }).catch((error) => {
                Alert.alert(error);
              });

            }
          }}>
          <Text style={styless.deconnect}>
            Salvează datele</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(0,149,218,1)",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            borderRadius: 5,
            shadowColor: "#000",
            marginTop: 70,
            shadowOffset: {
              width: 0,
              height: 1
            },
            shadowOpacity: 0.35,
            shadowRadius: 5,
            elevation: 2,
            paddingLeft: 16,
            paddingRight: 16,
            paddingBottom: 5,
            paddingTop: 5
          }}
          onPress={() => {
            logout();
          }}>
          <Text style={styless.deconnect}>
            Deconectează-mă</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <MaterialBasicFooter1
            style={styles.materialBasicFooter1}
          ></MaterialBasicFooter1>
        </View>
      </View>
    );

  else return (
    <View style={styles.container}>
      <EntypoIcon name="info-with-circle" style={styles.icon4}></EntypoIcon>
      <KeyboardAvoidingView style={{ margin: 10 }} behavior="padding">
        <View style={{ alignItems: 'center', marginBottom: "10%" }}>
          <View style={{ height: 100, width: 100, borderRadius: 15, marginTop: "5%", justifyContent: 'center', alignItems: 'center' }}>
            {initial != false ? null : <Image source={require("../assets/images/avatar.png")} resizeMode="contain" style={styles.image1} />}
            {image === null ? null : <Image source={{ uri: image }} resizeMode="contain" style={styles.image1} />}
            <TouchableOpacity
              style={{ backgroundColor: "rgba(0,149,218,1)", width: 100, height: 20, justifyContent: "center", alignItems: "center", borderRadius: 5, shadowColor: "#000", marginTop: "3%", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.35, shadowRadius: 5, elevation: 2, }}
              onPress={PickImage}>
              <Text style={{
                color: "#fff",
                fontSize: 9.5,
                fontFamily: 'Quicksand'
              }}>
                UPLOAD img.</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width }}>
          <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'rgb(220,220,220)', bottom: 0, marginTop: 'auto' }} />
          <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Profil personal</Text>
        </View>
        <View style={styles.titleStack}>
          <EntypoIcon name="users" style={styles.icon3}></EntypoIcon>
          <Text style={styles.title}>:</Text>
          <View style={[stylesss.container]}>
            <TextInput
              placeholder={childData.name === null ? "nume și prenume, obligatorii" : childData.name}
              style={stylesss.inputStyle}
              onChangeText={(text) => setName(text)}
              value={name}
            ></TextInput>
          </View>
        </View>
        <View style={styles.titleStack}>
          <EntypoIcon name="info" style={styles.icon3}></EntypoIcon>
          <Text style={styles.title}>:</Text>
          <View style={[stylesss.container]}>
            <TextInput
              placeholder={childData.description === null ? "citat favorit, obligatoriu" : childData.description}
              style={stylesss.inputStyle}
              multiline={true}
              onChangeText={(text) => setDescr(text)}
              value={descr}
            ></TextInput>
          </View>
        </View>
        <View style={styles.titleStack}>
          <EntypoIcon name="location" style={styles.icon3}></EntypoIcon>
          <Text style={styles.title}>:</Text>
          <View style={[stylesss.container]}>
            <TextInput
              placeholder={childData.location === null ? "oraș de origine, obligatoru" : childData.location}
              style={stylesss.inputStyle}
              onChangeText={(text) => setLocation(text)}
              value={location}
            ></TextInput>
          </View>
        </View>
        <View style={styles.titleStack}>
          <EntypoIcon name="phone" style={styles.icon3}></EntypoIcon>
          <Text style={styles.title}>:</Text>
          <View style={[stylesss.container]}>
            <TextInput
              placeholder={childData.phone === null ? "dată de contact obligatorie" : childData.phone}
              keyboardType='phone-pad'
              style={stylesss.inputStyle}
              onChangeText={(text) => setPhone(text)}
              value={phone}
            ></TextInput>
          </View>
        </View>
        <View style={styles.titleStack}>
          <EntypoIcon name="book" style={styles.icon3}></EntypoIcon>
          <Text style={styles.title}>:</Text>
          <View style={[stylesss.container]}>
            <TextInput
              placeholder={childData.identifier === null ? "CNP - obligatoriu" : childData.identifier}
              style={stylesss.inputStyle}
              keyboardType='phone-pad'
              onChangeText={(text) => setIdentifier(text)}
              value={identifier}
            ></TextInput>
          </View>
        </View>
        <View style={styles.titleStack}>
          <EntypoIcon name="publish" style={styles.icon3}></EntypoIcon>
          <Text style={styles.title}>:</Text>
          <View style={[stylesss.container]}>
            <TouchableOpacity
              style={[dateS.container, props.style]}
              onPress={showDatepicker}>
              <Text style={dateS.deconnect}>
                data nașterii</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
      <View style={{
        marginBottom: 15,
        flexDirection: "row",
        marginTop: "2%"
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(0,149,218,1)", justifyContent: "center", alignItems: "center", borderRadius: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.35, shadowRadius: 5, elevation: 2,
            paddingLeft: 12,
            paddingRight: 12,
            paddingBottom: 5,
            paddingTop: 5,
            marginLeft: 15
          }}
          onPress={() => {
            let actualDate = new Date();
            let dateToCheck = new Date(date);
            var isSameDay = (dateToCheck.getDate() === actualDate.getDate()
              && dateToCheck.getMonth() === actualDate.getMonth()
              && dateToCheck.getFullYear() === actualDate.getFullYear());
            if (name === '' || descr === '' || location === '' || phone === '' || identifier === '' || image === null || isSameDay === true)
              Alert.alert("Toate câmpurile sunt obligatorii. Vezi (i) pentru instrucțiuni.");
            else {
              var database = firebase.database();
              database.ref('/accounts/' + user.uid).update({
                edited: 1
              });
              database.ref('/volunteers/' + user.uid).set({
                name: name,
                description: descr,
                location: location,
                phone: phone,
                identifier: identifier,
                created_at: firebase.database.ServerValue.TIMESTAMP,
                founding_date: firebase.firestore.Timestamp.fromDate(date).toDate().toString()
              });
              uploadImage(image, user.uid).then(() => {
                Alert.alert("Profil personal complet!");
              }).catch((error) => {
                Alert.alert(error);
              });

            }
          }}>
          <Text style={styless.deconnect}>
            Salvează date</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styless.container, props.style]}
          onPress={() => {
            logout();
          }}>
          <Text style={styless.deconnect}>
            Deconectare</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width }}>
        <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'rgb(220,220,220)', bottom: 0, marginTop: 'auto' }} />
        <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Asociații disponibile</Text>
      </View>

      <Text style={styles.loremIpsum1}>
        Apasă și așteaptă confirmare de la ei.
      </Text>

      <FlatList
        data={ngos}
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
    minWidth: 260,
    paddingLeft: 16,
    paddingRight: 16
  },
  deconnect: {
    color: "#fff",
    fontSize: 15,
    fontFamily: 'Quicksand'
  }
});


const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 'auto',
    bottom: 0
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  titleStack: {
    marginTop: "2.5%",
    flexDirection: "row",
    marginLeft: 45
  },
  titleStackk: {
    marginTop: "10%",
    flexDirection: "row",
  },
  title: {
    fontFamily: "Quicksand",
    color: "rgba(0,149,218,1)",
    fontSize: 16,
    marginLeft: 2,
    marginRight: 20
  },
  icon3: {
    color: "rgba(0,149,218,1)",
    fontSize: 25,
    marginLeft: 10
  },
  icon4: {
    flex: 0,
    position: "absolute",
    color: "rgba(0,149,218,1)",
    fontSize: 25,
    marginRight: "10%",
    marginTop: 50,
    alignSelf: 'flex-end',
  },
  image1: {
    width: 100,
    height: 100,
    marginTop: 48,
    alignSelf: "center",
    borderRadius: 40
  },
  materialBasicFooter1: {
    height: 56,
    width: Dimensions.get('window').width,
  },
  acorda: {
    marginTop: "5%",
    fontFamily: "Quicksand",
    color: "#121212",
    width: "100%",
    textAlign: "center",
    fontSize: 22,
  },
  loremIpsum1: {
    fontFamily: "Quicksand",
    color: "rgba(96,93,93,1)",
    textAlign: "center",
    fontSize: 13,
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
    marginLeft: 20,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 2,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 5,
    paddingTop: 5
  },
  deconnect: {
    color: "#fff",
    fontSize: 18,
    fontFamily: 'Quicksand'
  }
});

const stylesss = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#D9D5DC",
    backgroundColor: "transparent",
  },
  inputStyle: {
    color: "#000",
    fontSize: 14,
    lineHeight: 14,
    width: 260
  }
});
export default ProfileScreen;
