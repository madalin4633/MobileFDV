import React, { Component, useContext, useState, useEffect, useRef } from "react";
import { Button, StyleSheet, View, Image, Dimensions, TouchableOpacity, Text, Alert } from "react-native";
import MaterialBasicFooter1 from "../components/MaterialBasicFooter1";
import { useFonts } from '@expo-google-fonts/inter';
import { AuthContext } from '../AuthProvider';
import { useNavigation } from '@react-navigation/native';
import firebase from '../database/firebaseDb';
import LoadingScreen from './LoadingScreen';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

function TasksScreen(props) {
    const navigation = useNavigation();

    const { user, setUser } = useContext(AuthContext);
    const [type, setType] = useState('');
    const [edit, setEdit] = useState('');
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
  
    useEffect(() => {
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);

    if (type === '') {
        var database = firebase.database();
        database.ref("/accounts/" + user.uid).on('value', function (snapshot) {
            var childData = snapshot.val();
            setType(childData.type);
            setEdit(childData.edited);
        });
    }
    if (edit === 1)
        return (
            <View style={styles.container}>
                <Image
                    source={require("../assets/images/fabrica_de_voluntari.png")}
                    resizeMode="contain"
                    style={styles.image1}
                ></Image>
                <Text>{user.uid}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                    <View>
                        <Text style={{ width: 50, textAlign: 'center' }}>Hello</Text>
                    </View>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                </View>

                
            <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
                <View style={styles.footerContainer}>
                    <MaterialBasicFooter1
                        style={styles.materialBasicFooter1}
                    ></MaterialBasicFooter1>
                </View>
            </View>
        );
    else return (
        <View style={styles.container}>
            <Image
                source={require("../assets/images/fabrica_de_voluntari.png")}
                resizeMode="contain"
                style={styles.image1}
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
}



async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }
  
  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }

const home = StyleSheet.create({
    textW: {
        textAlign: 'center',
        fontFamily: "Quicksand",
        fontSize: 25,
        color: "black"
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    materialBasicFooter1: {
        height: 56,
        width: Dimensions.get('window').width,
    },
    image1: {
        width: 100,
        height: 100,
        marginTop: 48,
        alignSelf: "center"
    },
    footerContainer: {
        marginTop: 'auto',
        bottom: 0
    },
});

export default TasksScreen;
