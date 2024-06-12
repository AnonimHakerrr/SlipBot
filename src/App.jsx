import React, { useState, useEffect } from 'react';
import useCountdown from './components/useCountdown';
import formatTime from './components/formatTime';
import './App.css';
import './firebase/firebaseConfig';  
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; 

const db = getFirestore();
const bot = window.Telegram.WebApp;

const App = () => {
  const [balance, setBalance] = useState(0);
  const [canCollect, setCanCollect] = useState(false);
  const [accumulated, setAccumulated] = useState(0);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const { seconds, startCountdown, resetCountdown, isActive } = useCountdown(4, () => {
    const newBalance=balance+accumulated;
   
    setAccumulated(0);
    setCanCollect(true);
    updateUserBalanceInFirestore(newBalance);
    resetCountdown(); 
  });

  // Функція для збереження балансу у Firestore
  const updateUserBalanceInFirestore = async (newBalance) => {
    try {
      const userDoc = doc(db, 'users', userId.toString() );
      await setDoc(userDoc, { balance: newBalance }, { merge: true });
      console.log('User balance updated successfully');
    } catch (error) {
      console.error('Error updating user balance: ', error);
    }
  };
  const fetchUserBalance = async () => {
    try {
        const userDoc = doc(db, 'users', userId.toString() );
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
            const userData = userSnap.data();
            setBalance(userData.balance); // Встановлюємо баланс користувача в стан
        }
    } catch (error) {
        console.error('Error fetching user balance: ', error);
    }}
  useEffect(() => {
  
      if (bot.initDataUnsafe && bot.initDataUnsafe.user) {
        const userid = bot.initDataUnsafe.user.id;
        const username = bot.initDataUnsafe.user.first_name;
        setUsername(username); 
        setUserId(userid);
    
    
    
    };
    fetchUserBalance();
      }
 , []);

  const handleCollect = () => {
    
    if (canCollect) {
      setCanCollect(false);
      setAccumulated(0);
      startCountdown(4);
    }
  };

  useEffect(() => {
    let accumulationInterval;
    if (isActive) {
      accumulationInterval = setInterval(() => {
        setAccumulated((prevAccumulated) => prevAccumulated + 1.52 );
      }, 1000);
    } else {
      setAccumulated(0);
    }

    return () => clearInterval(accumulationInterval);
  }, [isActive]);
  useEffect(() => {
    const savedTimeLeft = localStorage.getItem('timeLeft');
     const savedAccumulated = localStorage.getItem('accumulated');
    const savedStartTime = localStorage.getItem('startTime');

    if (savedTimeLeft !== null  && savedAccumulated !== null && savedStartTime !== null) {
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - parseInt(savedStartTime, 10)) / 1000);
      const remainingTime = Math.max(0, parseInt(savedTimeLeft, 10) - elapsedTime);

      
      setAccumulated(parseFloat(savedAccumulated) + (elapsedTime * 1.52  ));
      setCanCollect(false);
      startCountdown(remainingTime);

    }
  }, [ ]);

  useEffect(() => {
    if (!canCollect) {
      localStorage.setItem('timeLeft', seconds);
    
      localStorage.setItem('accumulated', accumulated);
      localStorage.setItem('startTime', Date.now().toString());
    } 
    
  }, [canCollect ]);
 
 
return (
  <div>
    <h1>Username: {username}</h1>
    <h2>Balance: {balance.toFixed(2)}</h2>
    <h3>Accumulated: {accumulated.toFixed(2)}</h3>
    <button onClick={handleCollect} disabled={!canCollect}>
      {canCollect ? 'Collect' : `Wait ${formatTime(seconds)}`}
    </button>
  </div>
);

};

export default App;
