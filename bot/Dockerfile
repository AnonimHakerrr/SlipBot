FROM node:18.4.0-alpine  as build

 

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо файли package.json та package-lock.json з кореневої директорії проекту
COPY ../package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо всі інші файли з директорії bot в контейнер
COPY . .

# Відкриваємо порт 3000 для зв'язку
EXPOSE 3000

# Команда для запуску бота
CMD ["npm", "start"]
