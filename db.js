const { Sequelize } = require('sequelize');

// Создание нового экземпляра Sequelize
const sequelize = new Sequelize('mydatabase', 'myuser', 'mypassword', {
    host: '147.45.109.205', // IP-адрес сервера PostgreSQL
    dialect: 'postgres',    // Используемый диалект базы данных
    port: 5433,             // Порт, на котором работает PostgreSQL
});

module.exports = sequelize;