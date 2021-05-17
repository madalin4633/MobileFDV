import * as firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAIldLpl-OLdjMgVzquft4M1COjLPMX6as",
    authDomain: "fabricadevoluntari.firebaseapp.com",
    databaseURL: "https://fabricadevoluntari-default-rtdb.firebaseio.com",
    projectId: "fabricadevoluntari",
    storageBucket: "fabricadevoluntari.appspot.com",
    messagingSenderId: "961151676423",
    appId: "1:961151676423:web:0c70a1b406d85b0acc7aa2",
    measurementId: "G-YJS54M09LY"
  };
  
  firebase.initializeApp(firebaseConfig);
  export default firebase;