import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const UserBalance = () => {
  const query = useQuery();
  const userId = query.get('userId');

  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState('');
  const [canCollect, setCanCollect] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.balance);
        const now = new Date();
        if (data.lastCollected) {
          const lastCollected = new Date(data.lastCollected.seconds * 1000);
          if (now - lastCollected < 5 * 60 * 60 * 1000) {
            setCanCollect(false);
            setTimeout(() => setCanCollect(true), 5 * 60 * 60 * 1000 - (now - lastCollected));
          }
        }
      })
      .catch((err) => console.error('Error fetching user data:', err));
  }, [userId]);

  const collectCoins = () => {
    fetch('http://localhost:3000/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBalance(data.newBalance);
          setMessage('Coins collected successfully!');
          setCanCollect(false);
          setTimeout(() => setCanCollect(true), 5 * 60 * 60 * 1000);
        } else {
          setMessage(data.message);
        }
      })
      .catch((err) => console.error('Error collecting coins:', err));
  };

  return (
    <div>
      <h1>Your Balance: {balance}</h1>
      <button onClick={collectCoins} disabled={!canCollect}>Collect Coins</button>
      <p>{message}</p>
    </div>
  );
};

export default UserBalance;
