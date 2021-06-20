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
                1. SECȚIUNEA "NIVELUL TĂU" exprimă, în baza numărului de asociații din care faci parte, de recompense primite, de ore lucrate și de vechime în zile pe platformă un nivel de experiență. Animația care se încarcă arată procentual cât mai ai până la următorul nivel.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                2. Din cauza configurației hardware a telefonului sau a calității conexiunii la internet, este posibil ca nivelul și progresul să nu se încarce din prima. Pentru aceasta, a fost implementată funcționalitatea de "pull-to-refresh", care, printr-un gest vertical executat de sus în jos deasupra nivelului, reîncarcă această componentă.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: "justify", width: Dimensions.get('window').width * 8.5 / 10, fontFamily: "Quicksand", fontSize: 13, color: "grey" }}>
                3. SECȚIUNEA "ȘTIRI DESPRE VOLUNTAR" încarcă, prin intermediul unui NewsAPI, titlul știrilor relevante din România, având "voluntar" drept cuvânt-cheie în articole. Apasă pe titlul articolului pentru a-l deschide separat și a rămâne tot timpul informat cu noutăți din acest segment de activitate, în continuă creștere ca popularitate.
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

export default TasksInfo;