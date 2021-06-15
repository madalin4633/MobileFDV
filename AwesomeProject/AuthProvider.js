import React, { createContext, useState } from 'react';
import { Alert } from 'react-native';
import firebase from './database/firebaseDb';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';

function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
                // We don't need to reauth the Firebase connection.
                return true;
            }
        }
    }
    return false;
}

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, password) => {
                    try {
                        await firebase.auth().signInWithEmailAndPassword(email, password);
                    } catch (e) {
                        Alert.alert(e.message);
                    }
                },
                register: async (email, password, accType) => {
                    try {
                        firebase.auth().createUserWithEmailAndPassword(email, password)
                            .then(function (result) {
                                firebase
                                    .database()
                                    .ref('/accounts/' + result.user.uid)
                                    .set({
                                        type: accType,
                                        edited: 0,
                                        email: email
                                    });
                            })
                            .catch((error) => {
                                Alert.alert(error.message);
                            });
                    } catch (e) {
                        Alert.alert(e.message);
                    }
                },
                logout: async () => {
                    try {
                        await firebase.auth().signOut();
                    } catch (e) {
                        Alert.alert(e.message);
                    }
                },
                loginG: async (accType) => {
                    const config = {
                        androidClientId: '961151676423-plkd8clo1f0je3feeegdg3r3dulva6jk.apps.googleusercontent.com',
                        iosClientId: '961151676423-9of1tr1k01kj5966a6n2pv7s2195e5rk.apps.googleusercontent.com',
                        scopes: ['profile', 'email']
                    };
                    try {
                        Google.logInAsync(config)
                            .then((resultt) => {
                                let okToAuth = 1;
                                let AlreadyExists = 0;
                                var database = firebase.database();
                                var userRef = database.ref("accounts");
                                userRef.on('value', function (snapshot) {
                                    snapshot.forEach(function (childSnapshot) {
                                        var childData = childSnapshot.val();
                                        if (childData.email === resultt.user.email && childData.type != accType) {
                                            okToAuth = 0;
                                        }
                                        if (childData.email === resultt.user.email && childData.type === accType) {
                                            AlreadyExists = 1;
                                        }
                                    });
                                });
                                //result.user.email
                                var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
                                    unsubscribe();
                                    // Check if we are already signed-in Firebase with the correct user.
                                    if (!isUserEqual(resultt, firebaseUser) && okToAuth === 1) {
                                        // Build Firebase credential with the Google ID token.
                                        var credential = firebase.auth.GoogleAuthProvider.credential(
                                            resultt.idToken,
                                            resultt.accessToken);

                                        // Sign in with credential from the Google user.
                                        firebase.auth().signInWithCredential(credential).then(function (result) {
                                            if (AlreadyExists === 0)
                                                firebase
                                                    .database()
                                                    .ref('/accounts/' + result.user.uid)
                                                    .set({
                                                        type: accType,
                                                        edited: 0,
                                                        email: result.user.email
                                                    });
                                            Alert.alert('User signed in with Google!');
                                        }).catch((error) => {
                                            // Handle Errors here.
                                            var errorCode = error.code;
                                            var errorMessage = error.message;
                                            // The email of the user's account used.
                                            var email = error.email;
                                            // The firebase.auth.AuthCredential type that was used.
                                            var credential = error.credential;
                                            // ...
                                            Alert.alert('Error, try again later!');
                                        });
                                    } else {
                                        if (okToAuth === 1) {
                                            Alert.alert('User already signed-in Firebase.');
                                        } else Alert.alert('Contul tău este de alt tip!');
                                    }
                                });
                            })
                            .catch(e => {
                                Alert.alert(e.message);
                            });
                    } catch (e) {
                        Alert.alert(e.message);
                    }
                },
                loginF: async (accType) => {
                    try {
                        await Facebook.initializeAsync({
                            appId: '564337301215491',
                        });
                        const appId = '564337301215491';
                        const {
                            type,
                            token,
                            expirationDate,
                            permissions,
                            declinedPermissions,
                            user
                        } = await Facebook.logInWithReadPermissionsAsync({
                            permissions: ['email', 'public_profile'],
                        });
                        if (type === 'success') {


                            // Sign in with credential from the Facebook user.
                            fetch(`https://graph.facebook.com/me?fields=id,name,email,birthday&access_token=${token}`)
                                .then(response => response.json())
                                .then(data => { //verificam daca se logheaza in sectiunea tipului de cont pe care este email-ul
                                    //console.log(data.email);
                                    let okToAuth = 1;
                                    let AlreadyExists = 0;
                                    var database = firebase.database();
                                    var userRef = database.ref("accounts");
                                    userRef.on('value', function (snapshot) {
                                        snapshot.forEach(function (childSnapshot) {
                                            var childData = childSnapshot.val();
                                            if (childData.email === data.email && childData.type != accType) {
                                                okToAuth = 0;
                                                Alert.alert('Contul tău este de alt tip!');
                                            }
                                            if (childData.email === data.email && childData.type === accType) {
                                                AlreadyExists = 1;
                                            }
                                        });
                                    });
                                    console.log(okToAuth);
                                    if (okToAuth === 1) {
                                        const credential = firebase.auth.FacebookAuthProvider.credential(token);
                                        // Sign in with credential from the Facebook user.
                                        firebase.auth().signInWithCredential(credential).then(function (result) {
                                            if (AlreadyExists === 0)
                                                firebase
                                                    .database()
                                                    .ref('/accounts/' + result.user.uid)
                                                    .set({
                                                        type: accType,
                                                        edited: 0,
                                                        email: result.user.email
                                                    });
                                            Alert.alert('User signed in with Facebook!');
                                        }).catch((error) => {
                                            // Handle Errors here.
                                            var errorCode = error.code;
                                            var errorMessage = error.message;
                                            // The email of the user's account used.
                                            var email = error.email;
                                            // The firebase.auth.AuthCredential type that was used.
                                            var credential = error.credential;
                                            // ...
                                            Alert.alert('Error, try again later!');
                                        });
                                    }
                                })
                                .catch((error) => {
                                    // Handle Errors here.
                                    var errorCode = error.code;
                                    var errorMessage = error.message;
                                    // The email of the user's account used.
                                    var email = error.email;
                                    // The firebase.auth.AuthCredential type that was used.
                                    var credential = error.credential;
                                    // ...
                                    Alert.alert(errorMessage);
                                });
                        } else {
                            Alert.alert('Error, try again later!');
                        }
                    } catch ({ message }) {
                        alert(`Facebook Login Error: ${message}`);
                    }
                },
                passReset: async (email) => {
                    try {
                        var auth = firebase.auth();

                        auth.sendPasswordResetEmail(email).then(function () {
                            Alert.alert('Email trimis, verifică inbox!');
                        }).catch(function (error) {
                            Alert.alert('Eroare, mai încearcă.');
                        });
                    } catch (e) {
                        Alert.alert(e.message);
                    }
                }
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}