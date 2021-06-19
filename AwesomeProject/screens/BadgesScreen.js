import { useNavigation } from '@react-navigation/native';
import React, { Component, useState, useContext, useRef, useEffect } from "react";
import { View, ScrollView, Text, Image, Dimensions, StyleSheet } from "react-native";
import { AuthContext } from '../AuthProvider';
import EntypoIcon from "react-native-vector-icons/Entypo";
import firebase from '../database/firebaseDb';
import { SafeAreaView } from 'react-native-safe-area-context';

function BadgesScreen(props) {

    const navigationn = useNavigation();
    const { user, setUser } = useContext(AuthContext);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ alignItems: 'center', backgroundColor: "white" }}>
                <EntypoIcon name="back" style={styles.icon3}
                    onPress={() => navigationn.goBack()}></EntypoIcon>
                <Text style={styles.autentificare}>Colecția ta de insigne,</Text>
                <Text style={styles.loremIpsum1}>
                    pentru că implicarea merită mereu răsplătită:
                </Text>
                <Image source={require("../assets/images/welcome.png")} resizeMode="contain" style={styles.image1}></Image>
                {props.route.params.stats.hours === 0 ? <Image source={require("../assets/images/lazy.png")} resizeMode="contain" style={styles.image1}></Image> : null}
                
                {props.route.params.stats.hours >= 1 ? <Image source={require("../assets/images/1ora.png")} resizeMode="contain" style={styles.image1}></Image> : <Image source={require("../assets/images/blocat.png")} resizeMode="contain" style={styles.image1}></Image>}
                {props.route.params.stats.hours >= 10 ? <Image source={require("../assets/images/10ore.png")} resizeMode="contain" style={styles.image1}></Image> : <Image source={require("../assets/images/blocat.png")} resizeMode="contain" style={styles.image1}></Image>}
                {props.route.params.stats.hours >= 100 ? <Image source={require("../assets/images/100ore.png")} resizeMode="contain" style={styles.image1}></Image> : <Image source={require("../assets/images/blocat.png")} resizeMode="contain" style={styles.image1}></Image>}

                {props.route.params.stats.ngos_number >= 1 ? <Image source={require("../assets/images/1ong.png")} resizeMode="contain" style={styles.image1}></Image> : <Image source={require("../assets/images/blocat.png")} resizeMode="contain" style={styles.image1}></Image>}
                {props.route.params.stats.ngos_number >= 3 ? <Image source={require("../assets/images/3ong.png")} resizeMode="contain" style={styles.image1}></Image> : <Image source={require("../assets/images/blocat.png")} resizeMode="contain" style={styles.image1}></Image>}
                {props.route.params.stats.ngos_number >= 5 ? <Image source={require("../assets/images/3ong.png")} resizeMode="contain" style={styles.image1}></Image> : <Image source={require("../assets/images/blocat.png")} resizeMode="contain" style={styles.image1}></Image>}

                {props.route.params.stats.rewards >= 1 ? <Image source={require("../assets/images/1task.png")} resizeMode="contain" style={styles.image1}></Image> : <Image source={require("../assets/images/blocat.png")} resizeMode="contain" style={styles.image1}></Image>}
                {props.route.params.stats.rewards >= 5 ? <Image source={require("../assets/images/5tasks.png")} resizeMode="contain" style={styles.image1}></Image> : <Image source={require("../assets/images/blocat.png")} resizeMode="contain" style={styles.image1}></Image>}
                {props.route.params.stats.rewards >= 15 ? <Image source={require("../assets/images/15tasks.png")} resizeMode="contain" style={styles.image1}></Image> : <Image source={require("../assets/images/blocat.png")} resizeMode="contain" style={styles.image1}></Image>}

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
    },
    icon3: {
        color: "rgba(0,0,0,1)",
        fontSize: 25,
        marginRight: "70%",
        marginTop: 30,
    },
    image1: {
        width: 250,
        height: 250,
        marginBottom: 10
    },
    loremIpsum1: {
        fontFamily: "Quicksand",
        color: "rgba(96,93,93,1)",
        textAlign: "center",
        fontSize: 11,
        marginBottom: 30
    },
    autentificare: {
        fontFamily: "Quicksand",
        color: "#121212",
        width: "100%",
        textAlign: "center",
        fontSize: 20,
        marginTop: 10
    },
});

export default BadgesScreen;