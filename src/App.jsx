import React, { useState, useEffect } from 'react';
import useCountdown from './components/useCountdown';
import formatTime from './components/formatTime';
import './App.css';
import './firebase/firebaseConfig';  
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; 
import backgroundVideo from './assets/background-video.mp4';
import sliptImage from './assets/slipt.png';
import homeImage from './assets/home.png';
import taskImage from './assets/task.png';
const db = getFirestore();
const bot = window.Telegram.WebApp;

const App = () => {
  const [balance, setBalance] = useState(0);
  const [canCollect, setCanCollect] = useState(false);
  const [accumulated, setAccumulated] = useState(0);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [ progress, setProgress] = useState(0);
  const { seconds, startCountdown, resetCountdown, isActive} = useCountdown(18000, () => {
    const newBalance = balance + accumulated;
    setBalance(newBalance);
    setCanCollect(true);
    setAccumulated(0);
    setProgress(0);
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
      startCountdown(18000);
      localStorage.clear();
    }
  };

  useEffect(() => {
    let accumulationInterval;
    if (isActive) {

      accumulationInterval = setInterval(() => {
        setAccumulated((prevAccumulated) => prevAccumulated + 0.01);
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
  useEffect(() => {
    const progressValue = ((18000 - seconds) / 18000) * 100;
    setProgress(progressValue);
  }, [seconds]);
  return (
    <div className='container'>
<video className='background-video' autoPlay muted loop playsInline>
  <source src={backgroundVideo} type='video/mp4' />
</video> 
<div className='overlay'></div>


   <div className='text'>
     
     <h1>{username}</h1>
      <h2> <img src={sliptImage} alt='icon' className='balance-icon' /> : {balance.toFixed(2)}</h2>
      </div>  
      <button className='btn' onClick={handleCollect} disabled={!canCollect}>
      <div className='btn-content'>
                    {canCollect ? 'Collect' : (
                        <React.Fragment>
                            <p className='btnText'>Farming: {accumulated.toFixed(2)}</p>  
                            <span className='time'>{formatTime(seconds)}</span>
                        </React.Fragment>
                    )}
                </div>
                <div className='progress-bar' style={{ width: `${progress}%` }}></div>
        
      </button>
      <div className='footer'>
         
          <div className='social-icons'>
            <a href='#'><svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
</svg>
 <p>Home</p> </a>
            <a href='https://bit.ly/whitebit_crypt0'><svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"/>
</svg>
<p>Task</p> </a>
            <a href='#'><svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 6H5m2 3H5m2 3H5m2 3H5m2 3H5m11-1a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2M7 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
</svg>
 <p>Frends</p> </a>
          </div>
        </div>
        
    </div>
    
  );
};

export default App;
