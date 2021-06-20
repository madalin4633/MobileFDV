import { useNavigation } from '@react-navigation/native';
import EntypoIcon from "react-native-vector-icons/Entypo";
import { StyleSheet, RefreshControl, ScrollView, View, Image, Dimensions, TouchableOpacity, Linking, FlatList, Text, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { Component, useContext, useState, useEffect, useRef } from "react";

function ProfileInfo(props) {

    const navigationn = useNavigation();

    const Item = () => (
        <View>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                1. SECȚIUNEA "PROFIL PERSONAL" permite alegerea unei imagini de profil din galeria telefonului și oferirea de informații personale, necesare asociațiilor în alte secțiuni ale aplicației. Toate câmpurile sunt obligatorii și se recomandă folosirea diacriticelor.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                2. După apăsarea butonului "Salvează date", așteptați până la semnalul că toate informațiile au fost salvate în baza de date, iar restul secțiunilor din aplicație se vor debloca. Dacă vrei să editezi aceste informații, poți în același moment după, iar la o revenire ulterioară va trebui să reintroduci toate câmpurile din nou.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                3. SECȚIUNEA "ASOCIAȚII DISPONIBILE" permite voluntarului să aplice în orice asociație disponibilă pe platformă, urmând ca asociația să îi aprobe sau nu cererea.
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ alignItems: 'center', backgroundColor: "white" }}>
                <EntypoIcon name="back" style={styles.icon3}
                    onPress={() => navigationn.goBack()}></EntypoIcon>
                <Image source={require("../assets/images/tips.png")} resizeMode="contain" style={styles.image1}></Image>
                <Text style={styles.autentificare}>Instrucțiuni pentru ecranul TASKS</Text>
                <Text style={styles.loremIpsum1}>
                    pentru a putea folosi toate funcționalitățile ca {props.route.params.type === 0 ? "voluntar:" : "asociație:"}
                </Text>

                {props.route.params.type === 0 ? 
                <Item></Item>
                :
                    <Text> sunt Asociatie si asta tre sa fac</Text>}
            </ScrollView>
        </SafeAreaView>
    );

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
        marginTop: 20,
    },
    image1: {
        width: 75,
        height: 75,
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
    },
});

export default ProfileInfo;