import React, { useState, useEffect } from 'react';
import { db } from './firebase/firebase-settings.js';
import Button from './components/Button';
import Balance from './components/Balance';

const bot = window.Telegram.WebApp;

const App = () => {
  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState('');
  const [canCollect, setCanCollect] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (bot.initDataUnsafe && bot.initDataUnsafe.user) {
        const userId = bot.initDataUnsafe.user.id;
        const userName = bot.initDataUnsafe.user.first_name;
        setUsername(userName); // Збереження імені користувача
console.log("id",userId);
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

  const handleCollect = async () => {
    if (bot.initDataUnsafe && bot.initDataUnsafe.user) {
      const userId = bot.initDataUnsafe.user.id;
      const userRef = db.collection('users').doc(userId.toString());
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const newBalance = userDoc.data().balance + 1;
        await userRef.update({ balance: newBalance });
        setBalance(newBalance);
        setCanCollect(false);
        setTimeout(() => {
          setCanCollect(true);
        }, 5 * 60 * 1000); // 5 хвилин
      } else {
        console.error('User does not exist in the database');
      }
    } else {
      console.error('Unable to get user data from Telegram WebApp');
    }
  };

  return (
    <div>
      <h1>Привіт, {username}!</h1>
      <Balance balance={balance} />
      <Button onClick={handleCollect} disabled={!canCollect}>
        Copy
      </Button>
    </div>
  );
};

export default App;
