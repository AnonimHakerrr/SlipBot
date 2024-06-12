// useCountdown.js
import { useState, useEffect } from 'react';

const useCountdown = (initialSeconds, onDone) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isActive && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      onDone();
    }

    return () => clearInterval(intervalId);
  }, [isActive, seconds, onDone]);

  const startCountdown = (initialTime) => {
    setSeconds(initialTime);
    setIsActive(true);
  };

  const resetCountdown = () => {
    setIsActive(false);
    setSeconds(initialSeconds);
  };

  return { seconds, startCountdown, resetCountdown, isActive };
};

export default useCountdown;
