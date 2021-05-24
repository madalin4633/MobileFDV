import React, { createContext, useState } from 'react';
import { Alert } from 'react-native';
import firebase from './database/firebaseDb';
import * as Google from 'expo-google-app-auth';
import Expo from 'expo';

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
                register: async (email, password) => {
                    try {
                        await firebase.auth().createUserWithEmailAndPassword(email, password);
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
                loginG: async () => {
                    const config = {
                        androidClientId: '961151676423-plkd8clo1f0je3feeegdg3r3dulva6jk.apps.googleusercontent.com',
                        iosClientId: '961151676423-9of1tr1k01kj5966a6n2pv7s2195e5rk.apps.googleusercontent.com',
                        scopes: ['profile','email']
                    };
                    try {
                        Google.logInAsync(config)
                        .then((result) => {
                            var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
                                unsubscribe();
                                // Check if we are already signed-in Firebase with the correct user.
                                if (!isUserEqual(result, firebaseUser)) {
                                  // Build Firebase credential with the Google ID token.
                                  var credential = firebase.auth.GoogleAuthProvider.credential(
                                      result.idToken,
                                      result.accessToken);
                            
                                  // Sign in with credential from the Google user.
                                  firebase.auth().signInWithCredential(credential).then(function(){
                                      Alert.alert('User signed in!'); 
                                  }).catch((error) => {
                                    // Handle Errors here.
                                    var errorCode = error.code;
                                    var errorMessage = error.message;
                                    // The email of the user's account used.
                                    var email = error.email;
                                    // The firebase.auth.AuthCredential type that was used.
                                    var credential = error.credential;
                                    // ...
                                  });
                                } else {
                                  Alert.alert('User already signed-in Firebase.');
                                }
                              });
                        })
                        .catch(e => {
                            Alert.alert(e.message);
                        });
                    } catch(e){
                        Alert.alert(e.message);
                    }
                }
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}