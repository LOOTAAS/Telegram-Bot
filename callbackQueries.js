// Обработка callback-запросов
const Sequelize = require('sequelize')
const sequelize = require('./db') // Предполагается, что './db' - это ваш файл конфигурации sequelize
const {
  StartSelectOptions,
  ChangeEventOptions,
  SaveAndBackOptions,
  // EditEventOptions,
  EditAllEventsOptions,
  generateEditEventOptions,
} = require('./options')
const { setUserState, getUserState, updateUserState } = require('./stateManager')
const EventBD = require('./models')(sequelize, Sequelize.DataTypes)

function handleCallbackQuery(bot) {
  return async (query) => {
    const chatId = query.message.chat.id
    const userState = getUserState(chatId) || {}
    const events = await EventBD.findAll()

    async function sendEventList(chatId, bot, options) {
      const events = await EventBD.findAll();
      let messageText = 'Список мероприятий:\n';
      events.forEach((event, index) => {
        messageText +=
            `${index + 1}\n` +
            // `Мероприятие №${event.id}\n` +
            `Описание: ${event.description}\n` + // исправил ошибку здесь
            `Название: ${event.title}\n` +
            `Дата: ${event.date}\n` +
            `Время: ${event.time}\n` +
            `Место: ${event.location}\n\n`; // Добавлена пустая строка для разделения
      });
      await bot.sendMessage(chatId, messageText, options);
    }

    if (query.data.startsWith('delete_event_')) {
      const eventIdToDelete = query.data.split('_')[2] // Извлечение ID события
      await EventBD.destroy({ where: { id: eventIdToDelete } })
        .then(() => bot.sendMessage(chatId, 'Мероприятие успешно удалено.'))
        .catch((error) => bot.sendMessage(chatId, `Ошибка при удалении мероприятия: ${error.message}`))
      return // Важно завершить выполнение функции после обработки
    }

    switch (query.data) {
      case 'add_event':
        setUserState(chatId, { state: 'ADDING_EVENT', event: {} })
        await bot.sendMessage(chatId, 'Что вы хотите добавить?', ChangeEventOptions)
        break
      case 'view_event':
        await sendEventList(chatId, bot, EditAllEventsOptions);
        break
      case 'edit_all_event':
        for (const event of events) {
          const messageText =
            // `Мероприятие №${event.id}\n` +
            `Название: ${event.title}\n` +
            `Описание: ${event.description}\n` +
            `Дата: ${event.date}\n` +
            `Время: ${event.time}\n` +
            `Место: ${event.location}\n\n` // Добавлена пустая строка для разделения
          const EditEventOptions = generateEditEventOptions(event.id)
          await bot.sendMessage(chatId, messageText, EditEventOptions)
        }
        break
      case 'add_title':
        updateUserState(chatId, { awaitingInput: 'title' })
        await bot.sendMessage(chatId, 'Введите название мероприятия:', SaveAndBackOptions)
        break
      case 'add_description':
        updateUserState(chatId, { awaitingInput: 'description' })
        await bot.sendMessage(chatId, 'Введите описание описание:', SaveAndBackOptions)
        break
      case 'add_date':
        updateUserState(chatId, { awaitingInput: 'date' })
        await bot.sendMessage(chatId, 'Введите дату мероприятия (ГГГГ-ММ-ДД):', SaveAndBackOptions)
        break
      case 'add_time':
        updateUserState(chatId, { awaitingInput: 'time' })
        await bot.sendMessage(chatId, 'Введите время мероприятия (ЧЧ:ММ):', SaveAndBackOptions)
        break
      case 'add_location':
        updateUserState(chatId, { awaitingInput: 'location' })
        await bot.sendMessage(chatId, 'Введите местоположение мероприятия:', SaveAndBackOptions)
        break
      case 'save_event':
        const userState = getUserState(chatId) // Получаем состояние пользователя
        console.log('11`111111', userState)
        if (!userState) {
          console.error('Состояние пользователя не найдено для chatId:', chatId)
          await bot.sendMessage(chatId, 'Произошла ошибка. Попробуйте начать сначала.')
          return
        }
        const eventDetails = userState.event || {}
        const { title = '', description = '', date = '', time = '', location = '' } = eventDetails

        // Создание и сохранение события в базе данных
        EventBD.create({
          title,
          description,
          date,
          time,
          location,
        })
          .then(() => {
            bot.sendMessage(chatId, 'Мероприятие успешно сохранено.')
            // Сброс состояния пользователя
            updateUserState(chatId, null)
          })
          .catch((error) => {
            console.error('Ошибка при сохранении мероприятия:', error)
            bot.sendMessage(chatId, 'Произошла ошибка при сохранении мероприятия.')
          })
        break
      // Дополнительные обработчики кнопок
      case 'back_to_menu':
        // Здесь код для возврата к начальному меню
        await sendEventList(chatId, bot, StartSelectOptions);
        break
      case 'back_to_event_menu':
        // Здесь код для возврата к меню заполнения
        await bot.sendMessage(chatId, 'Выберите действие:', ChangeEventOptions) // Пример
        break
      case 'back_to_all_events': {
        await sendEventList(chatId, bot, EditAllEventsOptions);
        break
      }
      case 'save_event_item':
        // Здесь код для возврата к меню заполнения
        await bot.sendMessage(chatId, 'Выберите действие:', ChangeEventOptions) // Пример

      case 'edit_event':
        const eventIdToEdit = query.data.split('_')[1] // Предполагается, что формат 'edit_event_EVENTID'
        setUserState(chatId, { state: 'EDITING_EVENT', eventId: eventIdToEdit })
        // Отправить начальное сообщение или опции для редактирования
        await bot.sendMessage(
          chatId,
          'Редактирование мероприятия. Пожалуйста, выберите, что редактировать.',
          ChangeEventOptions,
        )
        break

      // Случай для обработки действия удаления
      case 'delete_event':
        const eventIdToDelete = query.data.split('_')[1] // Предполагается, что формат 'delete_event_EVENTID'
        // Подтвердить удаление
        EventBD.destroy({ where: { id: eventIdToDelete } })
          .then(() => bot.sendMessage(chatId, 'Мероприятие успешно удалено.'))
          .catch((error) => bot.sendMessage(chatId, 'Ошибка при удалении мероприятия.'))
        break
    }
  }
}
module.exports = { handleCallbackQuery}
