function generateEditEventOptions(eventId) {
  return {
    reply_markup: JSON.stringify({
      force_reply: true,
      selective: true,
      inline_keyboard: [
        [
          { text: 'Редактировать', callback_data: `edit_event_${eventId}` },
          { text: 'Удалить', callback_data: `delete_event_${eventId}` },
          { text: 'Назад', callback_data: 'back_to_all_events' },
        ],
      ],
    }),
  }
}

module.exports = {
  generateEditEventOptions,

  //  gameOptions: {
  //     reply_markup: JSON.stringify({
  //         inline_keyboard: [
  //             [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
  //             [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
  //             [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
  //             [{text: '0', callback_data: '0'}],
  //         ]
  //     })
  // },
  //
  //  againOptions: {
  //     reply_markup: JSON.stringify({
  //         inline_keyboard: [
  //             [{text: 'Играть еще раз', callback_data: '/again'}],
  //         ]
  //     })
  // },

  StartSelectOptions: {
    reply_markup: JSON.stringify({
      force_reply: true,
      selective: true,
      inline_keyboard: [
        [{ text: 'Добавить мероприятие', callback_data: 'add_event' }],
        [{ text: 'Запланированные мероприятие', callback_data: 'view_event' }],
      ],
    }),
  },

  EditAllEventsOptions: {
    reply_markup: JSON.stringify({
      force_reply: true,
      selective: true,
      inline_keyboard: [
        [
          { text: 'Изменить', callback_data: 'edit_all_event' },
          { text: 'Назад', callback_data: 'back_to_menu' },
        ],
      ],
    }),
  },

  // EditEventOptions: {
  //     reply_markup: JSON.stringify({
  //         inline_keyboard: [
  //             [{text: "Изменить мероприятие", callback_data: 'edit_event'}],
  //             [{text: "Удалить мероприятие", callback_data: 'delete_event'}]
  //         ]
  //     })
  // },

  ChangeEventOptions: {
    reply_markup: JSON.stringify({
      force_reply: true,
      selective: true,
      inline_keyboard: [
        [{ text: 'Добавить название', callback_data: 'add_title' }],
        [{ text: 'Добавить описание', callback_data: 'add_description' }],
        [{ text: 'Добавить дату (ГГГГ-ММ-ДД)', callback_data: 'add_date' }],
        [{ text: 'Добавить время (ЧЧ:ММ)', callback_data: 'add_time' }],
        [{ text: 'Добавить местоположение', callback_data: 'add_location' }],
        [{ text: 'Сохранить', callback_data: 'save_event' }],
        [{ text: 'Назад', callback_data: 'back_to_menu' }],
      ],
    }),
  },
  SaveAndBackOptions: {
    reply_markup: JSON.stringify({
      force_reply: true,
      selective: true,
      inline_keyboard: [
        [
          // { text: 'Сохранить', callback_data: 'save_event_item' },
          { text: 'Назад', callback_data: 'back_to_event_menu' },
        ],
      ],
    }),
  },
}
