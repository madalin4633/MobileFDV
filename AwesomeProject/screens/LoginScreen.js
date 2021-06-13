import React, { Component, useState, useContext } from "react";
import { StyleSheet, View, Text, Image, Dimensions, Platform, PixelRatio, TextInput } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialRightIconTextbox from "../components/MaterialRightIconTextbox";
import MaterialUnderlineTextbox from "../components/MaterialUnderlineTextbox";
import MaterialButtonPrimary2 from "../components/MaterialButtonPrimary2";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from '../AuthProvider';


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

  var str1 = "Autentificare #";
  var res = str1.concat(typeS);

  const [showPassword, setShowPassword] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginG, loginF } = useContext(AuthContext);

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
        Hey, ne bucurăm să te vedem înapoi.
      </Text>
      <View style={styles.emailStack}>
        <Text style={styles.email}>Email</Text>
        <View style={[styless.container]}>
          <TextInput
            placeholder={"unul pe care îl verifici des" || "Placeholder"}
            style={styless.inputStyle}
            keyboardType='email-address'
            onChangeText={(text) => setEmail(text)}
            value={email}
          ></TextInput>
        </View>
      </View>
      <View style={styles.materialRightIconTextboxStack}>
        <View style={[stylesss.container]}>
          <TextInput
            placeholder="folosește una sigură"
            secureTextEntry={showPassword}
            onChangeText={(text) => setPassword(text)}
            value={password}
            style={stylesss.inputStyle}
          ></TextInput>
          <Icon name="eye" style={stylesss.iconStyle}
            onPress={() => setShowPassword(!showPassword)}></Icon>
        </View>
        <Text style={styles.parola}>Parolă</Text>
      </View>
      <MaterialButtonPrimary2
        style={styles.materialButtonPrimary1}
        email={email}
        password={password}
        accType={type}
      ></MaterialButtonPrimary2>
      <View>
        <Text style={styles.text}>sau folosește alte conturi sociale</Text>
        <View style={styles.groupRow}>
          <View style={styles.group}>
            <EntypoIcon name="facebook"
              style={styles.icon}
              onPress={() => loginF(type)}></EntypoIcon>
          </View>
          <FontAwesomeIcon
            name="google-plus-official"
            style={styles.icon2}
            onPress={() => loginG(type)}
          ></FontAwesomeIcon>
        </View>
      </View>
      <View style={styles.aiUitatParolaRow}>
        <Text style={styles.aiUitatParola}
          onPress={() => navigationn.navigate('PassScreen', { type: type, typeS: typeS })}>Ai uitat parola?</Text>
        <Text style={styles.inregistrare}
          onPress={() => navigationn.navigate('RegisterScreen', { type: type, typeS: typeS })}>Înregistrare</Text>
      </View>
    </View>
  );
}


const stylesss = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#D9D5DC",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    marginTop: actuatedNormalize(12)
  },
  inputStyle: {
    color: "#000",
    paddingRight: 16,
    fontSize: 16,
    alignSelf: "stretch",
    flex: 1,
    lineHeight: 16,
    paddingTop: 14,
    paddingBottom: 8
  },
  iconStyle: {
    color: "#616161",
    fontSize: 24,
    paddingRight: 8
  }
});

const styless = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#D9D5DC",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    marginTop: actuatedNormalize(12)
  },
  inputStyle: {
    color: "#000",
    paddingRight: 5,
    fontSize: 16,
    alignSelf: "stretch",
    flex: 1,
    lineHeight: 16,
    paddingTop: 16,
    paddingBottom: 8
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  autentificare: {
    fontFamily: "Quicksand",
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
    fontFamily: "Quicksand",
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
    fontFamily: "Quicksand",
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
    fontFamily: "Quicksand",
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
    marginTop: "5%"
  },
  text: {
    fontFamily: "Quicksand",
    color: "rgba(96,93,93,1)",
    textAlign: "center",
    fontSize: 14,
    marginTop: 10
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
    fontFamily: "Quicksand",
    color: "rgba(255,0,0,1)",
    textAlign: "center",
    fontSize: 14
  },
  inregistrare: {
    fontFamily: "Quicksand",
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
