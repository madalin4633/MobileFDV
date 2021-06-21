import { useNavigation } from '@react-navigation/native';
import EntypoIcon from "react-native-vector-icons/Entypo";
import { StyleSheet, RefreshControl, ScrollView, View, Image, Dimensions, TouchableOpacity, Linking, FlatList, Text, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { Component, useContext, useState, useEffect, useRef } from "react";

function TasksInfo(props) {

    const navigationn = useNavigation();

    const Item = () => (
        <View>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                1. SECȚIUNEA "ANUNȚURI ANTERIOARE" afișează toate anunțurile pe care asociația ta le-a făcut, doar că trebuie selectată întăi, pentru a afișa anunțurile ei. Odată selectată, culoarea câmpului ei se va schimba.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                2. Chenarele albastre delimitează o porțiune de ecran în care se poate derula, în caz că asociațiile / anunțurile sunt mai multe decât sunt afișate inițial. Chenarele vor rămâne goale dacă nu există asociații din care faci parte sau anunțuri ale asociației selectate.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                3. SECȚIUNEA "GENEREAZĂ ADEVERINȚĂ" permite voluntarului să își genereze o adeverință de voluntariat, în format PDF, care reunește toate recompensele primite prin cod în perioada selectată, sub îndrumarea asociației selectate. Acest PDF va putea fi distribuit prin email sau pe Drive, urmând ca reprezentantul legal al asociației respective să înregistreze, să semneze și să ștampileze această adeverință. Datele trebuie să fie neapărat diferite, fiind o modalitate prin care se asigură că cele 2 date diferite sunt setate manual de voluntar înainte de interogare.
            </Text>
        </View>
    );

    
    const Itemm = () => (
        <View>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                1. SECȚIUNEA "creează un anunț" permite asociației să notifice voluntarii cu privire la o nouă activitate din viitorul apropiat - se recomandă titlul scurt, dintr-un singur cuvânt (exemple: ședință, ecologizare, conferință, amenajare, etc.), iar descrierea cât mai detaliată.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                2. Toate câmpurile sunt obligatorii, existând mesaje specifice pentru validarea datelor.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                3. SECȚIUNEA "ANUNȚURI ANTERIOARE" afișează toate anunțurile pe care asociația ta le-a făcut, în ordine cronologică (cel mai recent postat va fi mai sus).
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

export default TasksInfo;