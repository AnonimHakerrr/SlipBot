import React, { useState, useEffect } from 'react';
import useCountdown from './components/useCountdown';
import formatTime from './components/formatTime';
import './App.css';

 
 

const App = () => {
  const [balance, setBalance] = useState(0);
  const [canCollect, setCanCollect] = useState(true);
  const [accumulated, setAccumulated] = useState(0);
  const { seconds, startCountdown, resetCountdown, isActive } = useCountdown(18000, () => {
    setBalance((prevBalance) => prevBalance + accumulated);
    setAccumulated(0);
    setCanCollect(true);
    localStorage.clear();
  });

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
        setAccumulated((prevAccumulated) => prevAccumulated + (50 / 18000));
      }, 1000);
    }

    return () => clearInterval(accumulationInterval);
  }, [isActive]);

  useEffect(() => {
    const savedTimeLeft = localStorage.getItem('timeLeft');
    const savedBalance = localStorage.getItem('balance');
    const savedAccumulated = localStorage.getItem('accumulated');
    const savedStartTime = localStorage.getItem('startTime');

    if (savedTimeLeft !== null && savedBalance !== null && savedAccumulated !== null && savedStartTime !== null) {
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - parseInt(savedStartTime, 10)) / 1000);
      const remainingTime = Math.max(0, parseInt(savedTimeLeft, 10) - elapsedTime);

      setBalance(parseFloat(savedBalance));
      setAccumulated(parseFloat(savedAccumulated) + (elapsedTime * 50 / 18000));
      setCanCollect(false);
      startCountdown(remainingTime);
    }
  }, [startCountdown]);

  useEffect(() => {
    if (!canCollect) {
      localStorage.setItem('timeLeft', seconds);
      localStorage.setItem('balance', balance);
      localStorage.setItem('accumulated', accumulated);
      localStorage.setItem('startTime', Date.now().toString());
    }
}, [canCollect]);

// Приберіть змінні стану зі списку залежностей


  return (
    <div>
      <h1>Balance: {balance.toFixed(2)}</h1>
      <h2>Accumulated: {accumulated.toFixed(2)}</h2>
      <button onClick={handleCollect} disabled={!canCollect}>
        {canCollect ? 'Collect' : `Wait ${formatTime(seconds)}`}
      </button>
    </div>
  );
};

export default App;
