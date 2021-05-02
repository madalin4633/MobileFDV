import React, { Component } from "react";
import { StyleSheet, View, Image, Text, Dimensions, Platform, PixelRatio } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CupertinoButtonInfo from "../components/CupertinoButtonInfo";
import CupertinoButtonInfo1 from "../components/CupertinoButtonInfo1";

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

function WelcomeScreen(props) {

  var text = '{ "quotes" : [' +
'{ "text": "Voluntarii nu sunt plătiți,\\n nu pentru că nu au nicio valoare,\\n ci pentru că sunt de neprețuit. \\n (Sherry Anderson)" },' +
'{ "text": "Voluntarii nu au neapărat mult timp liber; ei au doar inimă. \\n (Elizabeth Andrew)" },' +
'{ "text": "Dacă vrei - poți,\\n dacă poți - știi,\\n dacă știi, nu se poate să nu vrei!\\n Totul ține de voință!\\n (Adrian Căliman)" },' +
'{ "text": "Nu contează ce face\\n comunitatea pentru tine.\\n Întreabă-te ce faci tu\\n pentru comunitate.\\n(Adrian Căliman)" },' +
'{ "text": "Obligă-te să faci mai multe azi, decât ieri. Asumă-ți, promite și n-o să poți amâna la nesfârșit să faci ceva.\\n (Mădălin Florea)" } ]}';

var obj = JSON.parse(text);
var index = Math.floor(Math.random() * 5);
var chosenQuote = obj.quotes[index].text




  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/fabrica_de_voluntari.png")}
        resizeMode="contain"
        style={styles.image}
      ></Image>

      <Text style={styles.loremIpsum}>
        {chosenQuote}
      </Text>

      <Text style={styles.ceEști}>Ce ești?</Text>
      
      <View style={styles.cupertinoButtonInfoRow}>
        <CupertinoButtonInfo
          style={styles.cupertinoButtonInfo}
        ></CupertinoButtonInfo>
        <CupertinoButtonInfo1
          style={styles.cupertinoButtonInfo1}
        ></CupertinoButtonInfo1>
      </View>

      <Icon name="md-people" style={styles.icon}></Icon>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  image: {
    width: actuatedNormalize(90),
    height: actuatedNormalize(90),
    marginTop: "15%",
  },
  loremIpsum: {
    fontFamily: "quicksand",
    color: "#121212",
    textAlign: "center",
    fontSize: actuatedNormalize(16),
    width: "100%",
    marginTop: "10%"
  },
  ceEști: {
    fontFamily: "quicksand",
    color: "#121212",
    textAlign: "center",
    fontSize: actuatedNormalize(28),
    width: "100%",
    marginTop: actuatedNormalize(40)
  },
  cupertinoButtonInfo: {
    width: 150,
    borderRadius: 15
  },
  cupertinoButtonInfo1: {
    width: 150,
    borderRadius: 15,
    marginLeft: 30
  },
  cupertinoButtonInfoRow: {
    height: 49,
    flexDirection: "row",
    marginTop: "5%",
    marginLeft: 40,
    marginRight: 40
  },
  icon: {
    color: "rgba(0,149,218,1)",
    fontSize: 147,
    marginTop: "7%"
  }
});

export default WelcomeScreen;
