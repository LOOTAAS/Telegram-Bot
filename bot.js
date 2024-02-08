const TelegramBot = require('node-telegram-bot-api');
const { token } = require('./config');
const { setCommands } = require('./commands');
const { handleCallbackQuery } = require('./callbackQueries');
const sequelize = require('./db');
const stateManager = require('./stateManager'); // Убедитесь, что экспортировали нужные функции


const bot = new TelegramBot(token, { polling: true });
const userStates = {};

// Инициализация команд и callback-запросов
// setCommands(bot);
// bot.on('callback_query', handleCallbackQuery(bot));

// Подключение к базе данных и запуск бота
(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Подключение к БД работает');
        await setCommands(bot); // Передайте stateManager, если нужно
        bot.on('callback_query', handleCallbackQuery(bot)); // Адаптируйте handleCallbackQuery для приема stateManager
    } catch (e) {
        console.error('Подключение к БД сломалось', e);
    }
})();