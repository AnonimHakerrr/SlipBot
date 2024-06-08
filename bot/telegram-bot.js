import { Telegraf } from 'telegraf';
import admin from 'firebase-admin';
// Ініціалізація Firebase Admin SDK
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

 const token = '6034069384:AAEXtnuQ2X3wOzAnu3B7jnJEQ4GHOMiWsX8';
const bot = new Telegraf(token, { polling: true });
bot.on('message', async (msg) => {
  const userId = msg.from.id;
  const command = msg.text.split(' ')[0];

  switch (command) {
    case '/start':
      // авторизація користувача
      const userRef = db.collection('users').doc(userId.toString());
      const userData = await userRef.get();
      if (!userData.exists) {
        await userRef.set({ userId, balance: 0 });
      }
      break;
    default:
      bot.sendMessage(userId, 'Unknown command');
  }
});

 
 


bot.startPolling();

 
