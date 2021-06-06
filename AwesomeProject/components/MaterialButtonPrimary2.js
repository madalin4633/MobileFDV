import React, { Component, useContext } from "react";
import { StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../AuthProvider';
import firebase from '../database/firebaseDb';

function MaterialButtonPrimary2(props) {
  const navigation = useNavigation();

  const { login } = useContext(AuthContext);

  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      onPress={() => {
        let okToAuth = 1;
        var database = firebase.database();
        var userRef = database.ref("accounts");
        userRef.on('value', function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            if(childData.email===props.email && childData.type!=props.accType){
              okToAuth = 0;
              Alert.alert('Contul tău este de alt tip!');
            }
          });
        });

        if (props.email === '' || props.password === '') {
          Alert.alert('Ai uitat să introduci toate datele!');
          okToAuth = 0;
        }

        if (okToAuth===1) {
          login(props.email, props.password)
        }
      }}>
      <Text style={styles.asociație}>Autentifică-mă</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,149,218,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 2,
    shadowColor: "#000",
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
  asociație: {
    color: "#fff",
    fontSize: 17,
    fontFamily: 'Quicksand'
  }
});

export default MaterialButtonPrimary2;
