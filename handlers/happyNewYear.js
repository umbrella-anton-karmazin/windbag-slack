'use strict';

const randomParam = require('../utils/randomParam');

module.exports = (controller) => {

  let lastUser;
  let lastChannel;

  controller.hears('(.*)', ['message_received', 'ambient'], (bot, message) => {

    if (message.user === lastUser && lastChannel === message.channel) {
      return false;
    }

    lastUser = message.user;
    lastChannel = message.channel;

    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: randomParam('snowflake', 'snowman', 'snowman_without_snow', 'champagne', 'christmas_tree', 'santa', 'vzhuh')
    });
  });
};
