const { StartSelectOptions, ChangeEventOptions } = require('./options')
const sequelize = require('./db')
const Sequelize = require('sequelize')
const EventBD = require('./models')(sequelize, Sequelize.DataTypes)

const { setUserState, getUserState, updateUserState } = require('./stateManager')
// Определение команд бота
async function setCommands(bot) {
  // await bot.on('text', async (msg) => {
  //   const events = await EventBD.findAll()
  //
  //   let messageText = 'Список мероприятий:\n'
  //   events.forEach((event, index) => {
  //     messageText +=
  //       `${index + 1}\n` +
  //       // `Мероприятие №${event.id}\n` +
  //       `Описание: ${event.description}\n` + // исправил ошибку здесь
  //       `Название: ${event.title}\n` +
  //       `Дата: ${event.date}\n` +
  //       `Время: ${event.time}\n` +
  //       `Место: ${event.location}\n\n\n` // Добавлена пустая строка для разделения
  //   })
  //   messageText += `Выберите действие:\n`
  //
  //   if (msg.text.includes('@FreaksFromChatBot')) {
  //     const chatId = msg.chat.id
  //     await bot.sendMessage(chatId, messageText, StartSelectOptions)
  //   } else {
  //   }
  // })
  // bot.onText(/\/start/, (msg) => {

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id

    const events = await EventBD.findAll()

      let messageText = 'Список мероприятий:\n'
      events.forEach((event, index) => {
        messageText +=
          `${index + 1}\n` +
          // `Мероприятие №${event.id}\n` +
          `Описание: ${event.description}\n` + // исправил ошибку здесь
          `Название: ${event.title}\n` +
          `Дата: ${event.date}\n` +
          `Время: ${event.time}\n` +
          `Место: ${event.location}\n\n\n` // Добавлена пустая строка для разделения
      })
      messageText += `Выберите действие:\n`

   await bot.sendMessage(chatId, messageText, StartSelectOptions)
  })
  //   const chatId = msg.chat.id
  //   bot.sendMessage(chatId, 'Выберите действие:', StartSelectOptions)
  // })
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    if (getUserState[chatId] && getUserState[chatId].state === 'ADDING_EVENT') {
      // Обработка ввода в зависимости от текущего состояния
      const currentState = getUserState[chatId].state
      switch (currentState) {
        case 'ADDING_TITLE':
          getUserState[chatId].event.title = msg.text
          // Переход к следующему шагу
          await bot.sendMessage(chatId, "Введите описание мероприятия (или пропустите этот шаг, отправив '-'):") // Пример перехода к следующему шагу
          getUserState[chatId].state = 'ADDING_DESCRIPTION'
          await bot.sendMessage(
            chatId,
            "Введите описание мероприятия (или пропустите этот шаг, отправив '-'):" + userStates[chatId].state,
          ) // Пример перехода к следующему шагу
          break
        // Добавьте обработку других состояний здесь
      }
    } else {
      // Обработка обычных команд
    }
  })
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    const state = getUserState(chatId)

    // Проверяем, ожидаем ли мы ввод от пользователя
    if (state && state.awaitingInput) {
      const inputType = state.awaitingInput // Тип ожидаемого ввода
      const userInput = msg.text // Ввод пользователя

      // Сохраняем ввод пользователя в соответствующее поле объекта event
      const event = state.event || {}
      event[inputType] = userInput // Обновляем объект event, используя inputType как ключ
      updateUserState(chatId, { event: event, awaitingInput: null }) // Сбрасываем awaitingInput
      let rusNamingFromEvent = ''
      switch (inputType) {
        case 'title':
          rusNamingFromEvent = 'Название'
          break
        case 'description':
          rusNamingFromEvent = 'Описание'
          break
        case 'date':
          rusNamingFromEvent = 'Дата'
          break
        case 'time':
          rusNamingFromEvent = 'Время'
          break
        case 'location':
          rusNamingFromEvent = 'Локация'
          break
      }
      // Уведомляем пользователя и запрашиваем следующий ввод или подтверждаем сохранение
      await bot.sendMessage(
        chatId,
        `${rusNamingFromEvent}: ${event[inputType]} сохранён. Что дальше?`,
        ChangeEventOptions,
      )
    }
  })
  // Команда для добавления мероприятия
  //Пока выключил!!!!!!!!
  // bot.onText(/\/addevent/, (msg) => {
  //   console.log(msg, 'msg')
  //   // Запросить у пользователя данные о мероприятии
  //   const chatId = msg.chat.id
  //   bot.sendMessage(
  //     chatId,
  //     'Введите данные мероприятия в формате: Название; Описание; Дата (ГГГГ-ММ-ДД); Время (ЧЧ:ММ); Местоположение',
  //   )
  //   // Для обработки ответа пользователя используйте дополнительный обработчик сообщений
  // })

  // Обработчик для сохранения данных мероприятия
  // bot.on('message', (msg) => {
  //   // Реализация логики сохранения данных мероприятия в БД
  //   // Необходимо проверить формат сообщения, чтобы соответствовал ожидаемому для мероприятия
  // })

  // Команда для просмотра мероприятий
  ////Пока выключил!!!!!!!!
  // bot.onText(/\/viewevents/, async (msg) => {
  //   const chatId = msg.chat.id
  //   // Получение списка мероприятий из БД
  //   const events = await EventBD.findAll()
  //   const message = events.map((e) => `${e.title} - ${e.date} ${e.time} - ${e.location}`).join('\n')
  //   await bot.sendMessage(chatId, message || 'Мероприятия не найдены.')
  // })
}

module.exports = { setCommands }
