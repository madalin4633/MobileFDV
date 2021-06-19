import React, { Component, useContext, useState, useEffect, useRef } from "react";
import { StyleSheet, View, Image, Dimensions, FlatList, TouchableOpacity, Text, Alert, TextInput } from "react-native";
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
    const [edit, setEdit] = useState('');
    const [rewardCode, setReward] = useState('');
    const [ngos, setNgos] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const isMounted = useRef(null);

    const getNGOS = async () => {
        var database2 = firebase.database();
        database2.ref('/ngos/').on('value', function (snapshot) {
            var ngosHere = [];
            if (snapshot.numChildren() != 0)
                snapshot.forEach(function (childSnapshot) {
                    var accepted = childSnapshot.child("/accepted/" + user.uid.toString()).numChildren();
                    if (accepted != 0) {
                        let object = {};
                        object['name'] = childSnapshot.toJSON().name;
                        object['id'] = childSnapshot.key;
                        ngosHere.push(object);
                    }
                });
            setNgos(ngosHere);
        });
    }

    useEffect(() => {
        isMounted.current = true;

        getNGOS();
        return () => {
            // executed when unmount
            isMounted.current = false;
        }
    }, []);

    if (type === '') {
        var database = firebase.database();
        database.ref("/accounts/" + user.uid).on('value', function (snapshot) {
            var childData = snapshot.val();
            setType(childData.type);
            setEdit(childData.edited);
        });
    }

    const Item = ({ item, onPress, backgroundColor, textColor }) => (
        <View style={stylesList.container}>
            <TouchableOpacity onPress={onPress} style={[stylesList.item, backgroundColor]}>
                <Text style={[stylesList.title, textColor]}>{item.name}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? "#0000CD" : "rgba(0,149,218,1)";
        const color = 'white';

        return (
            <Item
                item={item}
                onPress={() => setSelectedId(item.id)}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

    if (edit === 0) return (
        <View style={home.container}>
            <Image
                source={require("../assets/images/fabrica_de_voluntari.png")}
                resizeMode="contain"
                style={home.image1}
            ></Image>
            <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: "40%" }}>
                <View style={{ width: 125, height: 3, backgroundColor: 'rgba(0,149,218,1)', marginBottom: 25 }} />
                <Text style={home.textW}>Bine ai venit,</Text>
                <Text style={home.textW}>completează-ți profilul</Text>
                <Text style={home.textW}>pentru a debloca aplicația.</Text>
                <View style={{ width: 125, height: 3, backgroundColor: 'rgba(0,149,218,1)', marginTop: 30 }} />
            </View>
            <View style={styles.footerContainer}>
                <MaterialBasicFooter1
                    style={styles.materialBasicFooter1}
                ></MaterialBasicFooter1>
            </View>
        </View>
    );
    else {
        if (type === 1)
            return (
                <View style={styles.container}>
                    <EntypoIcon name="info-with-circle" style={styles.icon3}></EntypoIcon>
                    <Image
                        source={require("../assets/images/fabrica_de_voluntari.png")}
                        resizeMode="contain"
                        style={styles.image1}
                    ></Image>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, marginTop: 15 }}>
                        <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'rgb(220,220,220)', bottom: 0, marginTop: 'auto' }} />
                        <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Acordă recompensă</Text>
                    </View>
                    <Text style={styles.loremIpsum1}>
                        Introdu corect datele și distribuie codul.
                    </Text>
                    <View style={styles.titleStack}>
                        <EntypoIcon name="briefcase" style={styles.icon4}></EntypoIcon>
                        <Text style={styles.title}>:</Text>
                        <View style={[stylesss.container]}>
                            <TextInput
                                placeholder={"titlul activității, obligatoriu"}
                                style={stylesss.inputStyle}
                                onChangeText={(text) => setTitle(text)}
                                value={title}
                            ></TextInput>
                        </View>
                    </View>
                    <View style={styles.titleStack}>
                        <EntypoIcon name="chat" style={styles.icon4}></EntypoIcon>
                        <Text style={styles.title}>:</Text>
                        <View style={[stylesss.container]}>
                            <TextInput
                                placeholder={"scurtă descriere, obligatorie"}
                                style={stylesss.inputStyle}
                                multiline={true}
                                onChangeText={(text) => setDescr(text)}
                                value={descr}
                            ></TextInput>
                        </View>
                    </View>
                    <View style={styles.titleStack}>
                        <EntypoIcon name="clock" style={styles.icon4}></EntypoIcon>
                        <Text style={styles.title}>:</Text>
                        <View style={[stylesss.container]}>
                            <TextInput
                                placeholder={"număr întreg de ore lucrate"}
                                keyboardType='phone-pad'
                                style={stylesss.inputStyle}
                                onChangeText={(text) => setHours(text)}
                                value={hours}
                            ></TextInput>
                        </View>
                    </View>
                    <View style={styles.titleStack}>
                        <EntypoIcon name="users" style={styles.icon4}></EntypoIcon>
                        <Text style={styles.title}>:</Text>
                        <View style={[stylesss.container]}>
                            <TextInput
                                placeholder={"număr de persoane, obligatoriu"}
                                keyboardType='phone-pad'
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
                    {rewardCode === '' ? null : <Text style={reward.rewardCode}>{rewardCode}</Text>}
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, marginTop: 20 }}>
                        <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'rgb(220,220,220)', bottom: 0, marginTop: 'auto' }} />
                        <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Statistici personale</Text>
                    </View>
                    <View style={styles.footerContainer}>
                        <MaterialBasicFooter1
                            style={styles.materialBasicFooter1}
                        ></MaterialBasicFooter1>
                    </View>

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
                <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, marginTop: 15 }}>
                    <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'rgb(220,220,220)', bottom: 0, marginTop: 'auto' }} />
                    <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Primește recompensă</Text>
                </View>
                <Text style={styles.loremIpsum1}>
                    1. Selectează asociația (gol dacă nu ai niciuna).
                </Text>

                <View style={{ height: 150, width: Dimensions.get('window').width * 12 / 15, borderWidth: 3, borderRadius: 4, borderColor: "rgba(0,149,218,1)" }}>
                    <FlatList data={ngos} renderItem={renderItem} keyExtractor={(item) => item.id} />
                </View>

                <Text style={styles.loremIpsum2}>
                    2. Introdu codul.
                </Text>

                <View style={styles.titleStackk}>
                <EntypoIcon name="medal" style={styles.icon4}></EntypoIcon>
                    <Text style={styles.title}>:</Text>
                    <View style={[stylesss.container]}>
                        <TextInput
                            placeholder={"cod obligatoriu"}
                            style={stylesss.inputStyle}
                            keyboardType='phone-pad'
                            onChangeText={(text) => setTitle(text)}
                            value={title}
                        ></TextInput>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styless.container, props.style]}>
                    <Text style={styless.deconnect}
                        onPress={() => {
                            if (title === '' || selectedId === null) {
                                Alert.alert("Asociație neselectată sau cod neintrodus!");
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
                                        // console.log(dateToCheck.getDate());
                                        // console.log(actualDate.getDate());
                                        // console.log(dateToCheck.getMonth());
                                        // console.log(actualDate.getMonth());
                                        // console.log(dateToCheck.getFullYear());
                                        // console.log(actualDate.getFullYear());
                                        if (childData.code === parseInt(title) && !isSameDay && childData.created_by === selectedId) {
                                            //console.log(childData);
                                            var redeems = childSnapshot.child("redeemed_by").numChildren();
                                            let okA = 1;
                                            //console.log(redeems);
                                            if (redeems > 0) {
                                                var alreadyR = childSnapshot.child("redeemed_by");
                                                alreadyR.forEach(function (grandChild) {
                                                    var grandData = grandChild.val();
                                                    if (grandData.user === user.uid) { okA = 0; deja = 1; }
                                                });
                                            }
                                            if (redeems < childData.people && okA === 1 && once === 0) {
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
                                if (deja === 1 && once === 0) {
                                    Alert.alert('Cod deja revendicat.');
                                } else { if (okToGo === 0) Alert.alert('Cod incorect, expirat sau al altei asociații.'); }
                            }
                        }}>
                        Revendică</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, marginTop: 20 }}>
                    <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'rgb(220,220,220)', bottom: 0, marginTop: 'auto' }} />
                    <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Statistici personale</Text>
                </View>
                <Text style={styles.loremIpsum1}>
                    To be implemented.
                </Text>
                <View style={styles.footerContainer}>
                    <MaterialBasicFooter1
                        style={styles.materialBasicFooter1}
                    ></MaterialBasicFooter1>
                </View>
            </View>
        );
    }
}

const stylesList = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        marginTop: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        width: Dimensions.get('window').width * 7.5 / 10
    },
    title: {
        fontSize: 15,
        fontFamily: 'Quicksand',
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 10,
        fontFamily: 'Quicksand'
    }
});

const home = StyleSheet.create({
    textW: {
        textAlign: 'center',
        fontFamily: "Quicksand",
        fontSize: 25,
        color: "black"
    },
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
        marginTop: "3%",
        flexDirection: "row",
    },
    title: {
        fontFamily: "Quicksand",
        color: "rgba(0,149,218,1)",
        fontSize: 18,
        marginLeft: 2,
        marginRight: 20
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
    icon4: {
        color: "rgba(0,149,218,1)",
        fontSize: 25,
        marginLeft: 10
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
    },
    footerContainer: {
        marginTop: 'auto',
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
    },
    loremIpsum2: {
        fontFamily: "Quicksand",
        color: "rgba(96,93,93,1)",
        textAlign: "center",
        fontSize: 13,
        marginTop: 10
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
        fontSize: 16,
        lineHeight: 16,
        width: 275
    }
});

export default RewardScreen;
