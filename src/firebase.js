import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCMT9V8HK7I415jK-6p-MsSol_pg6qeIjk",
    authDomain: "sliptchatbot.firebaseapp.com",
    databaseURL: "https://sliptchatbot-default-rtdb.firebaseio.com",
    projectId: "sliptchatbot",
    storageBucket: "sliptchatbot.appspot.com",
    messagingSenderId: "996241959653",
    appId: "1:996241959653:web:15e5b502bd22804e2a820c",
    measurementId: "G-R1N2MHHM7Z"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };const firebase = require('firebase-admin');

 