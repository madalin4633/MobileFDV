import React, { Component } from "react";
import { StyleSheet, View, Image } from "react-native";
import MaterialBasicFooter1 from "../components/MaterialBasicFooter1";

function HomeScreen(props) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/fabrica_de_voluntari.png")}
        resizeMode="contain"
        style={styles.image1}
      ></Image>
      <MaterialBasicFooter1
        style={styles.materialBasicFooter1}
      ></MaterialBasicFooter1>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image1: {
    width: 90,
    height: 116,
    marginTop: 48,
    alignSelf: "center"
  },
  materialBasicFooter1: {
    height: 56,
    width: 375,
    marginTop: 592
  }
});

export default HomeScreen;
