import { TelegramBot } from 'node-telegram-bot-api';

const bot = new TelegramBot('6034069384:AAEXtnuQ2X3wOzAnu3B7jnJEQ4GHOMiWsX8', { polling: true });

bot.on('message', async (msg) => {
  const userId = msg.from.id;
  const command = msg.text.split(' ')[0];
  switch (command) {
    case '/start':
      // авторизація користувача
      const userRef = db.collection('users').doc(userId);
      const userData = await userRef.get();
      if (!userData.exists) {
        await userRef.set({ userId, balance: 0 });
      }
      break;
    default:
      bot.sendMessage(userId, 'Unknown command');
  }
});

export { bot };


 
