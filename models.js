const sequelize = require('sequelize');
const {DataTypes} = require('sequelize')

// define создаем объект, unique: true - уникальность объекта
// const User = sequilize.define('user', {
//     id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
//     chatId: {type: DataTypes.STRING, unique: true},
//     right: {type:DataTypes.INTEGER, defaultValue: 0},
//     wrong: {type:DataTypes.INTEGER, defaultValue: 0},
// })
//
// module.exports = User

module.exports = (sequelize, DataTypes) => {
    const EventBD = sequelize.define('EventBD', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {});
    return EventBD;
};