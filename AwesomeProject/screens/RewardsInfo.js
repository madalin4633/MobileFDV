import { useNavigation } from '@react-navigation/native';
import EntypoIcon from "react-native-vector-icons/Entypo";
import { StyleSheet, RefreshControl, ScrollView, View, Image, Dimensions, TouchableOpacity, Linking, FlatList, Text, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { Component, useContext, useState, useEffect, useRef } from "react";

function RewardsInfo(props) {

    const navigationn = useNavigation();

    const Item = () => (
        <View>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                1. SECȚIUNEA "PRIMEȘTE RECOMPENSĂ" permite voluntarului să selecteze o asociație în care a fost confirmat ca făcând parte și să primească recompensa, odată cu introducerea codului primit de la coordonator.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                2. Este important de reținut că un cod poate fi validat de către un voluntar doar dacă este folosit în aceeași zi cu ziua definirii lui, în limita locurilor disponibile pentru acel cod, pentru a evita situațiile de revendicare a recompensei de către alte persoane decât cele dorite.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                3. SECȚIUNEA "STATISTICI PERSONALE" permite voluntarului să vadă, ordonat, cât de activi sunt și ceilalți colegi ai lui din respectiva asociație, pentru a vedea cât de mult trebuie să muncească pentru a deveni cel mai activ într-o anumită perioadă de timp (de exemplu, în ultimul an pentru titlul de "Voluntarul Anului"). Acest interval de timp se definește prin butoane specifice, început și sfârșit, și trebuie să fie 2 date distincte între ele.
            </Text>
        </View>
    );

    const Itemm = () => (
        <View>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                1. SECȚIUNEA "ACORDĂ RECOMPENSĂ" permite asociației să genereze un cod unic prin care poate acorda orele lucrate unui număr predefinit de voluntari, doar în ziua în care a fost creat respectivul cod. 
            </Text>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                2. Se recomandă ca la titlu să se folosească un cuvânt (exemple: ședință, ecologizare, conferință, amenajare, etc.), iar la descriere să se includă cât mai multe detalii.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                3. SECȚIUNEA "STATISTICILE MEMBRILOR" permite asociației să vadă, ordonat, cât de activi sunt voluntarii ei, pentru a vedea cine este activ într-o anumită perioadă de timp (de exemplu, în ultimul an, pentru a putea acorda titlul de "Voluntarul Anului"). Acest interval de timp se definește prin butoane specifice, început și sfârșit, și trebuie să fie 2 date distincte între ele.
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ alignItems: 'center', backgroundColor: "white" }}>
                <EntypoIcon name="back" style={styles.icon3}
                    onPress={() => navigationn.goBack()}></EntypoIcon>
                <Image source={require("../assets/images/tips.png")} resizeMode="contain" style={styles.image1}></Image>
                <Text style={styles.autentificare}>Instrucțiuni pentru ecranul REWARDS</Text>
                <Text style={styles.loremIpsum1}>
                    pentru a putea folosi toate funcționalitățile ca {props.route.params.type === 0 ? "voluntar:" : "asociație:"}
                </Text>

                {props.route.params.type === 0 ? 
                <Item></Item>
                :
                    <Itemm></Itemm>}
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
        fontSize: 18.5,
    },
});

export default RewardsInfo;