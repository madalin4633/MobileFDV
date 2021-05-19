import React, { createContext, useState } from 'react';
import {Alert} from 'react-native';
import firebase from './database/firebaseDb';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, password) => {
                    try {
                        await firebase.auth().signInWithEmailAndPassword(email, password);
                    } catch(e) {
                        Alert.alert(e.message);
                    }
                },
                register: async (email, password) => {
                    try {
                        await firebase.auth().createUserWithEmailAndPassword(email, password);
                    } catch(e) {
                        Alert.alert(e.message);
                    }
                },
                logout: async () => {
                    try {
                        await firebase.auth().signOut();
                    } catch(e){
                        console.log(e);
                    }
                },
                loginG: async () => {
                    firebase.auth.GoogleAuthProvider().then( (provider) => {
                        firebase.auth()
                    .signInWithPopup(provider)
                    .then((result) => {
                        /** @type {firebase.auth.OAuthCredential} */
                        var credential = result.credential;

                        // This gives you a Google Access Token. You can use it to access the Google API.
                        var token = credential.accessToken;
                        // The signed-in user info.
                        var user = result.user;
                        // ...
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
                    });
                    
                }
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}