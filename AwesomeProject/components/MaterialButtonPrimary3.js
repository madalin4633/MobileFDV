import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import firebase from '../database/firebaseDb'
import { useNavigation } from '@react-navigation/native';

function MaterialButtonPrimary3(props) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={[styles.container, props.style]}
      onPress={() => {
        if(props.email === '' || props.password === ''){
          Alert.alert('Ai uitat să introduci toate datele!')
        } else {
          firebase
          .auth()
          .createUserWithEmailAndPassword(props.email, props.password)
          .then((response) => {
              const uid = response.user.uid
              const data = {
                  id: uid,
                  email: props.email
              };
              Alert.alert('Contul a fost creat! Loghează-te în ecranul anterior.')
              const usersRef = firebase.firestore().collection('users')
              usersRef
                  .doc(uid)
                  .set(data)
                  .then(() => {
                      navigation.navigate('HomeScreen', {user: data})
                  })
                  .catch((error) => {
                      alert(error)
                  });
          })
          .catch((error) => {
              alert(error)
      });}
        
        }}>
        <Text style={styles.asociație}>Înregistrează-mă</Text>
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
    paddingLeft: 5,
    paddingRight: 5
  },
  asociație: {
    color: "#fff",
    fontSize: 17,
    fontFamily: 'Quicksand'
  }
});

export default MaterialButtonPrimary3;
