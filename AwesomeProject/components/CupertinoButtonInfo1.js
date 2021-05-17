import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';

function CupertinoButtonInfo1(props) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={[styles.container, props.style]}
    onPress={() => navigation.navigate('LoginScreen', { type: 1, typeS: "asociație"})}>
      <Text style={styles.asociație}>ASOCIAȚIE</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,149,218,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  asociație: {
    color: "#fff",
    fontSize: 17,
    fontFamily: 'Quicksand'
  }
});

export default CupertinoButtonInfo1;
