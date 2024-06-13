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
  const { seconds, startCountdown, resetCountdown, isActive} = useCountdown(4, () => {
    const newBalance = balance + accumulated;
    setBalance(newBalance);
    setCanCollect(true);
    setAccumulated(0);
    updateUserBalanceInFirestore(userId, newBalance);
    resetCountdown(); 
  });

  const updateUserBalanceInFirestore = async (userId, newBalance) => {
    try {
      const userDoc = doc(db, 'users', userId.toString());
      await setDoc(userDoc, { balance: newBalance }, { merge: true });
      console.log('User balance updated successfully');
    } catch (error) {
      console.error('Error updating user balance: ', error);
    }
  };

  const fetchUserBalance = async (userId) => {
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setBalance(userData.balance); // Встановлюємо баланс користувача в стан
      }
    } catch (error) {
      console.error('Error fetching user balance: ', error);
    }
  };

  useEffect(() => {
    if (bot.initDataUnsafe && bot.initDataUnsafe.user) {
      const userid = bot.initDataUnsafe.user.id;
      const username = bot.initDataUnsafe.user.first_name;
      setUsername(username);
      setUserId(userid);
      fetchUserBalance(userid);
    } 
  }, []);

  const handleCollect = () => {
    if (canCollect) {
      setCanCollect(false);
      setAccumulated(0);
      startCountdown(4);
      localStorage.clear();
    }
  };

  useEffect(() => {
    let accumulationInterval;
    if (isActive) {
      accumulationInterval = setInterval(() => {
        setAccumulated((prevAccumulated) => prevAccumulated + 1.52);
      }, 1000);
    } else {
      setAccumulated(0);
    }

    return () => clearInterval(accumulationInterval);
  }, [isActive]);

  useEffect(() => {
    const savedTimeLeft = localStorage.getItem('timeLeft');
    const savedBalance = localStorage.getItem('balance');
    const savedAccumulated = localStorage.getItem('accumulated');
    const savedStartTime = localStorage.getItem('startTime');
    const savedCanCollect = localStorage.getItem('canCollect') === 'true';

    if (savedTimeLeft !== null && savedBalance !== null && savedAccumulated !== null && savedStartTime !== null) {
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - parseInt(savedStartTime, 10)) / 1000);
      const remainingTime = Math.max(0, parseInt(savedTimeLeft, 10) - elapsedTime);
      setBalance(parseFloat(savedBalance));
      setAccumulated(parseFloat(savedAccumulated));
      setCanCollect(savedCanCollect);
      
      if (!savedCanCollect) {
        startCountdown(remainingTime);
      }
    }
  }, []);

  useEffect(() => {
    if (!canCollect) {
      localStorage.setItem('timeLeft', seconds);
      localStorage.setItem('balance', balance);
      localStorage.setItem('accumulated', accumulated);
      localStorage.setItem('startTime', Date.now().toString());
      localStorage.setItem('canCollect', canCollect);
    }
  }, [seconds, accumulated, balance, canCollect]);

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
