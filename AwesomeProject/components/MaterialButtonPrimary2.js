import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import firebase from '../database/firebaseDb'
import { useNavigation } from '@react-navigation/native';

function MaterialButtonPrimary2(props) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={[styles.container, props.style]}>
      <Text 
      style={styles.asociație}
      OnPress = {() => {
        
        firebase
            .auth()
            .signInWithEmailAndPassword(props.email, props.password)
            .then((response) => {
                const uid = response.user.uid
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert("Acest cont nu există.")
                            return;
                        }
                        const user = firestoreDocument.data()
                        navigation.navigate('HomeScreen', {user})
                    })
                    .catch(error => {
                        alert(error)
                    });
            })
            .catch(error => {
                alert(error)
            })
      }}>Autentifică-mă</Text>
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
