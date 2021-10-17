import firebase from'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyDKON2ntxhz10Dc_Rt5RbOQTxtF3Jn9UrM",
    authDomain: "challenge-4d955.firebaseapp.com",
    projectId: "challenge-4d955",
    storageBucket: "challenge-4d955.appspot.com",
    messagingSenderId: "800955793357",
    appId: "1:800955793357:web:bb579d6baa3fed01b08e84",
    measurementId: "G-MPYYDENHW1"
  };
 
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
  