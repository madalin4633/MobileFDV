import React, { Component, useContext, useState } from "react";
import { StyleSheet, View, Image, Dimensions, TouchableOpacity, Text, Alert, TextInput } from "react-native";
import MaterialBasicFooter1 from "../components/MaterialBasicFooter1";
import { useFonts } from '@expo-google-fonts/inter';
import { AuthContext } from '../AuthProvider';
import { useNavigation } from '@react-navigation/native';
import EntypoIcon from "react-native-vector-icons/Entypo";
import firebase from '../database/firebaseDb';
import { greaterThan } from "react-native-reanimated";

function RewardScreen(props) {
    const navigation = useNavigation();

    const { user, setUser } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [descr, setDescr] = useState('');
    const [hours, setHours] = useState('');
    const [people, setPeople] = useState('');
    const [type, setType] = useState('');
    const [rewardCode, setReward] = useState('');
    if (type === '') {
        var database = firebase.database();
        database.ref("/accounts/" + user.uid).on('value', function (snapshot) {
            var childData = snapshot.val();
            setType(childData.type);
        });
    }
    if (type === 1)
        return (
            <View style={styles.container}>
                <EntypoIcon name="info-with-circle" style={styles.icon3}></EntypoIcon>
                <Image
                    source={require("../assets/images/fabrica_de_voluntari.png")}
                    resizeMode="contain"
                    style={styles.image1}
                ></Image>
                <Text style={styles.acorda}>Acordă o recompensă</Text>
                <Text style={styles.loremIpsum1}>
                    Introdu corect datele și distribuie codul.
                </Text>
                <View style={styles.titleStack}>
                    <Text style={styles.title}>Titlu:</Text>
                    <View style={[stylesss.container]}>
                        <TextInput
                            placeholder={"text obligatoriu"}
                            style={stylesss.inputStyle}
                            onChangeText={(text) => setTitle(text)}
                            value={title}
                        ></TextInput>
                    </View>
                </View>
                <View style={styles.titleStack}>
                    <Text style={styles.title}>Descriere:</Text>
                    <View style={[stylesss.container]}>
                        <TextInput
                            placeholder={"text obligatoriu"}
                            style={stylesss.inputStyle}
                            onChangeText={(text) => setDescr(text)}
                            value={descr}
                        ></TextInput>
                    </View>
                </View>
                <View style={styles.titleStack}>
                    <Text style={styles.title}>Nr. ore:</Text>
                    <View style={[stylesss.container]}>
                        <TextInput
                            placeholder={"număr întreg"}
                            style={stylesss.inputStyle}
                            onChangeText={(text) => setHours(text)}
                            value={hours}
                        ></TextInput>
                    </View>
                </View>
                <View style={styles.titleStack}>
                    <Text style={styles.title}>Nr. pers.:</Text>
                    <View style={[stylesss.container]}>
                        <TextInput
                            placeholder={"număr întreg"}
                            style={stylesss.inputStyle}
                            onChangeText={(text) => setPeople(text)}
                            value={people}
                        ></TextInput>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styless.container, props.style]}
                    onPress={() => {
                        if (title === '' || descr === '' || hours === '' || people === '') {
                            Alert.alert("Toate câmpurile sunt obligatorii! Apasă (i) pentru indicații.")
                        } else {
                            if (!Number.isInteger(parseInt(hours)) || !Number.isInteger(parseInt(people))) {
                                Alert.alert("Introdu numere întregi pozitive.")
                            } else {
                                var database1 = firebase.database();
                                let val = Math.floor(1000 + Math.random() * 9000);
                                database1.ref('/rewards/').push({
                                    code: val,
                                    title: title,
                                    description: descr,
                                    hours: parseInt(hours),
                                    people: parseInt(people),
                                    created_at: firebase.database.ServerValue.TIMESTAMP,
                                    created_by: user.uid,
                                });
                                setReward("Codul este: " + val.toString());
                            }
                        }
                    }}>
                    <Text style={styless.deconnect}>
                        Generează</Text>
                </TouchableOpacity>
                <MaterialBasicFooter1
                    style={styles.materialBasicFooter1}
                ></MaterialBasicFooter1>
                {rewardCode === '' ? null : <Text style={reward.rewardCode}>{rewardCode}</Text>}
            </View >
        );
    else return (
        <View style={styles.container}>
            <EntypoIcon name="info-with-circle" style={styles.icon3}></EntypoIcon>
            <Image
                source={require("../assets/images/fabrica_de_voluntari.png")}
                resizeMode="contain"
                style={styles.image1}
            ></Image>
            <Text style={styles.acorda}>Primește o recompensă</Text>
            <Text style={styles.loremIpsum1}>
                Introdu corect codul de la coordonator.
                </Text>
            <View style={styles.titleStackk}>
                <Text style={styles.title}>COD:</Text>
                <View style={[stylesss.container]}>
                    <TextInput
                        placeholder={"text obligatoriu"}
                        style={stylesss.inputStyle}
                        onChangeText={(text) => setTitle(text)}
                        value={title}
                    ></TextInput>
                </View>
            </View>

            <TouchableOpacity
                style={[styless.container, props.style]}>
                <Text style={styless.deconnect}
                    onPress={() => {
                        if (title === '') {
                            Alert.alert("Nu ai introdus niciun cod!");
                        } else {
                            var database = firebase.database();
                            var userRef = database.ref("/rewards/");
                            let okToGo = 0;
                            let deja = 0;
                            let once = 0;
                            userRef.on('value', function (snapshot) {
                                snapshot.forEach(function (childSnapshot) {
                                    var childData = childSnapshot.val();
                                    //console.log(alreadyR);
                                    let actualDate = new Date(firebase.database.ServerValue.TIMESTAMP);
                                    let dateToCheck = new Date(childData.created_at.toString());
                                    var isSameDay = (dateToCheck.getDate() === actualDate.getDate()
                                        && dateToCheck.getMonth() === actualDate.getMonth()
                                        && dateToCheck.getFullYear() === actualDate.getFullYear())
                                    if (childData.code === parseInt(title) && !isSameDay) {
                                        //console.log(childData);
                                        var redeems = childSnapshot.child("redeemed_by").numChildren();
                                        let okA = 1;
                                        //console.log(redeems);
                                        if (redeems > 0) {
                                            var alreadyR = childSnapshot.child("redeemed_by");
                                            alreadyR.forEach(function (grandChild) {
                                                var grandData = grandChild.val();
                                                if (grandData.user === user.uid)
                                                    { okA = 0; deja = 1;}
                                            });
                                        }
                                        if (redeems < childData.people && okA === 1 && once===0){
                                            okToGo = 1;
                                            once = 1;
                                        database.ref("/rewards/" + childSnapshot.key + "/redeemed_by/").push({
                                            user: user.uid
                                        });
                                        Alert.alert('Cod revendicat cu SUCCES!');
                                        }
                                    }
                                });
                            });
                            if (deja === 1 && once === 0 ) {
                                Alert.alert('Cod deja revendicat.');
                            } else { if (okToGo === 0) Alert.alert('Cod incorect sau expirat.'); }
                        }
                    }}>
                    Revendică</Text>
            </TouchableOpacity>
            <MaterialBasicFooter1
                style={styles.materialBasicFooter1}
            ></MaterialBasicFooter1>
        </View>
    );
}

