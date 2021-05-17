import React, { Component, useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

let showPassword = true;

function MaterialRightIconTextbox(props) {

  
  const [showPassword, setShowPassword] = useState(showPassword);

  return (
    <View style={[styles.container, props.style]}>
      <TextInput
        placeholder="folosește una sigură"
        secureTextEntry={showPassword}
        style={styles.inputStyle}
      ></TextInput>
      <Icon name="eye" style={styles.iconStyle}
      onPress={() => setShowPassword(!showPassword)}></Icon>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#D9D5DC",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center"
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

export default MaterialRightIconTextbox;
