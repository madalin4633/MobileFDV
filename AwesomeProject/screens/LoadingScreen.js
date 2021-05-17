import React, { Component } from "react";
import { StyleSheet, View, Image, ActivityIndicator } from "react-native";

function LoadingScreen(props) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/fabrica_de_voluntari.png")}
        resizeMode="contain"
        style={styles.image1}
      ></Image>
      <ActivityIndicator
        size="large"
        color="#000000"
        style={styles.activityIndicator}
      ></ActivityIndicator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0095da",
    alignItems: "center",
  },
  image1: {
    height: 194,
    marginTop: 107
  },
  activityIndicator: {
    marginTop: 85,
    alignSelf: "center"
  }
});

export default LoadingScreen;
