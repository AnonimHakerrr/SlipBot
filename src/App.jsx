import React, { useState, useEffect } from 'react';
import { db } from './firebase/firebase-settings.js';
 
import Button from './components/Button';
import Balance from './components/Balance';


 
    const bot = window.Telegram.WebApp;
 
 
const App = () => {
  const [balance, setBalance] = useState(0);
  const [canCollect, setCanCollect] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      // Перевірка наявності даних користувача
      if (bot.initDataUnsafe && bot.initDataUnsafe.user) {
        const userId = bot.initDataUnsafe.user.id; // Отримання ID користувача

        // Запит до Firebase для отримання балансу
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

    fetchBalance();
  }, []);

  const handleCollect = async () => {
    if (bot.initDataUnsafe && bot.initDataUnsafe.user) {
      const userId = bot.initDataUnsafe.user.id;
      console.log("id",userId);
      const userRef = db.collection('users').doc(userId.toString());
      const userDoc = await userRef.get();
      console.log("db",userDoc);
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
      <Balance balance={balance} />
      <Button onClick={handleCollect} disabled={ canCollect}>
        Накопичити монетку
      </Button>
    </div>
  );
};

export default App;
 
//commonjs