const reward = StyleSheet.create({
    rewardCode: {
        fontFamily: "Quicksand",
        color: "green",
        textAlign: "center",
        fontSize: 20,
        flexDirection: "row",
        borderColor: "green",
        backgroundColor: "lightgreen",
        marginTop: "5%",
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 10,
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    titleStack: {
        marginTop: "2%",
        flexDirection: "row",
    },
    titleStackk: {
        marginTop: "10%",
        flexDirection: "row",
    },
    title: {
        fontFamily: "Quicksand",
        color: "rgba(0,149,218,1)",
        fontSize: 18,
        width: 105
    },
    icon3: {
        flex: 0,
        position: "absolute",
        color: "rgba(0,149,218,1)",
        fontSize: 25,
        marginRight: "10%",
        marginTop: 50,
        alignSelf: 'flex-end',
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
    },
    acorda: {
        marginTop: "5%",
        fontFamily: "Quicksand",
        color: "#121212",
        width: "100%",
        textAlign: "center",
        fontSize: 22,
    },
    loremIpsum1: {
        fontFamily: "Quicksand",
        color: "rgba(96,93,93,1)",
        textAlign: "center",
        fontSize: 13,
        marginBottom: 10
    }
});

const styless = StyleSheet.create({
    container: {
        backgroundColor: "rgba(0,149,218,1)",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 5,
        shadowColor: "#000",
        marginTop: "5%",
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
    },
});

const stylesss = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderColor: "#D9D5DC",
        backgroundColor: "transparent",
    },
    inputStyle: {
        color: "#000",
        paddingRight: 5,
        fontSize: 16,
        lineHeight: 16,
        paddingBottom: 8,
        width: 250
    }
});

export default RewardScreen;
