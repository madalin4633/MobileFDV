import React, { Component, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';
import { useFonts } from '@expo-google-fonts/inter';
import firebase from '../database/firebaseDb';

function MaterialBasicFooter1(props) {

  const navigationn = useNavigation();

  let [fontsLoaded] = useFonts({
    Quicksand: require('../assets/fonts/quicksand-700.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={[styles.container, props.style]}>
      <TouchableOpacity style={styles.btnWrapper1}
        onPress={() => navigationn.navigate('HomeScreen')}>
        <MaterialCommunityIconsIcon
          name="home"
          style={styles.icon1}
        ></MaterialCommunityIconsIcon>
        <Text style={styles.home}>home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnWrapper2}
       onPress={() => navigationn.navigate('TasksScreen')}>
        <MaterialCommunityIconsIcon
          name="bank-transfer"
          style={styles.icon2}
        ></MaterialCommunityIconsIcon>
        <Text style={styles.tasks}>tasks</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnWrapper3}
        onPress={() => navigationn.navigate('RewardScreen')}>
        <MaterialCommunityIconsIcon
          name="trophy"
          style={styles.icon3}
        ></MaterialCommunityIconsIcon>
        <Text style={styles.rewards}>rewards</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.group}
        onPress={() => navigationn.navigate('ProfileScreen')}>
        <MaterialCommunityIconsIcon
          name="account-circle"
          style={styles.icon4}
        ></MaterialCommunityIconsIcon>
        <Text style={styles.profile}>profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,149,218,1)",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#111",
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.2,
    elevation: 3
  },
  btnWrapper1: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 12,
    minWidth: 80,
    maxWidth: 168,
    alignItems: "center"
  },
  icon1: {
    backgroundColor: "transparent",
    color: "#FFFFFF",
    fontSize: 24,
    opacity: 0.8
  },
  home: {
    color: "#FFFFFF",
    opacity: 0.8,
    fontFamily: 'Quicksand'
  },
  btnWrapper2: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 12,
    minWidth: 80,
    maxWidth: 168,
    alignItems: "center"
  },
  icon2: {
    backgroundColor: "transparent",
    color: "#FFFFFF",
    fontSize: 24,
    opacity: 0.8
  },
  tasks: {
    color: "#FFFFFF",
    opacity: 0.8,
    fontFamily: 'Quicksand'
  },
  btnWrapper3: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 12,
    minWidth: 80,
    maxWidth: 168,
    alignItems: "center"
  },
  icon3: {
    backgroundColor: "transparent",
    color: "#FFFFFF",
    fontSize: 22,
    opacity: 0.8
  },
  rewards: {
    color: "#FFFFFF",
    opacity: 0.8,
    fontFamily: 'Quicksand',
    height: 18.75
  },
  group: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 12,
    minWidth: 80,
    maxWidth: 168,
    alignItems: "center",
    width: 63
  },
  icon4: {
    backgroundColor: "transparent",
    color: "#FFFFFF",
    fontSize: 24,
    opacity: 0.8
  },
  profile: {
    color: "#FFFFFF",
    opacity: 0.8,
    fontFamily: 'Quicksand'
  }
});

export default MaterialBasicFooter1;
