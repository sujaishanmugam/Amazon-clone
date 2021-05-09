import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDwG0rh3YtQlGw3T4h9Qgt-f2x3NNI3U1c",
  authDomain: "clone-ed7af.firebaseapp.com",
  projectId: "clone-ed7af",
  storageBucket: "clone-ed7af.appspot.com",
  messagingSenderId: "687276045761",
  appId: "1:687276045761:web:56b8c4e69d9825ee5deb40",
  measurementId: "G-EREDMCVB6K",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export {db, auth};