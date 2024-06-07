// import React, { useState, useEffect } from 'react';
// import { db } from './firebase';
// import { bot } from './telegram-bot';
// import Button from './components/Button';
// import Balance from './components/Balance';

// const App = () => {
//   const [balance, setBalance] = useState(0);
//   const [canCollect, setCanCollect] = useState(false);

//   useEffect(() => {
//     const userId = bot.getChatId();
//     const userRef = db.collection('users').doc(userId);
//     userRef.onSnapshot((doc) => {
//       setBalance(doc.data().balance);
//     });
//   }, []);

//    const handleCollect = async () => {
//     const userId = bot.getChatId();
//     const userRef = db.collection('users').doc(userId);
//     const userData = await userRef.get();
//     if (userData.exists) {
//       const newBalance = userData.data().balance + 1;
//       await userRef.update({ balance: newBalance });
//       setBalance(newBalance);
//       setCanCollect(false);
//       setTimeout(() => {
//         setCanCollect(true);
//       }, 5 * 60 * 1000); // 5 годин
//     }
//     };

//   return (
//     <div>
//       <Balance balance={balance} />
//       <Button onClick={handleCollect} disabled={ canCollect}>
//         Накопичити монетку
//       </Button>
//     </div>
//   );
// };

// export default App;
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import UserBalance from './UserBalance';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Telegram Bot Coin Collector</h1>
        < UserBalance />
      </div>
    </Router>
  );
}

export default App;
