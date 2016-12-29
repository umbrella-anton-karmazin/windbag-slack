'use strict';

const randomParam = require('../utils/randomParam');

module.exports = (controller) => {

  controller.on('bot_channel_join', (bot, message) => {

    const response = randomParam(
      ':metal:, здорова!',
      'Вечер в хату, программисты',
      ':wave:, человеки!'
    );

    bot.reply(message, response);
  });
};
