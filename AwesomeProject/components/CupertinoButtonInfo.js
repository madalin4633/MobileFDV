import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';

function CupertinoButtonInfo(props) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={[styles.container, props.style]}
      onPress={() => navigation.navigate('LoginScreen', { type: 0, typeS: "voluntar"})}>
        <Text style={styles.voluntar}>VOLUNTAR</Text>
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
  voluntar: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "quicksand"
  }
});

export default CupertinoButtonInfo;
