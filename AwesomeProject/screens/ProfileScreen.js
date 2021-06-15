import React, { Component, useContext, useState, useEffect } from "react";
import { StyleSheet, View, Image, Dimensions, Text, Alert, TextInput, KeyboardAvoidingView } from "react-native";
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

function ProfileScreen(props) {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

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

  const [imageUrl, setImageUrl] = useState(undefined);
  var childData = {
    name: null,
    description: null,
    identifier: null,
    location: null,
    phone: null
  };
  // let once = 1;
  // //daca ma decid sa fac ecranul de edit la ce exista deja
  // if(once === 1){
  // var database2 = firebase.database();
  // let urlString = type === 0 ? "/volunteers/" : "/ngos/";
  // database2.ref(urlString + user.uid.toString()).on('value', function (snapshot) {
  //     childData = snapshot.val();
  //     once = 0;
  // });}

  useEffect(() => {
    firebase.storage()
      .ref('/images/' + user.uid) //name in storage in firebase console
      .getDownloadURL()
      .then((url) => {
        setImage(url);
        setInitial(null);
      })
      .catch((e) => console.log('Errors while downloading => ', e));
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
  
  
  console.log(childData);
  if (type === 1)
    return (
      <View style={styles.container}>
        <EntypoIcon name="info-with-circle" style={styles.icon4}></EntypoIcon>
        <KeyboardAvoidingView style={{ margin: 15 }} behavior="padding">
          <View style={{ alignItems: 'center', marginBottom: "13%" }}>
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

          <View style={styles.titleStack}>
            <EntypoIcon name="users" style={styles.icon3}></EntypoIcon>
            <Text style={styles.title}>:</Text>
            <View style={[stylesss.container]}>
              <TextInput
                value={name}
                placeholder={"nume complet asociație, obligatoriu"}
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
                placeholder={"scurtă descriere obligatorie"}
                style={stylesss.inputStyle}
                multiline= {true}
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
                placeholder={"oraș de origine, obligatoriu"}
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
                placeholder={"dată de contact obligatorie"}
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
                placeholder={"nr. de înreg. în registrul asociațiilor"}
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
                placeholder={"nume complet reprezentant legal"}
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
            backgroundColor: "green", justifyContent: "center", alignItems: "center", borderRadius: 5, shadowColor: "#000", marginTop: "5%", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.35, shadowRadius: 5, elevation: 2,
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
          style={[styless.container, props.style]}
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
      <KeyboardAvoidingView style={{ margin: 15 }} behavior="padding">
        <View style={{ alignItems: 'center', marginBottom: "13%" }}>
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
              multiline= {true}
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
      <TouchableOpacity
        style={{
          backgroundColor: "green", justifyContent: "center", alignItems: "center", borderRadius: 5, shadowColor: "#000", marginTop: "5%", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.35, shadowRadius: 5, elevation: 2,
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
          Salvează datele</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styless.container, props.style]}
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
}

const pradip = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
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
    marginTop: "3.5%",
    flexDirection: "row",
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
    marginBottom: 10
  }
});

const styless = StyleSheet.create({
  container: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    shadowColor: "#000",
    marginTop: "15%",
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
    fontSize: 22,
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
