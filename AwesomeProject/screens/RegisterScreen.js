import React, { Component } from "react";
import { StyleSheet, View, Text, Image, Dimensions, Platform, PixelRatio } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialRightIconTextbox from "../components/MaterialRightIconTextbox";
import MaterialUnderlineTextbox from "../components/MaterialUnderlineTextbox";
import MaterialButtonPrimary3 from "../components/MaterialButtonPrimary3";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function actuatedNormalize(size) {
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}


function LoginScreen({ route, navigation }) {
  const navigationn = useNavigation();
  const { type, typeS } = route.params;

  var str1 = "Înregistrare #";
  var res = str1.concat(typeS);

  return (
    <View style={styles.container}>
      <EntypoIcon name="back" style={styles.icon3}
        onPress={() => navigationn.goBack()}></EntypoIcon>
        <Image
          source={require("../assets/images/fabrica_de_voluntari.png")}
          resizeMode="contain"
          style={styles.image1}
        ></Image>
      <Text style={styles.autentificare}>{res}</Text>
      <Text style={styles.loremIpsum1}>
        Super, ce bine că te alături nouă!
      </Text>
      <View style={styles.emailStack}>
        <Text style={styles.email}>Email</Text>
        <MaterialUnderlineTextbox
          inputStyle="Placeholder"
          inputStyle="unul pe care îl verifici des"
          style={styles.materialUnderlineTextbox}
        ></MaterialUnderlineTextbox>
      </View>
      <View style={styles.materialRightIconTextboxStack}>
        <MaterialRightIconTextbox
          style={styles.materialRightIconTextbox}
        ></MaterialRightIconTextbox>
        <Text style={styles.parola}>Parolă</Text>
      </View>
      <MaterialButtonPrimary3
        style={styles.materialButtonPrimary1}
      ></MaterialButtonPrimary3>
      <Text style={styles.text}>sau folosește alte conturi sociale</Text>
      <View style={styles.groupRow}>
        <View style={styles.group}>
          <EntypoIcon name="facebook" style={styles.icon}></EntypoIcon>
        </View>
        <FontAwesomeIcon
          name="google-plus-official"
          style={styles.icon2}
        ></FontAwesomeIcon>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  autentificare: {
    fontFamily: "quicksand",
    color: "#121212",
    width: "100%",
    textAlign: "center",
    fontSize: actuatedNormalize(20),
  },
  icon3: {
    color: "rgba(0,0,0,1)",
    fontSize: 25,
    marginRight: "70%",
    marginTop: actuatedNormalize(40),
  },
  image1: {
    width: actuatedNormalize(90),
    height: actuatedNormalize(90)
  },
  loremIpsum1: {
    fontFamily: "quicksand",
    color: "rgba(96,93,93,1)",
    textAlign: "center",
    fontSize: actuatedNormalize(11)
  },
  materialRightIconTextbox: {
    height: 63,
    width: 316,
    position: "absolute",
    left: 0,
    top: 10
  },
  parola: {
    top: 0,
    left: 0,
    position: "absolute",
    fontFamily: "quicksand",
    color: "rgba(0,149,218,1)",
    width: 74,
    fontSize: 18
  },
  materialRightIconTextboxStack: {
    width: 316,
    height: 73,
    marginTop: "5%"
  },
  email: {
    top: 0,
    left: 0,
    position: "absolute",
    fontFamily: "quicksand",
    color: "rgba(0,149,218,1)",
    width: 74,
    fontSize: 18
  },
  materialUnderlineTextbox: {
    height: 57,
    width: 316,
    position: "absolute",
    left: 0,
    top: 13
  },
  emailStack: {
    width: 316,
    height: 70,
    marginTop: "5%"
  },
  materialButtonPrimary1: {
    height: actuatedNormalize(35),
    width: 178,
    borderRadius: 15,
    marginTop: "10%"
  },
  text: {
    fontFamily: "quicksand",
    color: "rgba(96,93,93,1)",
    textAlign: "center",
    fontSize: 14,
    marginTop: 20
  },
  group: {
    width: 41,
    height: 46,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    alignSelf: "flex-end"
  },
  icon: {
    color: "rgba(47,44,169,1)",
    fontSize: 40
  },
  icon2: {
    color: "rgba(202,38,38,1)",
    fontSize: 42,
    marginLeft: 33,
    marginTop: 1
  },
  groupRow: {
    height: 46,
    flexDirection: "row",
    marginTop: 15,
    marginLeft: 129,
    marginRight: 133
  },
  aiUitatParola: {
    fontFamily: "quicksand",
    color: "rgba(255,0,0,1)",
    textAlign: "center",
    fontSize: 14
  },
  inregistrare: {
    fontFamily: "quicksand",
    color: "rgba(255,0,0,1)",
    textAlign: "center",
    fontSize: 14,
    marginLeft: 135
  },
  aiUitatParolaRow: {
    flexDirection: "row",
    marginTop: 15,
    marginLeft: 29,
    marginRight: 29
  }
});

export default LoginScreen;
