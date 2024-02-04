const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions,} = require('./options')

const sequelize = require('./db')

const UserModel = require('./models')

const token = '6865092143:AAHA0JulVoBCfAIgjRSfZRcQFHoNWenYYiI'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId)=> {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9', gameOptions)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, "Отгадывай")
}


const start = async ()  => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log("Подключение к БД сломалось", e)
    }

    bot.setMyCommands([
        {
            command: '/start',
            description: 'Приветствие для тебя'
        },
        {
            command: '/info',
            description: 'Переотправка твоего сообщения'
        },
        {
            command: '/game',
            description: 'Игра'
        }
    ])


    bot.on('message', async msg => {

        const text = msg.text
        const chatId = msg.chat.id

        try {
            if (text === '/start') {
                // create cоздаем запись в бд
                await UserModel.create({chatId})
                return  bot.sendMessage(chatId, `иди нах ${msg.from.first_name} ${msg.from.last_name}`)
            }
            if (text === '/info') {
                const user = await UserModel.findOne({chatId})
                return  bot.sendMessage(chatId, `your message ${text}, ${msg.from.first_name} ${msg.from.last_name}, в игре у тебя правильных ответов ${user.right}, неправильных, ${user.wrong}`)
            }
            if (text === '/game') {
                return startGame(chatId)
            }
            return bot.sendMessage(chatId, 'я хз о чем ты')
        } catch (e) {
            return  bot.sendMessage(chatId, 'Произошла какая-то ошибка')
        }


    })

    bot.on('callback_query',async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === '/again') {
           return startGame(chatId)
        }

        const user = await UserModel.findOne({chatId})

        if (data == chats[chatId]) {
            user.right += 1
            await bot.sendMessage(chatId, `Верно ${chats[chatId]}`, againOptions)
        } else {
            user.wrong += 1
            await bot.sendMessage(chatId, `Нет, цифра была ${chats[chatId]}`, againOptions)
        }

        await user.save()



        console.log(chatId)
    } )
}

start()
