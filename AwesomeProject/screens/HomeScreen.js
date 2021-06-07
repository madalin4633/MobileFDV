import React, { Component, useContext, useState, useEffect } from "react";
import { StyleSheet, View, Image, Dimensions, TouchableOpacity, Text, Alert } from "react-native";
import MaterialBasicFooter1 from "../components/MaterialBasicFooter1";
import { useFonts } from '@expo-google-fonts/inter';
import { AuthContext } from '../AuthProvider';
import { useNavigation } from '@react-navigation/native';
import firebase from '../database/firebaseDb';
import LoadingScreen from './LoadingScreen';

function HomeScreen(props) {
  const navigation = useNavigation();

  const { user, setUser } = useContext(AuthContext);
  const [type, setType] = useState('');
  console.log(user.uid);

  if (type === '') {
    var database = firebase.database();
    database.ref("/accounts/" + user.uid).on('value', function (snapshot) {
      var childData = snapshot.val();
      setType(childData.type);
    });
  }
  console.log(type);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/fabrica_de_voluntari.png")}
        resizeMode="contain"
        style={styles.image1}
      ></Image>
      <Text>{user.uid}</Text>
      <MaterialBasicFooter1
        style={styles.materialBasicFooter1}
      ></MaterialBasicFooter1>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  image1: {
    width: 100,
    height: 100,
    marginTop: 48,
    alignSelf: "center"
  },
  materialBasicFooter1: {
    height: 56,
    width: Dimensions.get('window').width,
    position: "absolute",
    bottom: 0
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
    marginTop: 100,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 2,
    minWidth: 88,
    paddingLeft: 16,
    paddingRight: 16
  },
  deconnect: {
    color: "#fff",
    fontSize: 22,
    fontFamily: 'Quicksand'
  }
});

export default HomeScreen;
