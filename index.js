const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions,} = require('./options')

const token = '6865092143:AAHA0JulVoBCfAIgjRSfZRcQFHoNWenYYiI'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId)=> {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9', gameOptions)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, "Отгадывай")
}


const start= () => {
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
        if (text === '/start') {
            return  bot.sendMessage(chatId, `иди нах ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/info') {
            return  bot.sendMessage(chatId, `your message ${text}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'я хз о чем ты')
    })

    bot.on('callback_query',async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === '/again') {
           return startGame(chatId)
        }


        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Верно ${chats[chatId]}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `Нет, цифра была ${chats[chatId]}`, againOptions)
        }



        console.log(chatId)
    } )
}

start()
