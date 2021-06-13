import React, { Component, useContext, useState } from "react";
import { ImageBackground, StyleSheet, View, Image, Dimensions, TouchableOpacity, Text, Alert, TextInput, ProgressBarAndroidComponent } from "react-native";
import MaterialBasicFooter1 from "../components/MaterialBasicFooter1";
import { useFonts } from '@expo-google-fonts/inter';
import { AuthContext } from '../AuthProvider';
import { useNavigation } from '@react-navigation/native';
import firebase from '../database/firebaseDb';
import DateTimePicker from '@react-native-community/datetimepicker';
import EntypoIcon from "react-native-vector-icons/Entypo";
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';

function ProfileScreen(props) {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);
  var dateVal = new Date();
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [descr, setDescr] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [date, setDate] = useState(dateVal);

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    if (event.type == "set") {          //ok button
      setDate(selectedDate);
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

  let bs = React.createRef();
  let fall = new Animated.Value(1);
  
  const renderInner = () => {
    <Text>Hello</Text>
  };

  const renderHeader = () => {
    <View style = {pradip.header}>
        <View style = {pradip.panelHeader}>
          <View style = {pradip.panelHandle}></View>
        </View>
    </View>
};

  if (type === '') {
    var database = firebase.database();
    database.ref("/accounts/" + user.uid).on('value', function (snapshot) {
      var childData = snapshot.val();
      setType(childData.type);
    });
  }

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bs}
        snapPoints={[330, 0]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />

      <EntypoIcon name="info-with-circle" style={styles.icon4}></EntypoIcon>
      <View style={{ margin: 20 }}>
        <View style={{ alignItems: 'center', marginBottom: "10%" }}>
          <TouchableOpacity OnPress={() => bs.current.snapTo(0)}>
            <View style={{ height: 100, width: 100, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={require("../assets/images/avatar.png")}
                resizeMode="contain"
                style={styles.image1}
              ></Image>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.titleStack}>
          <EntypoIcon name="users" style={styles.icon3}></EntypoIcon>
          <Text style={styles.title}>:</Text>
          <View style={[stylesss.container]}>
            <TextInput
              placeholder={"nume complet asociație, obligatoriu"}
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
              placeholder={"scurtă descriere obligatorie"}
              style={stylesss.inputStyle}
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
              onChangeText={(text) => setDescr(text)}
              value={descr}
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
        <View style={styles.titleStack}>
          <EntypoIcon name="briefcase" style={styles.icon3}></EntypoIcon>
          <Text style={styles.title}>:</Text>
          <View style={[stylesss.container]}>
            <TextInput
              placeholder={"nume complet reprezentant legal"}
              style={stylesss.inputStyle}
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
                data înființării</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {show && (
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
      <MaterialBasicFooter1
        style={styles.materialBasicFooter1}
      ></MaterialBasicFooter1>
    </View>
  );
}

const pradip = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
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
  container: {
    flex: 1,
    alignItems: "center"
  },
  titleStack: {
    marginTop: "5%",
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
    position: "absolute",
    bottom: 0
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
    marginTop: "20%",
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
