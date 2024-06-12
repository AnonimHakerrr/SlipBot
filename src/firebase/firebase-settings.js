import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.API_TOKEN,
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

export { db }; 

 