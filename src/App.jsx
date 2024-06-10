import React, { useState, useEffect } from 'react';
import { db } from './firebase/firebase-settings.js';
import Button from './components/Button';
import './App.css'; // Підключення CSS для стилізації фону

const bot = window.Telegram.WebApp;

const App = () => {
  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState('');
  const [canCollect, setCanCollect] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300); // Час до наступного накопичення (в секундах)

  useEffect(() => {
    const fetchUserData = async () => {
      if (bot.initDataUnsafe && bot.initDataUnsafe.user) {
        const userId = bot.initDataUnsafe.user.id;
        const userName = bot.initDataUnsafe.user.first_name;
        setUsername(userName); // Збереження імені користувача

        const userRef = db.collection('users').doc(userId.toString());
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          setBalance(userDoc.data().balance);
        } else {
          console.error('User does not exist in the database');
        }
      } else {
        console.error('Unable to get user data from Telegram WebApp');
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!canCollect && timeLeft > 0) {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
      } else if (timeLeft === 0) {
        setCanCollect(true); // Відновлення можливості накопичення
        setTimeLeft(300); // Скидання лічильника часу
      }
    }, 1000); // Оновлення кожну секунду

    return () => clearTimeout(timer);
  }, [canCollect, timeLeft]);

  const handleCollect = async () => {
    if (canCollect && bot.initDataUnsafe && bot.initDataUnsafe.user) {
      const userId = bot.initDataUnsafe.user.id;
      const userRef = db.collection('users').doc(userId.toString());
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const newBalance = userDoc.data().balance + 1;
        await userRef.update({ balance: newBalance });
        setBalance(newBalance);
        setCanCollect(false);
      } else {
        console.error('User does not exist in the database');
      }
    }
  };

  return (
    <div className="container">
      <div className="background"></div> {/* Анімований фон */}
      <div className="content">
        <h1>Привіт, {username}!</h1>
        <p>Накопичено: {balance} одиниць валюти</p>
        <p>Час до наступного накопичення: {Math.floor(timeLeft / 60)} хв {timeLeft % 60} сек</p>
        <Button onClick={handleCollect} disabled={!canCollect}>
          Накопити
        </Button>
      </div>
    </div>
  );
};

export default App;
